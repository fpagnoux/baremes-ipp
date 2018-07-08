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
  return <div key={index} className="rt-thead -headerGroups">
    <div className="rt-tr" role="row">
      {columns.map((column, index2) => (
        <div key={index2} className="rt-th" role="columnheader" tabIndex="-1" style={{flex:`${column.size * 100} 0 auto`, width:`${column.size * 100}px`}}>
          {column.Header}
        </div>
      ))}
    </div>
  </div>
}

function renderDatum(datum, column) {
  const value = column.accessor(datum)
  if (column.Cell) {
    return <column.Cell value={value}/>
  }
  return value
}

function renderData(data, dataColumns) {
  return <div className="rt-tbody">
    {data.map((datum, index) => {
      return  <div key={index} className="rt-tr-group" role="rowgroup">
        <div className="rt-tr" role="row">
          {dataColumns.map((column, index2) => {
            return <div key={index2} className="rt-td" role="gridcell" style={{flex: '100 0 auto', width:'100px'}}>
              <span>{renderDatum(datum, column)}</span>
            </div>
          })}
        </div>
      </div>
    })}
  </div>
}


const CustomTable = ({columns, data}) => {
  const flattenedColumns =  flattenColumns(columns)
  const dataColumns = last(flattenedColumns)
  return <div className="ReactTable -striped -highlight">
    <div className="rt-table" role="grid">
      {flattenedColumns.map(renderHeader)}
      {renderData(data, dataColumns)}
    </div>
  </div>
}

export default CustomTable
