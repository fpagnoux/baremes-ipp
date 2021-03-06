/** Loads the yaml tables and sections conf and generates the routes */

const getDirName = require('path').dirname;
const fs = require('fs-extra')
const yaml = require('js-yaml')
const map = require('lodash.map')
const flatten = require('lodash.flatten')
const fromPairs = require('lodash.frompairs')
const last = require('lodash.last')
const path = require('path')

const {parameterTable} = require('../services/parameterTable')
const {toXLSX, toCSV} = require('../services/csv')
const resolver = require('./resolver')
const {getRoutes} = require('./routes')
const {tablesDir} = require('../config')

async function loadSectionFile(file) {
  const fileName = file.replace('.yaml', '')
  const textContent = fs.readFileSync(`${tablesDir}/${file}`, 'utf8')
  const yamlContent = yaml.safeLoad(textContent)
  const resolvedDesc = await resolver.resolveSection(yamlContent)
  return [fileName, resolvedDesc]
}

async function loadParametersTree() {
  const sectionsFiles = fs.readdirSync(tablesDir)
    .filter(fileName => path.extname(fileName) == '.yaml')
  const resolvedFiles = await Promise.all(sectionsFiles.map(loadSectionFile))
  return fromPairs(resolvedFiles)
}

async function loadRoutes() {
  const parametersTree = await loadParametersTree()
  return getRoutes(parametersTree)
}

function writeFile(path, contents) {
  fs.ensureDirSync(getDirName(path))
  fs.writeFileSync(path, contents)
}

function generateStaticTables(route) {
  if (route.page != '/table') {
    return
  }
  const {parameter, lang} = route.query
  const path = route.route

  const table = parameterTable(parameter, lang)
  const tableName = last(parameter.id.split('.'))

  const csv = toCSV(table.data, parameter.id)
  const filePath = `table-out/${path}/${tableName}.csv`
  writeFile(filePath, csv)

  const xlsx = toXLSX(table, tableName)
  xlsx.xlsx.writeFile(`table-out/${path}/${tableName}.xlsx`)
}

module.exports = {
  loadRoutes,
  generateStaticTables,
}
