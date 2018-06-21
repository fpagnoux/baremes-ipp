import {withRouter} from 'next/router'


import "react-table/react-table.css";
import "../style.css"

import {fetchTableData} from "../services/fetchParam"
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

export default Index
