import map from 'lodash.map'
import range from 'lodash.range'
import size from 'lodash.size'
import isString from 'lodash.isstring'
import { FormattedDate, IntlProvider, addLocaleData, FormattedNumber} from 'react-intl'
import fr from 'react-intl/locale-data/fr'

import extractData from '../services/dataPreprocesser'
import Table from '../components/Table'

addLocaleData(fr)

const cellFormatter = {
  '/1': props => props.value !== undefined && <FormattedNumber value={props.value} style="percent" maximumFractionDigits={3}/>,
  'EUR': props => props.value !== undefined && <FormattedNumber value={props.value} style="currency" maximumFractionDigits={3} currency="EUR"/>,
}

function buildSimpleColumn(parameter) {
  return {
    Header: <span className="edit-link">{parameter.description || parameter.id}<br/><a target="_blank" href={parameter.source}>Edit</a></span>,
    accessor: item => item[parameter.id],
    id: parameter.id,
    Cell: cellFormatter[parameter.unit]
  }
}

function buildScaleColumn(scale) {
  const maxNbTranche = Math.max(...map(scale.brackets, bracket => size(bracket)))
  return {
    Header: scale.description || scale.id,
    columns: map(range(maxNbTranche), index => {
      return {
        Header: `Tranche ${index}`,
        columns: [{
          Header: 'Seuil',
          accessor: item => item[`${scale.id}.${index}.thresold`],
          id: `${scale.id}.${index}.thresold`
        }, {
          Header: 'Valeur',
          accessor: item => item[`${scale.id}.${index}.value`],
          id: `${scale.id}.${index}.value`
        }]
      }
    })
  }
}

function buildColumn(parameter) {
  if (parameter.values) {
    return buildSimpleColumn(parameter)
  }
  if (parameter.brackets) {
    return buildScaleColumn(parameter)
  }
  if (parameter.children) {
    return {
      Header: parameter.description || parameter.id,
      columns: map(parameter.children, buildColumn)
    }
  }
}

const ParameterTable = ({parameter}) => {
  const data = extractData(parameter)
  const dateColumn = {
    Header: 'Date d’effet',
    accessor: item => item.date,
    id: 'date',
    Cell: props => <FormattedDate value={props.value}/>
  }
  const columns = [dateColumn, buildColumn(parameter)]
  return (
    <IntlProvider locale="fr">
      <Table
        columns={columns}
        data={data}
      />
    </IntlProvider>
  )
}

export default ParameterTable
