import fetch from 'isomorphic-unfetch'
import map from 'lodash.map';
import size from 'lodash.size';
import values from 'lodash.values';
import keys from 'lodash.keys';
import range from 'lodash.range';
import fromPairs from 'lodash.frompairs';
import isString from 'lodash.isstring';
import union from 'lodash.union';
import merge from 'lodash.merge';
import last from 'lodash.last';

import ReactTable from "react-table";
import "react-table/react-table.css";

function preprocess(tableData) {
  const dates = union(...map(tableData, param => keys(param.values))).sort()
  return dates.reduce((data, date) => {
    return data.concat([merge(
      {},
      last(data),
      {date},
      fromPairs(
        map(tableData, (param, paramKey) => {
          return [paramKey, param.values[date]]
        })
      )
    )])
  }, [])
}

function buildSimpleColumn(openfiscaKey, description) {
  return {
    Header: description,
    accessor: item => item[openfiscaKey],
    id: openfiscaKey
  }
}

function buildColumns(tableDesc, tableData) {
  if (isString(tableDesc)) {
    return [buildSimpleColumn(tableDesc, tableData[tableDesc].description)]
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
  const dateColumn = {
      Header: 'Date d’effet',
      accessor: 'date',
    }
  const columns = [dateColumn].concat(buildColumns(desc, data))
  return <ReactTable
    data={preprocessedData}
    columns={columns}
    showPagination={false}
    defaultPageSize={preprocessedData.length}
    className="-striped -highlight"
    defaultSorted={[{id: 'date', desc: true}]}
    />
}

export default Table
