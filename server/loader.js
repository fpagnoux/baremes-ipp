/** Loads the yaml tables and sections conf and generates the routes */

const fs = require('fs')
const yaml = require('js-yaml');
const map = require('lodash.map')
const flatten = require('lodash.flatten')
const fromPairs = require('lodash.frompairs')
const get = require('lodash.get')


const resolver = require('./resolver')

async function loadSectionFile(file) {
  const fileName = file.replace('.yaml', '')
  const textContent = fs.readFileSync(`./tables/${file}`, 'utf8')
  const yamlContent = yaml.safeLoad(textContent)
  const resolvedDesc = await resolver.resolveSection(yamlContent)
  return [fileName, resolvedDesc]
}

async function loadParametersTree() {
  const sectionsFiles = fs.readdirSync('./tables')
  const resolvedFiles = await Promise.all(sectionsFiles.map(loadSectionFile))
  return fromPairs(resolvedFiles)
}

async function loadRoutes() {
  const parametersTree = await loadParametersTree()
  const routes = map(parametersTree, extractRoutes)
  return flatten(routes)
}

function addLeadingSlash(string) {
  return string.startsWith('/') ? string : `/${string}`
}

function extractRoutes(desc, path, parametersTree, parents = []) {
  const isPage = ! parents.length
  if (desc.table) {
    return [{
      route: addLeadingSlash(path),
      page: '/table',
      query: {parameter: desc.table, parents}
      }]
  }
  if (desc.subparams) {
    const sectionRoute = {
      route: addLeadingSlash(path),
      page: '/section',
      query: desc
    }
    const subRoutes = flatten(map(desc.subparams, (child, key) => {
      return extractRoutes(
        child,
        `${path}/${key}`,
        parametersTree,
        parents.concat(
          [{path: isPage && path, title: desc.title || desc.description}]
          )
        )
    }))
    return isPage ? [sectionRoute].concat(subRoutes) : subRoutes
  }
}

module.exports = {
  extractRoutes,
  loadRoutes,
}
