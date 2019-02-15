/** Process a parameterNode so that the data it contains are easily exploitable by React-Table */

const includes = require('lodash.includes')
const flatten = require('lodash.flatten')
const flow = require('lodash.flow')
const fromPairs = require('lodash.frompairs')
const isPlainObject = require('lodash.isplainobject')
const keys = require('lodash.keys')
const last = require('lodash.last')
const map = require('lodash.map')
const mapValues = require('lodash.mapvalues')
const merge = require('lodash.merge')
const pick = require('lodash.pick')
const pickBy = require('lodash.pickby')
const union = require('lodash.union')

const METADATA_FIELD_NAMES = ['date_parution_jo', 'reference', 'notes']


function extractData(parameterNode) {
  const values = extractValues(parameterNode)
  const dates = union(...map(values, keys)).sort()
  return dates.reduce((data, date) => {
    return data.concat([merge(
      {},
      pickBy(last(data), (_, fieldName) => ! includes(METADATA_FIELD_NAMES, fieldName)),
      {date},
      fromPairs(
        map(values, (paramValues, paramKey) => {
          return [paramKey, paramValues[date]]
        })
      )
    )])
  }, []).reverse()
}

function extractValuesFromScale(scale) {
  const bracketsValues = flow([
    x => map(x, (scaleAtInstant, date) => {
      const thresolds = keys(scaleAtInstant).sort((x, y) => Number(x) - Number(y))
      return thresolds.map((thresold, index) => {
        const prefix = `${scale.id}.${index}`
        const thresoldKey = `${prefix}.thresold`
        const valueKey = `${prefix}.value`
        const data = {}
        data[thresoldKey] = {}
        data[valueKey] = {}
        data[thresoldKey][date] = {value: Number(thresold)}
        data[valueKey][date] = {value: scaleAtInstant[thresold]}
        return data
      })
    }),
    x => flatten(x),
    x => merge({}, ...x),
  ])(scale.brackets)

  const dates = union(...map(bracketsValues, keys))

  return mapValues(bracketsValues, (bracketValues, bracketsName) => {
    for (const date of dates) {
      if (! bracketValues[date]) {
        bracketValues[date] = null
      }
    }
    return bracketValues
  })
}

function getUnitAtDate(units, date) {
  if (! isPlainObject(units)) {
    return units
  }
  const unitChangeDates = keys(units).sort().reverse()
  return units[
    unitChangeDates.find(unitChangeDate => date >= unitChangeDate)
  ]
}

function extractValues(parameterNode) {
  if (parameterNode.values) {
    const data = {}
    const unit = parameterNode.metadata && parameterNode.metadata.unit
    data[parameterNode.id] = mapValues(parameterNode.values,
      (value, date) => ({value, unit: getUnitAtDate(unit, date)})
    )
    return data
  }
  if (parameterNode.brackets) {
    return extractValuesFromScale(parameterNode)
  }
  const data = flow([
    x => map(x, extractValues),
    x => merge({}, ...x)
    ])(parameterNode.subparams || parameterNode)  // parameterNode.subparams for nodes coming straight for the Web API, parameterNode for custom nodes

  const metadata = flow([
    x => pick(x, METADATA_FIELD_NAMES),
    ])(parameterNode.metadata)

  return merge({}, data, metadata)
}

module.exports = {
  extractData,
  extractValuesFromScale,
  extractValues
}
