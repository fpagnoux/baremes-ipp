// Build parameterTable columns

const map = require('lodash.map')
const filter = require('lodash.filter')
const range = require('lodash.range')
const size = require('lodash.size')
const sortBy = require('lodash.sortby')
const flow = require('lodash.flow')

const msg = require('../messages')
const {getTitle} = require('./i18n')


function buildColumns(parameter, lang) {
  const dateColumn = {
    Header: msg.date[lang],
    accessor: item => item.date,
    id: 'date',
  }
  return [dateColumn, buildColumn(parameter, lang)]
}

function buildSimpleColumn(parameter, lang) {
  const source = parameter.source.replace('openfisca_baremes_ipp/', '') // The structure of the repo is not the typical OF structure, so we monkey patch
  return {
    Header: getTitle(parameter, lang),
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

function buildColumn(parameter, lang) {
  if (parameter.values) {
    return buildSimpleColumn(parameter, lang)
  }
  if (parameter.brackets) {
    return buildScaleColumn(parameter)
  }
  if (parameter.subparams) {
    return {
      Header: getTitle(parameter, lang),
      columns: flow([
        x => map(x, (subParam, name) => Object.assign({}, subParam, {name})),
        x => sortBy(x, subParam => parameter.metadata && parameter.metadata.order && parameter.metadata.order.indexOf(subParam.name)),
        x => map(x, param => buildColumn(param, lang)),
        x => x.concat(buildMetaDataColumns(parameter, lang))
      ])(parameter.subparams)
    }
  }
}

function buildMetaDataColumns(parameter, lang) {
  const metadata = {
    reference: {title: msg.references[lang], width: 1.8},
    date_parution_jo: {title: msg.parutionJO[lang], width: 1},
    notes: {title: 'Notes', width: 3.5},
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
