import fetch from 'isomorphic-unfetch'
import map from 'lodash.map';
import size from 'lodash.size';
import values from 'lodash.values';
import range from 'lodash.range';
import fromPairs from 'lodash.frompairs';
import isString from 'lodash.isstring';

import ReactTable from "react-table";
import "react-table/react-table.css";

// function isParameter(object) {
//   return object.id && object.values
// }

// function renderSimpleParam(node) {
//   return (
//     <table>
//       <tbody>
//         <tr>
//           <th>Date d'effet</th>
//           <th>{ node.description }</th>
//         </tr>
//         {map(node.values, (value, date) =>
//           <tr key={ date }>
//             <td>{ date }</td>
//             <td>{ value }</td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   )
// }

// function renderComplexParam(node) {
//   const
//   return (
//     <table>
//       <tbody>
//         <tr>
//           <th>Date d'effet</th>
//           <th>{ node.description }</th>
//         </tr>
//         {map(node.values, (value, date) =>
//           <tr key={ date }>
//             <td>{ date }</td>
//             <td>{ value }</td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   )
// }

function preprocess(tableData) {
  const nbRows = size(values(tableData)[0].values)

  return range(nbRows).map(index => {
    return fromPairs(
      map(tableData, (value, key) => {
        // console.log(values(value.values))
        return [key, values(value.values)[index]] // TODO: Needs sorting!
      })
    )
  })
}


function getColumns(tableDesc, tableData) {
  if (isString(tableDesc)) {
    const nodeKey = tableDesc
    return [{
      Header: tableData[nodeKey].description,
      accessor: item => item[nodeKey],
      id: nodeKey
    }]
  }
  return map(tableDesc, (node, description) => {
    if (isString(node)) {
      // console.log(node)
      return {
        Header: description,
        accessor: item => {console.log(item[node]); return item[node]},
        id: node
      }
    }
    return {
      Header: description,
      columns: getColumns(node, tableData)
    }})
}

const Table = ({desc, data}) => {
  const preprocessedData = preprocess(data)
  const columns = getColumns(desc, data)
  debugger
  return <ReactTable
    data={preprocessedData}
    columns={columns}
    showPagination={false}
    defaultPageSize={preprocessedData.length}
    className="-striped -highlight"
    />
  // if (isParameter(node)) {
  //   return <br/>
  // } else {
  //   return (<pre>{JSON.stringify(node)}</pre>)
  // }
}

export default Table
