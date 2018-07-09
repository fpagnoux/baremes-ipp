/** Reads a table description from the configuration files and fetch the relevant data from the OpenFisca API */

const fetch = require('isomorphic-unfetch')
const isString = require('lodash.isstring')
const mapValues = require('lodash.mapvalues')
const Promise = require('bluebird')

async function resolveTable(tableDesc) {
  if (!isString(tableDesc)) {
    return await resolveCustomTable(tableDesc)
  }
  return await resolveParam(tableDesc)
}

async function resolveCustomTable(tableDesc) {
  const tableWithResolvedChildren = await Promise.props(mapValues(tableDesc, (value) => resolveTable(value)))
  const children = mapValues(tableWithResolvedChildren, (child, description) => {
    return Object.assign({}, child, {description})
  })
  return {children}
}

async function resolveSectionDesc(sectionDesc) {
  if (sectionDesc.table) {
    const table = await resolveTable(sectionDesc.table)
    return Object.assign({}, sectionDesc, {table})
  }
  if (sectionDesc.subsection) {
    const node = await resolveParam(sectionDesc.subsection)
    node.children = mapValues(node.children, child => ({table: child}))
    return Object.assign({}, sectionDesc, node)
  }
  const resolvedChildren = await Promise.props(mapValues(sectionDesc.children, (child) => resolveSectionDesc(child)))
  return Object.assign({}, sectionDesc, { children: resolvedChildren })
}

async function resolveParam(key) {
  const param = await fetchParam(key)
  if (! param.children) {
    return param
  }
  const resolvedChildren = await Promise.props(mapValues(param.children, (childParam) => resolveParam(childParam.id)))
  return Object.assign({}, param, { children: resolvedChildren })
}

async function fetchParam(key) {
  const response = await fetch(`http://localhost:2000/parameter/${key}`)
  return await response.json()
}

module.exports = {
  resolveTable,
  resolveSectionDesc,
  resolveParam
}
