const getDirName = require('path').dirname;

const fs = require('fs-extra');
const d3 = require('d3-dsv')
const Excel = require('exceljs');
const mapValues = require('lodash.mapvalues')
const mapKeys = require('lodash.mapkeys')
const keys = require('lodash.keys')
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

function toCSV(tableData, parameterId) {
  const data = tableData.map(datum => cleanDatum(datum, parameterId))
  return d3.csvFormat(data)
}

function toXLSX(tableData, parameterId) {
  const data = tableData.map(datum => cleanDatum(datum, parameterId))
  const workbook = new Excel.Workbook()
  const sheet = workbook.addWorksheet(parameterId)
  const headers = keys(data[0])
  sheet.columns = headers.map(header => ({key: header}))
  sheet.addRow(headers)
  data.forEach(datum => sheet.addRow(datum))

  return workbook
}

function generateTables(parameter, path) {
  tableData = extractData(parameter)
  const csv = toCSV(tableData, parameter.id)
  const tableName = last(parameter.id.split('.'))
  const filePath = `csv-out/${path}/${tableName}.csv`
  writeFile(filePath, csv)
}

module.exports = {generateTables, toCSV, toXLSX, cleanDatum}
