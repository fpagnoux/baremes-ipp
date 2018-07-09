import sum from 'lodash.sum'
import max from 'lodash.max'
import map from 'lodash.map'
import last from 'lodash.last'
import range from 'lodash.range'

// Data and colmuns Preprocessing

function computeSize(column) {
  if (! column.columns) {
      column.size = 1
      return column.size
    }
  column.size = sum(column.columns.map(computeSize))
  return column.size
}

function computeDepth(columns) {
  return max(columns.map(column => {
    if (column.columns) {
      return 1 + computeDepth(column.columns)
    }
    return 0
  }))
}

function flattenColumns(columns) {
  columns.forEach(computeSize)
  const maxDepth = computeDepth(columns)
  const flattenedColumns = []

  for (const i of range(maxDepth + 1)) {
    flattenedColumns[i] = []
  }

  function browse(columns, depth) {
    for (const column of columns) {
      column.depth = depth
      flattenedColumns[depth].push(column)
      if (column.columns) {
        browse(column.columns, depth + 1)
      } else {
        if (depth < maxDepth) {
          for (const i of range(depth + 1, maxDepth + 1)) {
            flattenedColumns[i].push(Object.assign({}, column, {Header: ''}))
          }
        }
      }
    }
  }
  browse(columns, 0)
  return flattenedColumns
}

// Rendering

function renderHeader(columns, index) {
  return <tr key={index}>
    {columns.map((column, index2) => (
      <th key={index2} tabIndex="-1" colSpan={column.size} style={{flex:`${column.size * 100} 0 auto`, width:`${column.size * 100}px`}}>
        {column.Header}
      </th>
    ))}
  </tr>
}

function renderDatum(datum, column) {
  const value = column.accessor(datum)
  if (column.Cell) {
    return <column.Cell value={value}/>
  }
  return value
}

function renderData(data, dataColumns) {
  return data.map((datum, index) => {
    return <tr key={index}>
        {dataColumns.map((column, index2) => {
          return <td key={index2} style={{flex: '100 0 auto', width:'100px'}}>
            <span>{renderDatum(datum, column)}</span>
          </td>
        })}
      </tr>
  })
}

const Table = ({columns, data}) => {
  const flattenedColumns = flattenColumns(columns)
  const dataColumns = last(flattenedColumns)
  return <table>
    <thead>
      {flattenedColumns.map(renderHeader)}
    </thead>
    <tbody>
      {renderData(data, dataColumns)}
    </tbody>
  </table>
}

export default Table
