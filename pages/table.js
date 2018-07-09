import {withRouter} from 'next/router'

import ParameterTable from "../components/ParameterTable"
import Layout from '../components/Layout'

const TablePage = (props) => {
  const parameter = props.router.query
  return <Layout fullWidth={ true }>
    <ParameterTable parameter={parameter}/>
  </Layout>
  }

export default withRouter(TablePage)
