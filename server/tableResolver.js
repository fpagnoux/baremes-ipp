/** Reads a table description from the configuration files and fetch the relevant data from the OpenFisca API */

const fetch = require('isomorphic-unfetch')
const isString = require('lodash.isstring')
const mapValues = require('lodash.mapvalues')
const Promise = require('bluebird')

async function resolveTableDesc(tableDesc) {
  if (!isString(tableDesc)) {
    return await Promise.props(mapValues(tableDesc, (value) => resolveTableDesc(value)))
  }
  return await resolveParam(tableDesc)
}

async function resolveSectionDesc(sectionDesc) {
  if (sectionDesc.table) {
    const table = await resolveTableDesc(sectionDesc.table)
    return Object.assign({}, sectionDesc, {table})
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
  resolveTableDesc,
  resolveSectionDesc,
  resolveParam
}
