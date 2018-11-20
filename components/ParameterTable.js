import map from 'lodash.map'
import filter from 'lodash.filter'
import range from 'lodash.range'
import size from 'lodash.size'
import isString from 'lodash.isstring'
import sortBy from 'lodash.sortby'
import flow from 'lodash.flow'
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
  const source = parameter.source.replace('openfisca_baremes_ipp/', '') // The structure of the repo is not the typical OF structure, so we monkey patch
  return {
    Header: <span className="edit-link">{parameter.description || parameter.id}<br/><a target="_blank" href={source}>Edit</a></span>,
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
      columns: flow([
        x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
        x => sortBy(x, subParam => parameter?.metadata?.order?.indexOf(subParam.name)),
        x => map(x, buildColumn),
        x => x.concat(buildMetaDataColumns(parameter))
      ])(parameter.subparams)
    }
  }
}

function buildMetaDataColumns(parameter) {
  const metadata = {
    reference: {title: 'Références législatives', width: 1.8},
    date_parution_jo: {title: 'Parution au JO', width: 0.7},
    notes: {title: 'Notes', width: 2},
  }

  return flow([
    x => filter(x, fieldName => parameter.metadata[fieldName]),
    x => map(x, fieldName => ({
      Header: metadata[fieldName].title,
      accessor: item => item[fieldName],
      id: fieldName,
      width: metadata[fieldName].width
    }))
  ])(Object.keys(metadata))
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
      <div>
        <Table
          columns={columns}
          data={data}
        />
        <p className="table-doc">{parameter.documentation}</p>
      </div>
    </IntlProvider>
  )
}

export default ParameterTable
