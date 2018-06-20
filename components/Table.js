import fetch from 'isomorphic-unfetch'
import map from 'lodash.map';
import size from 'lodash.size';
import values from 'lodash.values';
import range from 'lodash.range';
import fromPairs from 'lodash.frompairs';
import isString from 'lodash.isstring';

import ReactTable from "react-table";
import "react-table/react-table.css";

function preprocess(tableData) {
  const nbRows = size(values(tableData)[0].values)

  return range(nbRows).map(index => {
    return fromPairs(
      map(tableData, (value, key) => {
        // console.log(values(value.values))
        return [key, values(value.values)[index]] // TODO: Needs sorting!
      })
    )
  })
}

function buildSimpleColumn(openfiscaKey, description) {
  return [{
    Header: description,
    accessor: item => item[openfiscaKey],
    id: openfiscaKey
  }]
}

function buildColumns(tableDesc, tableData) {
  if (isString(tableDesc)) {
    return buildSimpleColumn(tableDesc, tableData[tableDesc].description)
  }
  return map(tableDesc, (nodeDesc, description) => {
    if (isString(nodeDesc)) {
      return buildSimpleColumn(nodeDesc, description)
    }
    return {
      Header: description,
      columns: buildColumns(nodeDesc, tableData)
    }})
}

const Table = ({desc, data}) => {
  const preprocessedData = preprocess(data)
  const columns = buildColumns(desc, data)
  debugger
  return <ReactTable
    data={preprocessedData}
    columns={columns}
    showPagination={false}
    defaultPageSize={preprocessedData.length}
    className="-striped -highlight"
    />
}

export default Table
