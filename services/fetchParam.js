import fetch from 'isomorphic-unfetch'
import isString from 'lodash.isstring';
import mapValues from 'lodash.mapvalues';
import Promise from 'bluebird'

export async function fetchTableData(tableDesc) {
  const nodesToFetch = {}

  function browse(node) {
    if (isString(node)) {
      nodesToFetch[node] = undefined
    } else {
      Object.values(node).forEach(browse)
    }
  }

  browse(tableDesc)
  return await Promise.props(mapValues(nodesToFetch, (value, key) => fecthParam(key)))
}

async function fecthParam(key) {
  const response = await fetch(`http://localhost:2000/parameter/${key}`)
  return await response.json()
}
