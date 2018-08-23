/** Reads a table description from the configuration files and fetch the relevant data from the OpenFisca API */

const fetch = require('isomorphic-unfetch')
const isString = require('lodash.isstring')
const mapValues = require('lodash.mapvalues')
const isArray = require('lodash.isarray')
const Promise = require('bluebird')

async function resolveTable(tableDesc) {
  if (!isString(tableDesc)) {
    return await resolveCustomTable(tableDesc)
  }
  return await resolveParam(tableDesc)
}

async function resolveCustomTable(tableDesc) {
  const tableWithResolvedChildren = await Promise.props(mapValues(tableDesc, (value) => resolveTable(value)))
  const subparams = mapValues(tableWithResolvedChildren, (child, description) => {
    return Object.assign({}, child, {description})
  })
  return {subparams}
}

function makeSubsection(node, depth) {
  node.subparams = mapValues(node.subparams, child => {
    if (depth == 0 || ! child.subparams) {
      return {table: child}
    }
    return makeSubsection(child, depth - 1)
  })
  return node
}

async function resolveSection(sectionDesc) {
  if (sectionDesc.table) {
    const table = await resolveTable(sectionDesc.table)
    return Object.assign({}, sectionDesc, {table})
  }
  if (sectionDesc.subsection) {
    const node = await resolveParam(sectionDesc.subsection)
    return Object.assign({}, sectionDesc, makeSubsection(node, sectionDesc.depth || 0))
  }
  const resolvedChildren = isArray(sectionDesc.subparams)
    ? await Promise.all(sectionDesc.subparams.map(resolveSection))
    : await Promise.props(mapValues(sectionDesc.subparams, (child) => resolveSection(child)))
  return Object.assign({}, sectionDesc, { subparams: resolvedChildren })
}

async function resolveParam(key) {
  const param = await fetchParam(key)
  if (! param.subparams) {
    return param
  }
  const resolvedChildren = await Promise.props(mapValues(param.subparams, (childParam, childKey) => resolveParam(`${param.id}.${childKey}`)))
  return Object.assign({}, param, { subparams: resolvedChildren })
}

async function fetchParam(key) {
  try {
    const response = await fetch(`http://localhost:2000/parameter/${key}`)
    return await response.json()
  } catch (error) { // Try again, to deal with Mac race-conditions
    return fetchParam(key)
  }
}

module.exports = {
  resolveTable,
  resolveSection,
  resolveParam
}
