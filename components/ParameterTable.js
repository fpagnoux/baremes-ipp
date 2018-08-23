import map from 'lodash.map'
import range from 'lodash.range'
import size from 'lodash.size'
import isString from 'lodash.isstring'
import { FormattedDate, IntlProvider, addLocaleData, FormattedNumber} from 'react-intl'
import fr from 'react-intl/locale-data/fr'

import extractData from '../services/dataPreprocesser'
import Table from '../components/Table'

addLocaleData(fr)

function cellFormatter({value, metadata}) {
  if ((! value && ! value !== 0) || ! metadata || ! metadata.unit) {
    return value
  }
  if (metadata.unit == '/1') {
    return <FormattedNumber value={value} style="percent" maximumFractionDigits={3}/>
  }
  if (metadata.unit.startsWith('currency')) {
    const currency = metadata.unit.split('-')[1]
    return <FormattedNumber value={value} style="currency" maximumFractionDigits={3} currency={currency}/>
  }
  return value
}

function buildSimpleColumn(parameter) {
  return {
    Header: <span className="edit-link">{parameter.description || parameter.id}<br/><a target="_blank" href={parameter.source}>Edit</a></span>,
    accessor: item => item[parameter.id],
    id: parameter.id,
    Cell: cellFormatter
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
  if (parameter.subparams) {
    return {
      Header: parameter.description || parameter.id,
      columns: map(parameter.subparams, buildColumn)
    }
  }
}

const ParameterTable = ({parameter}) => {
  const data = extractData(parameter)
  const dateColumn = {
    Header: 'Date d’effet',
    accessor: item => item.date,
    id: 'date',
    Cell: props => <FormattedDate value={props.value} timeZone="UTC"/> // Input is considered to be in UTC, so dates should be formatted for the same timezone.
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
