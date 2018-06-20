import fetch from 'isomorphic-unfetch'
import map from 'lodash.map';
import size from 'lodash.size';
import values from 'lodash.values';
import keys from 'lodash.keys';
import range from 'lodash.range';
import fromPairs from 'lodash.frompairs';
import isString from 'lodash.isstring';

import ReactTable from "react-table";
import "react-table/react-table.css";

function preprocess(tableData) {
  const dates = keys(values(tableData)[0].values)
  return dates.map(date => {
    return Object.assign({},
      fromPairs(
        map(tableData, (param, paramKey) => {
          return [paramKey, param.values[date]]
        })
      ),
      {date}
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
  console.log(preprocessedData)
  return <ReactTable
    data={preprocessedData}
    columns={columns}
    showPagination={false}
    defaultPageSize={preprocessedData.length}
    className="-striped -highlight"
    />
}

export default Table
