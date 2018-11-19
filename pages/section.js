import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import map from 'lodash.map'
import isArray from 'lodash.isarray'
import includes from 'lodash.includes'
import flow from 'lodash.flow';
import sortBy from 'lodash.sortby';

function renderSubParams(item, key, path) {
  const subParams = flow([
    x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
    x => isArray(x) ? x : sortBy(x, subParam => item?.metadata?.order.indexOf(subParam.name))
  ])(item.subparams)

  return map(subParams, subParam => {
    if (item.exclude && includes(item.exclude, subParam.name)) {
      return
    }
    const target = path ? `${path}/${key}` : key
    return renderItem(subParam, subParam.name, target)
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
    const target = path ? `${path}/${key}` : key
    return <li key={key}><a href={target}>{item.title || item.table.description || item.table.id}</a></li>
  }
}

const Section = (props) => {
  const section = props.router.query
  const subParams = flow([
    x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
    x => sortBy(x, subParam => section?.metadata?.order.indexOf(subParam.name))
  ])(section.subparams)

  return <Layout>
    <h1 className="box"><span>{section.title}</span></h1>
    <div className="entry-content text">
      <h4>Sommaire</h4>
      <ol>
        {map(subParams, subParam => renderItem(subParam, subParam.name, ''))}
      </ol>
    </div>
    </Layout>
  }
export default withRouter(Section)
