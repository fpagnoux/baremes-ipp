import sum from 'lodash.sum'
import max from 'lodash.max'
import map from 'lodash.map'
import last from 'lodash.last'
import range from 'lodash.range'

// Preprocessing des data

function computeSizes(columns) {
  for (const column of columns) {
    if (! column.columns) {
      column.size = 1
    } else {
      computeSizes(column.columns)
      column.size = sum(column.columns.map(column => column.size))
    }
  }
  return columns
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
  computeSizes(columns)
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
  return <tr>
    {columns.map((column, index2) => (
      <th key={index2} tabIndex="-1" colspan={column.size} style={{flex:`${column.size * 100} 0 auto`, width:`${column.size * 100}px`}}>
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
    return <tr>
        {dataColumns.map((column, index2) => {
          return <td key={index2} style={{flex: '100 0 auto', width:'100px'}}>
            <span>{renderDatum(datum, column)}</span>
          </td>
        })}
      </tr>
  })
}


const CustomTable = ({columns, data}) => {
  const flattenedColumns =  flattenColumns(columns)
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

export default CustomTable
