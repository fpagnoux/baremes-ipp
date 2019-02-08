import {withRouter} from 'next/router'

import ParameterTable from "../components/ParameterTable"
import Layout from '../components/Layout'

const TablePage = (props) => {
  const parameter = props.router.query
  return <Layout fullWidth={ true }>
    <h1 className="box"><span>{parameter.description}</span></h1>
    <ParameterTable parameter={parameter}/>
  </Layout>
  }

export default withRouter(TablePage)
