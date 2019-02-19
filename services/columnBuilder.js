// Build parameterTable columns

const map = require('lodash.map')
const filter = require('lodash.filter')
const range = require('lodash.range')
const size = require('lodash.size')
const sortBy = require('lodash.sortby')
const flow = require('lodash.flow')

function buildColumns(parameter) {
  const dateColumn = {
    Header: 'Date d’effet',
    accessor: item => item.date,
    id: 'date',
  }
  return [dateColumn, buildColumn(parameter)]
}

function buildSimpleColumn(parameter) {
  const source = parameter.source.replace('openfisca_baremes_ipp/', '') // The structure of the repo is not the typical OF structure, so we monkey patch
  return {
    Header: parameter.description || parameter.id,
    source,
    accessor: item => item[parameter.id],
    id: parameter.id,
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

module.exports = {
  buildColumn,
  buildColumns,
}
