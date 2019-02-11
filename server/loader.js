/** Loads the yaml tables and sections conf and generates the routes */

const fs = require('fs')
const yaml = require('js-yaml');
const map = require('lodash.map')
const flatten = require('lodash.flatten')
const fromPairs = require('lodash.frompairs')


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
  const routes = map(parametersTree, ((content, fileName) => extractRoutes(content, `/${fileName}`)))
  return flatten(routes)
}

function extractRoutes(desc, path) {
  if (desc.table) {
    return [{
      route: path,
      page: '/table',
      query: desc.table,
      }]
  }
  if (desc.subparams) {
    const sectionRoute = {
      route: path,
      page: '/section',
      query: desc
    }
    return [sectionRoute].concat(flatten(map(desc.subparams, (child, key) => {
      return extractRoutes(child, `${path}/${key}`)
    })))
  }
}

module.exports = {
  extractRoutes,
  loadRoutes,
}
