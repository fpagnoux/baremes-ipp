import { withRouter } from 'next/router'
import map from 'lodash.map'
import isArray from 'lodash.isarray'
import includes from 'lodash.includes'
import flow from 'lodash.flow';
import sortBy from 'lodash.sortby';

import Layout from '../components/Layout'
import {basename, isProd} from '../config'

function renderSubParams(item, key, path) {
  const shouldSort = ! isArray(item.subparams) // A specific order has been explicitly defined in the conf
  const subParams = flow([
    x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
    x => shouldSort ? sortBy(x, subParam => item?.metadata?.order.indexOf(subParam.name)) : x
  ])(item.subparams)

  return map(subParams, subParam => {
    if (item.exclude && includes(item.exclude, subParam.name)) {
      return
    }
    return renderItem(subParam, subParam.name, `${path}${key}/`)
  })
}

function renderItem(item, key, path) {
  if (item.subparams && item.flat) {
    return renderSubParams(item, key, path)
  }
  if (item.subparams) {
    return <li key={key}>{item.title || item.description || item.id}
      <ol>{renderSubParams(item, key, path)}</ol>
    </li>
  }
  if (item.table) {
    return <li key={key}><a href={`${path}${key}`}>{item.title || item.table.description || item.table.id}</a></li>
  }
}

function renderSectionContent(subParams, path) {
  return (
    <div>
      <h4>Sommaire</h4>
      <ol>
        {map(subParams, subParam => renderItem(subParam, subParam.name, `${basename}${path}`))}
      </ol>
    </div>)
}

const Section = (props) => {
  const section = props.router.query
  const path = props.router.asPath.endsWith('/') ? props.router.asPath : props.router.asPath + '/'
  const subParams = flow([
    x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
    x => sortBy(x, subParam => section?.metadata?.order.indexOf(subParam.name))
  ])(section.subparams)


  if (isProd) {
    return renderSectionContent(subParams, path)
  }

  return <Layout>
    <h1 className="box"><span>{section.title}</span></h1>
    <div className="entry-content text">
      {renderSectionContent(subParams, path)}
    </div>
    </Layout>
  }
export default withRouter(Section)
