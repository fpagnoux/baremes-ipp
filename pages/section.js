import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import map from 'lodash.map'

function renderItem(item, key, path) {
  if (item.children) {
    return <li key={key}>{item.title}
      <ol>{map(item.children, (child, childKey) => renderItem(child, childKey, `${path}${key}/`))}</ol>
    </li>
  }
  if (item.table) {
    return <li key={key}><a href={`${path}${key}`}>{item.title || item.table.description || 'No description'}</a></li>
  }
}

const Section = (props) => {
  const section = props.router.query
  const path = props.router.asPath.endsWith('/') ? props.router.asPath : props.router.asPath + '/'
  return <Layout>
    <h1 className="box"><span>{section.title}</span></h1>
    <div className="entry-content text">
      <h4>Sommaire</h4>
      <ol>
        {map(section.children, (child, key) => renderItem(child, key, path))}
      </ol>
    </div>
    </Layout>
  }
export default withRouter(Section)
