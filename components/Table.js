import map from 'lodash.map'
import keys from 'lodash.keys'
import fromPairs from 'lodash.frompairs'
import isString from 'lodash.isstring'
import union from 'lodash.union'
import merge from 'lodash.merge'
import last from 'lodash.last'

import ReactTable from 'react-table'

import { FormattedDate, IntlProvider, addLocaleData, FormattedNumber} from 'react-intl'
import fr from 'react-intl/locale-data/fr'
addLocaleData(fr)

function preprocess(parameterNode) {
  const dates = union(...map(parameterNode, param => keys(param.values))).sort()
  return dates.reduce((data, date) => {
    return data.concat([merge(
      {},
      last(data),
      {date},
      fromPairs(
        map(parameterNode, (param, paramKey) => {
          return [paramKey, param.values[date]]
        })
      )
    )])
  }, [])
}

const cellFormatter = {
  '/1': props => props.value !== undefined && <FormattedNumber value={props.value} style="percent" maximumFractionDigits={3}/>,
  'EUR': props => props.value !== undefined && <FormattedNumber value={props.value} style="currency" maximumFractionDigits={3} currency="EUR"/>,
}

function buildSimpleColumn(openfiscaKey, parameter) {
  return {
    Header: parameter.description,
    accessor: item => item[openfiscaKey],
    id: openfiscaKey,
    Cell: cellFormatter[parameter.unit]
  }
}

function buildColumns(tableDesc, parameterNode) {
  if (isString(tableDesc)) {
    return [buildSimpleColumn(tableDesc, parameterNode[tableDesc])]
  }
  return map(tableDesc, (nodeDesc, description) => {
    if (isString(nodeDesc)) {
      return buildSimpleColumn(nodeDesc, Object.assign({}, parameterNode[nodeDesc], {description}))
    }
    return {
      Header: description,
      columns: buildColumns(nodeDesc, parameterNode)
    }})
}

const Table = ({parameterNode}) => {
  const data = preprocess(parameterNode)
  console.log(data)
  const dateColumn = {
    Header: 'Date d’effet',
    accessor: 'date',
    Cell: props => <FormattedDate value={props.value}/>
  }
  return <br/>
  const columns = [dateColumn].concat(buildColumns(desc, data))
  return (<IntlProvider locale="fr">
      <ReactTable
        data={data}
        columns={columns}
        showPagination={false}
        defaultPageSize={data.length}
        className="-striped -highlight"
        defaultSorted={[{id: 'date', desc: true}]}
      />
    </IntlProvider>
    )
}

export default Table
