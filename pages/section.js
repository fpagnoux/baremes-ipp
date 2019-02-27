import { withRouter } from 'next/router'
import map from 'lodash.map'
import isArray from 'lodash.isarray'
import includes from 'lodash.includes'
import flow from 'lodash.flow';
import sortBy from 'lodash.sortby';
import {Component} from 'react'

import {basename, isProd} from '../config'
import msg from '../messages'
import Layout from '../components/Layout'
import LangToggle from '../components/LangToggle'
import {getTitle} from '../services/i18n'

class Section extends Component {

  // Define computed properties

  get section() {
    return this.props.router.query.section
  }

  get path() {
    const router = this.props.router
    return router.asPath.endsWith('/') ? router.asPath : router.asPath + '/'
  }

  get subParams() {
    return flow([
      x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
      x => sortBy(x, subParam => this.section?.metadata?.order.indexOf(subParam.name))
    ])(this.section.subparams)
  }

  get lang() {
    return this.props.router.query.lang || 'fr'
  }

  // Render

  render() {
    if (isProd) {
      return this.renderSectionContent()
    }
    return <Layout>
      <LangToggle lang={this.lang} target={this.props.router.query.translationPage}/>
      <h1 className="box"><span>{getTitle(this.section, this.lang)}</span></h1>
      <div className="entry-content text">
        {this.renderSectionContent()}
      </div>
      </Layout>
  }

  renderSectionContent() {
    return (
      <div>
        <h4>{msg.sommaire[this.lang]}</h4>
        <ol>
          {map(this.subParams, subParam => this.renderItem(subParam, subParam.name, `${basename}${this.path}`))}
        </ol>
      </div>)
  }

  renderItem(item, key, path) {
    if (item.subparams && item.flat) {
      return this.renderSubParams(item, key, path)
    }
    if (item.subparams) {
      return <li key={key}>{getTitle(item, this.lang)}
        <ol>{this.renderSubParams(item, key, path)}</ol>
      </li>
    }
    if (item.table) {
      return <li key={key}>
        <a href={`${path}${key}`}>{getTitle(item, this.lang) || getTitle(item.table, this.lang)}</a>
      </li>
    }
  }

  renderSubParams(item, key, path) {
    const shouldSort = ! isArray(item.subparams) // A specific order has been explicitly defined in the conf
    const subParams = flow([
      x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
      x => shouldSort ? sortBy(x, subParam => item?.metadata?.order.indexOf(subParam.name)) : x
    ])(item.subparams)

    return map(subParams, subParam => {
      if (item.exclude && includes(item.exclude, subParam.name)) {
        return
      }
      return this.renderItem(subParam, subParam.name, `${path}${key}/`)
    })
  }
}

export default withRouter(Section)
