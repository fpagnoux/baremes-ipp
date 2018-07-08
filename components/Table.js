import map from 'lodash.map'
import range from 'lodash.range'
import size from 'lodash.size'
import isString from 'lodash.isstring'
import { FormattedDate, IntlProvider, addLocaleData, FormattedNumber} from 'react-intl'
import fr from 'react-intl/locale-data/fr'

import extractData from '../services/dataPreprocesser'
import CustomTable from '../components/customTable'

addLocaleData(fr)

const cellFormatter = {
  '/1': props => props.value !== undefined && <FormattedNumber value={props.value} style="percent" maximumFractionDigits={3}/>,
  'EUR': props => props.value !== undefined && <FormattedNumber value={props.value} style="currency" maximumFractionDigits={3} currency="EUR"/>,
}

function buildSimpleColumn(parameter) {
  return {
    Header: <span className="edit-link">{parameter.description}<br/><a target="_blank" href={parameter.source}>Edit</a></span>,
    accessor: item => item[parameter.id],
    id: parameter.id,
    Cell: cellFormatter[parameter.unit]
  }
}

function buildColumns(parameterNode) {
  if (parameterNode.values) {
    return [buildSimpleColumn(parameterNode)]
  }
  if (parameterNode.brackets) {
    const maxNbTranche = Math.max(...map(parameterNode.brackets, bracket => size(bracket)))
    return {
      Header: parameterNode.description,
      columns: map(range(maxNbTranche), index => {
        return {
          Header: `Tranche ${index}`,
          columns: [{
            Header: 'Seuil',
            accessor: item => item[`${parameterNode.id}.${index}.thresold`],
            id: `${parameterNode.id}.${index}.thresold`
          }, {
            Header: 'Valeur',
            accessor: item => item[`${parameterNode.id}.${index}.value`],
            id: `${parameterNode.id}.${index}.value`
          }]
        }
      })
    }
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
    accessor: item => item.date,
    id: 'date',
    Cell: props => <FormattedDate value={props.value}/>
  }
  const columns = [dateColumn].concat(buildColumns(parameterNode))
  return (
    <IntlProvider locale="fr">
      <CustomTable
        columns={columns}
        data={data}
      />
    </IntlProvider>
  )
}

export default Table
