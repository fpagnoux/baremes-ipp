import sum from 'lodash.sum'
import max from 'lodash.max'
import map from 'lodash.map'
import range from 'lodash.range'
import isPlainObject from 'lodash.isplainobject'

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

function renderHeader(columns, index) {
  return <tr key={index}>
    {columns.map((column, index2) => (
      <th
        key={index2}
        colSpan={column.colSpan}
        rowSpan={column.rowSpan || 1}
        style={{flex: `${column.width || 1} 0 auto`, 'width': `${(column.width || 1) * 100}px`}}
        >
        {column.Header}
      </th>
    ))}
  </tr>
}

function renderDatum(datum, column) {
  const value = column.accessor(datum)

  if (! isPlainObject(value)) {
    if (column.Cell) {
      return <column.Cell value={value}/>
    }
    return value
  }
  if (column.Cell) {
    return <column.Cell value={value.value} metadata={value}/>
  }
  return value.value
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
