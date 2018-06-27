/** Process a parameterNode so that the data it contains are easily exploitable by React-Table */

import map from 'lodash/map';
import flow from 'lodash.flow';
import merge from 'lodash.merge';
import union from 'lodash.union';
import keys from 'lodash.keys'
import last from 'lodash.last'
import fromPairs from 'lodash.frompairs'


export default function extractData(parameterNode) {
  const values = extractValues(parameterNode)
  const dates = union(...map(values, keys)).sort()
  return dates.reduce((data, date) => {
    return data.concat([merge(
      {},
      last(data),
      {date},
      fromPairs(
        map(values, (paramValues, paramKey) => {
          return [paramKey, paramValues[date]]
        })
      )
    )])
  }, [])
}

export function extractValues(parameterNode) {
  if (parameterNode.values) {
    const data = {}
    data[parameterNode.id] = parameterNode.values
    return data
  }
  return flow([
    x => map(x, extractValues),
    x => merge({}, ...x)
    ])(parameterNode.children || parameterNode)  // parameterNode.children for nodes coming straight for the Web API, parameterNode for custom nodes
}
