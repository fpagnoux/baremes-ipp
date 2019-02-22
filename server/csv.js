const getDirName = require('path').dirname;

const fs = require('fs-extra');
const d3 = require('d3-dsv')
const Excel = require('exceljs');
const mapValues = require('lodash.mapvalues')
const mapKeys = require('lodash.mapkeys')
const keys = require('lodash.keys')
const isPlainObject = require('lodash.isplainobject')
const last = require('lodash.last')

const {parameterTable} = require('../services/parameterTable')

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

function getCell(sheet, row, col) {
  return sheet.getRow(row + 1).getCell(col + 1)
}

function getFreeCellCol(sheet, row, minCol) {
  const cell = getCell(sheet, row, minCol)
  if (! isMerged(cell)) {
    return minCol
  }
  return getFreeCellCol(sheet, row, minCol + 1)
}

function isMerged(cell) {
  return cell.master != cell
}

function toXLSX(table, tableName) {
  const workbook = new Excel.Workbook()
  const sheet = workbook.addWorksheet(tableName)
  sheet.columns = table.columns.map(column => ({key: column.id, width: (column.width || 1) * 20}))


  // Fill the header
  table.headers.forEach((headerRow, row)=> {
    let col = 0
    for (const headerCell of headerRow) {
      col = getFreeCellCol(sheet, row, col)
      const cell = getCell(sheet, row, col)
      cell.value = headerCell.Header
      cell.alignment = {wrapText: true, vertical: 'middle', horizontal: 'center'}
      sheet.mergeCells(row + 1, col + 1, row + (headerCell.rowSpan || 1), col + headerCell.colSpan)
      col += headerCell.colSpan
    }
  })

  // Fill the data
  table.data.forEach(datum => sheet.addRow(cleanValues(datum)))

  return workbook
}

function generateTables(parameter, path) {
  const tableFr = parameterTable(parameter, 'fr')
  const tableEn = parameterTable(parameter, 'en')
  const tableName = last(parameter.id.split('.'))

  const csv = toCSV(tableFr.data, parameter.id)
  const filePathFr = `table-out/${path}/${tableName}.csv`
  const filePathEn = `table-out/en/${path}/${tableName}.csv`
  writeFile(filePathFr, csv)
  writeFile(filePathEn, csv)

  const xlsxFr = toXLSX(tableFr, tableName)
  const xlsxEn = toXLSX(tableEn, tableName)
  xlsxFr.xlsx.writeFile(`table-out/${path}/${tableName}.xlsx`)
  xlsxEn.xlsx.writeFile(`table-out/en/${path}/${tableName}.xlsx`)
}

module.exports = {generateTables, toCSV, toXLSX, cleanDatum}
