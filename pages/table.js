import {withRouter} from 'next/router'
import last from 'lodash.last'

import msg from '../messages'
import {basename, csvPath, isProd} from '../config'
import Table from "../components/Table"
import Layout from '../components/Layout'
import LangToggle from '../components/LangToggle'
import {getTitle} from '../services/i18n'

function getLinkToTable(parameter, path, format) {
  return `${csvPath || basename}${path}/${last(parameter.id.split('.'))}.${format}`
}

const BreadCrum = ({parents, lang}) => {
  return <p>
    <a href={basename + '/'}>{msg.baremesIPP[lang]}</a>
    {parents.map(({path, title}, index) => {
      if (index === 0) { // Left-most parent is the primary section, add a link
        return <span key={index}>  >> <a href={`${basename}/${path}`}>{title[lang]}</a></span>
      }
      if (! title) {
        return
      }
      return <span key={index}> >> {title[lang]}</span>
  })}</p>
  }

const TablePage = (props) => {
  const {parameter, parents, lang} = props.router.query
  const path = props.router.asPath
  return <Layout fullWidth={ true }>
    <BreadCrum parents={parents} lang={lang}/>
    {! isProd && <LangToggle lang={lang} path={path}/>}
    <h1 className="box"><span>{getTitle(parameter, lang)}</span></h1>
    <a href={getLinkToTable(parameter, path, 'csv')}>CSV</a> <a href={getLinkToTable(parameter, path, 'xlsx')}>XSLX</a>
    <Table parameter={parameter} lang={lang}/>
    <p className="table-doc">{parameter.documentation}</p>
  </Layout>
  }

export default withRouter(TablePage)
