import map from 'lodash.map'
import isString from 'lodash.isstring'
import ReactTable from 'react-table'
import { FormattedDate, IntlProvider, addLocaleData, FormattedNumber} from 'react-intl'
import fr from 'react-intl/locale-data/fr'

import extractData from '../services/dataPreprocesser'

addLocaleData(fr)

const cellFormatter = {
  '/1': props => props.value !== undefined && <FormattedNumber value={props.value} style="percent" maximumFractionDigits={3}/>,
  'EUR': props => props.value !== undefined && <FormattedNumber value={props.value} style="currency" maximumFractionDigits={3} currency="EUR"/>,
}

function buildSimpleColumn(parameter) {
  return {
    Header: parameter.description,
    accessor: item => item[parameter.id],
    id: parameter.id,
    Cell: cellFormatter[parameter.unit]
  }
}

function buildColumns(parameterNode) {
  if (parameterNode.values) {
    return [buildSimpleColumn(parameterNode)]
  }
  if (parameterNode.children) {
    return {
      Header: parameterNode.description,
      columns: map(parameterNode.children, subNode => {
        if (subNode.values) {
          return buildSimpleColumn(subNode)
        }
        return {
          Header: subNode.description,
          columns: buildColumns(subNode)
        }
      })
    }
  }
  return map(parameterNode,(subNode, description) => {
    if (subNode.values) {
      return buildSimpleColumn(Object.assign({}, subNode, {description}))
    }
    return {
      Header: description,
      columns: buildColumns(subNode)
    }})
}

const Table = ({parameterNode}) => {
  const data = extractData(parameterNode)
  const dateColumn = {
    Header: 'Date d’effet',
    accessor: 'date',
    Cell: props => <FormattedDate value={props.value}/>
  }
  const columns = [dateColumn].concat(buildColumns(parameterNode))
  return (
    <IntlProvider locale="fr">
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
