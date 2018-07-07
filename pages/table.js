import {withRouter} from 'next/router'

import Table from "../components/Table"
import Layout from '../components/Layout'

const TablePage = (props) => {
  const table = props.router.query
  return <Layout fullWidth={ true }>
    <Table parameterNode={table}/>
  </Layout>
  }

export default withRouter(TablePage)
