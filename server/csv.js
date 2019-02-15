const getDirName = require('path').dirname;

const fs = require('fs-extra');
const d3 = require('d3-dsv')
const mapValues = require('lodash.mapvalues')
const mapKeys = require('lodash.mapkeys')
const isPlainObject = require('lodash.isplainobject')
const last = require('lodash.last')

const extractData = require('../services/dataPreprocesser').extractData

function writeFile(path, contents) {
  fs.ensureDirSync(getDirName(path))
  fs.writeFileSync(path, contents)
}

function cleanValues(datum) {
  return mapValues(datum, value => {
    if (isPlainObject(value)) {
      return value.value
    }
    return value
  })
}

function cleanKeys(datum, path) {
  return mapKeys(datum, (value, key) => {
    return key.replace(new RegExp('^'+ path + '\\.'), '');
  })
}

function cleanDatum(datum, path) {
  return cleanKeys(cleanValues(datum), path)
}

function toCSV(parameter) {
  const data = extractData(parameter).map(datum => cleanDatum(datum, parameter.id))
  return d3.csvFormat(data)
}

function generateTables(parameter, path) {
  const csv = toCSV(parameter, path)
  const tableName = last(parameter.id.split('.'))
  const filePath = `csv-out/${path}/${tableName}.csv`
  writeFile(filePath, csv)
}

module.exports = {generateTables, toCSV, cleanDatum}
