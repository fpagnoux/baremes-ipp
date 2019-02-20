import {withRouter} from 'next/router'
import last from 'lodash.last'

import Table from "../components/Table"
import Layout from '../components/Layout'
import {basename, csvPath} from '../config'

function getLinkToTable(parameter, path, format) {
  return `${csvPath || basename}${path}/${last(parameter.id.split('.'))}.${format}`
}

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
  const path = props.router.asPath
  return <Layout fullWidth={ true }>
    <BreadCrum links={parents}/>
    <h1 className="box"><span>{parameter.description}</span></h1>
    <a href={getLinkToTable(parameter, path, 'csv')}>CSV</a> <a href={getLinkToTable(parameter, path, 'xlsx')}>XSLX</a>
    <Table parameter={parameter}/>
    <p className="table-doc">{parameter.documentation}</p>
  </Layout>
  }

export default withRouter(TablePage)
