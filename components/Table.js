import sum from 'lodash.sum'
import max from 'lodash.max'
import map from 'lodash.map'
import range from 'lodash.range'
import isPlainObject from 'lodash.isplainobject'

import {formatNumber, formatDate} from '../services/formatter'

function cellFormatter(value, metadata) {
  if ((! value && value !== 0) || ! metadata || ! metadata.unit) {
    return value
  }
  if (metadata.unit == '/1') {
    return formatNumber(value, { style: 'percent', maximumFractionDigits: 3 })
  }
  if (metadata.unit.startsWith('currency')) {
    const currency = metadata.unit.split('-')[1]
    return formatNumber(value, { style: 'currency', currency, maximumFractionDigits: 3 })
  }
  return value
}

// Data and colmuns Preprocessing

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
  return {headerRows, dataColumns}
}

// Rendering

//
function renderHeader(columns, index) {
  return <tr key={index}>
    {columns.map((column, index2) => (
      <th
        key={index2}
        colSpan={column.colSpan}
        rowSpan={column.rowSpan || 1}
        style={{flex: `${column.width || 1} 0 auto`, 'width': `${(column.width || 1) * 100}px`}}
        >
        {column.accessor // Add edition link only for leaf columns
          ? <span className="edit-link">{column.Header}<br/><a target="_blank" href={column.source}>Edit</a></span>
          : column.Header
        }
      </th>
    ))}
  </tr>
}

function renderDatum(datum, column) {
  const value = column.accessor(datum)
  if (column.id == 'date') {
    return formatDate(value)
  }
  if (isPlainObject(value)) {
    return cellFormatter(value.value, value)
  }
  return cellFormatter(value)
}

function renderData(data, dataColumns) {
  return data.map((datum, index) => {
    return <tr key={index}>
        {dataColumns.map((column, index2) => {
          return <td
            key={index2}
            colSpan={column.colSpan}
            style={{flex: `${column.width || 1} 0 auto`, 'width': `100px`}}
            >
            <span>{renderDatum(datum, column)}</span>
          </td>
        })}
      </tr>
  })
}

const Table = ({columns, data}) => {
  const {headerRows, dataColumns} = buildHeaders(columns)
  return <table>
    <thead>
      {headerRows.map(renderHeader)}
    </thead>
    <tbody>
      {renderData(data, dataColumns)}
    </tbody>
  </table>
}

export default Table
