import fetch from 'isomorphic-unfetch'
import isString from 'lodash.isstring';
import mapValues from 'lodash.mapvalues';
import Promise from 'bluebird'


export async function resolveTableDesc(tableDesc) {
  if (!isString(tableDesc)) {
    return await Promise.props(mapValues(tableDesc, (value) => resolveTableDesc(value)))
  }
  return await resolveParam(tableDesc)
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
