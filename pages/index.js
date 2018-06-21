import {withRouter} from 'next/router'
import map from 'lodash.map';
// import pickBy from 'lodash.pickby';
import isString from 'lodash.isstring';
import mapValues from 'lodash.mapvalues';
import Promise from 'bluebird'


import "react-table/react-table.css";
import "../style.css"
import Table from "../components/Table"
import tables from "../tables.yml"

const Index = withRouter(({tableDesc, tableData}) => (
  <Table desc={tableDesc} data={tableData}/>
  ))

Index.getInitialProps = async function({ query }) {
  const tableDesc = tables[query.table]
  const tableData = await fetchTableData(tableDesc)
  return {tableDesc, tableData}
}

async function fetchTableData(tableDesc) {
  const nodesToFetch = {}

  function browse(node) {
    if (isString(node)) {
      nodesToFetch[node] = undefined
    } else {
      Object.values(node).forEach(browse)
    }
  }

  browse(tableDesc)
  return await Promise.props(mapValues(nodesToFetch, (value, key) => fecthParam(key)))
}

async function fecthParam(key) {
  const response = await fetch(`http://localhost:5000/parameter/${key}`)
  return await response.json()
}

export default Index
