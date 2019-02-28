import {withRouter} from 'next/router'
import last from 'lodash.last'
import FileSaver from 'file-saver'

import msg from '../messages'
import {basename, csvPath, isProd, basenameEnSections} from '../config'
import Table from "../components/Table"
import Layout from '../components/Layout'
import LangToggle from '../components/LangToggle'
import {getTitle} from '../services/i18n'
import {parameterTable} from '../services/parameterTable'
import {toCSV, toXLSX} from '../services/csv'

const CSVLink = ({path, parameter, table}) => {
  const fileName = `${last(parameter.id.split('.'))}.csv`
  if (isProd) { // In prod, tables are statically generated
    const target = `${csvPath || basename}${path}/${fileName}`
    return <a href={target}>CSV</a>
  }
  return <a href="#" onClick={() => {
    const csv = toCSV(table.data, parameter.id)
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, fileName)
  }}>CSV</a>
}

const XSLXLink = ({path, parameter, table}) => {
  const tableName = last(parameter.id.split('.'))
  const fileName = `${tableName}.xlsx`
  if (isProd) { // In prod, tables are statically generated
    const target = `${csvPath || basename}${path}/${fileName}`
    return <a href={target}>XSLX</a>
  }
  return <a href="#" onClick={() => {
    const xlsx = toXLSX(table, tableName)
    xlsx.xlsx.writeBuffer().then(data => {
        const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
        FileSaver.saveAs(blob, `${tableName}.xlsx`)
      })
  }}>XSLX</a>
}

const BreadCrum = ({parents, lang}) => {
  const i18nBasename = (this.lang == 'fr') ? basename : basenameEnSections
  return <p>
    <a href={i18nBasename || '/'}>{msg.baremesIPP[lang]}</a>
    {parents.map(({path, title}, index) => {
      if (index === 0) { // Left-most parent is the primary section, add a link
        const target = isProd ? path.replace(/^\/en/, '') : path
        return <span key={index}>  >> <a href={`${i18nBasename}${target}`}>{title}</a></span>
      }
      if (! title) {
        return
      }
      return <span key={index}> >> {title}</span>
  })}</p>
  }

const TablePage = (props) => {
  const {parameter, parents, lang, translationPage} = props.router.query
  const path = props.router.asPath
  const table = parameterTable(parameter, lang)
  return <Layout fullWidth={ true }>
    <BreadCrum parents={parents} lang={lang}/>
    {! isProd && <LangToggle lang={lang} target={translationPage}/>}
    <h1 className="box"><span>{getTitle(parameter, lang)}</span></h1>
    <CSVLink path={path} parameter={parameter} table={table}/> <XSLXLink path={path} parameter={parameter} table={table}/>
    <Table table={table}/>
    <p className="table-doc">{parameter.documentation}</p>
  </Layout>
  }

export default withRouter(TablePage)
