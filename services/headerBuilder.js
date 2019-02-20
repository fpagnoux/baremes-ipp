const sum = require('lodash.sum')
const max = require('lodash.max')
const map = require('lodash.map')
const range = require('lodash.range')

function computeColSpan(column) {
  if (! column.columns) {
      column.colSpan = 1
      return column.colSpan
    }
  column.colSpan = sum(column.columns.map(computeColSpan))
  return column.colSpan
}

function computeDepth(columns) {
  return max(columns.map(column => {
    if (column.columns) {
      return 1 + computeDepth(column.columns)
    }
    return 1
  }))
}

function buildHeaders(columns) {
  columns.forEach(computeColSpan)
  const maxDepth = computeDepth(columns)
  const headerRows = []
  const dataColumns = []

  for (const i of range(maxDepth)) {
    headerRows[i] = []
  }

  function browse(columns, depth) {
    for (const column of columns) {
      column.depth = depth
      headerRows[depth].push(column)
      if (column.columns) {
        browse(column.columns, depth + 1)
      } else {
        column.rowSpan = maxDepth - depth
        dataColumns.push(column)
      }
    }
  }
  browse(columns, 0)
  return {headers: headerRows, columns: dataColumns}
}

module.exports = {buildHeaders}
