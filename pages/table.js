import {withRouter} from 'next/router'

import {fetchTableData} from "../services/fetchParam"
import Table from "../components/Table"
import Layout from '../components/Layout'
import tables from "../tables.yml"

const TablePage = withRouter(({tableDesc, tableData}) => (
  <Layout fullWidth={ true }>
    <Table desc={tableDesc} data={tableData}/>
  </Layout>
  ))

TablePage.getInitialProps = async function({ query }) {
  const tableDesc = tables[query.table]
  const tableData = await fetchTableData(tableDesc)
  return {tableDesc, tableData}
}

export default TablePage
