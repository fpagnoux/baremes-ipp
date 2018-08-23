import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import map from 'lodash.map'
import isArray from 'lodash.isarray'
import contains from 'lodash.contains'
import flow from 'lodash.flow';
import sortBy from 'lodash.sortby';

function renderSubParams(item, key, path) {
  const subParams = isArray(item.subparams) ? item.subparams : flow([
    x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
    x => sortBy(x, subParam => subParam?.metadata?.rank || subParam?.table?.metadata.rank)
  ])(item.subparams)

  return map(subParams, subParam => {
    if (item.exclude && contains(item.exclude, subParam.name)) {
      return
    }
    return renderItem(subParam, subParam.name, `${path}${key}/`)
  })
}

function renderItem(item, key, path) {
  if (item.subparams && (isArray(item.subparams) || item.flat)) {
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

const Section = (props) => {
  const section = props.router.query
  const path = props.router.asPath.endsWith('/') ? props.router.asPath : props.router.asPath + '/'
  const subParams = flow([
    x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
    x => sortBy(x, subParam => subParam.metadata && subParam.metadata.rank)
  ])(section.subparams)


  return <Layout>
    <h1 className="box"><span>{section.title}</span></h1>
    <div className="entry-content text">
      <h4>Sommaire</h4>
      <ol>
        {map(subParams, subParam => renderItem(subParam, subParam.name, path))}
      </ol>
    </div>
    </Layout>
  }
export default withRouter(Section)
