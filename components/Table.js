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

function preprocess(tableData) {
  const dates = union(...map(tableData, param => keys(param.values))).sort()
  return dates.reduce((data, date) => {
    return data.concat([merge(
      {},
      last(data),
      {date},
      fromPairs(
        map(tableData, (param, paramKey) => {
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

function buildColumns(tableDesc, tableData) {
  if (isString(tableDesc)) {
    return [buildSimpleColumn(tableDesc, tableData[tableDesc])]
  }
  return map(tableDesc, (nodeDesc, description) => {
    if (isString(nodeDesc)) {
      return buildSimpleColumn(nodeDesc, Object.assign({}, tableData[nodeDesc], {description}))
    }
    return {
      Header: description,
      columns: buildColumns(nodeDesc, tableData)
    }})
}

const Table = ({desc, data}) => {
  const preprocessedData = preprocess(data)
  const dateColumn = {
    Header: 'Date d’effet',
    accessor: 'date',
    Cell: props => <FormattedDate value={props.value}/>
  }
  const columns = [dateColumn].concat(buildColumns(desc, data))
  return (<IntlProvider locale="fr">
      <ReactTable
        data={preprocessedData}
        columns={columns}
        showPagination={false}
        defaultPageSize={preprocessedData.length}
        className="-striped -highlight"
        defaultSorted={[{id: 'date', desc: true}]}
      />
    </IntlProvider>
    )
}

export default Table
