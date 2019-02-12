import {withRouter} from 'next/router'

import ParameterTable from "../components/ParameterTable"
import Layout from '../components/Layout'
import {basename} from '../config'

const BreadCrum = ({links}) => (
  <p><a href={basename + '/'}>Barèmes IPP</a>{links.map(({path, title}, index) => {
      if (! title) {
        return
      }
      if (! path) {
        return <span key={index}> >> {title}</span>
      }
      return <span key={index}>  >> <a href={`${basename}/${path}`}>{title}</a></span>
  })}</p>
  )

const TablePage = (props) => {
  const {parameter, parents} = props.router.query
  return <Layout fullWidth={ true }>
    <BreadCrum links={parents}/>
    <h1 className="box"><span>{parameter.description}</span></h1>
    <ParameterTable parameter={parameter}/>
  </Layout>
  }

export default withRouter(TablePage)
