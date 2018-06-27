import {withRouter} from 'next/router'

import {resolveTableDesc} from "../services/tableResolver"
import Table from "../components/Table"
import Layout from '../components/Layout'
import tables from "../tables.yml"

const TablePage = withRouter(({parameterNode}) => (
  <Layout fullWidth={ true }>
    <Table parameterNode={parameterNode}/>
  </Layout>
  ))

TablePage.getInitialProps = async function({ query }) {
  const tableDesc = tables[query.table]
  const parameterNode = await resolveTableDesc(tableDesc)
  return {parameterNode}
}

export default TablePage
