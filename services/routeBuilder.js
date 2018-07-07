const map = require('lodash.map')
const flatten = require('lodash.flatten')

function extractRoutes(desc, path) {
  if (desc.table) {
    return [{
      route: path,
      page: '/table',
      params: desc.table,
      }]
  }
  if (desc.children) {
    const sectionRoute = {
      route: path,
      page: '/section',
      params: desc
    }
    return [sectionRoute].concat(flatten(map(desc.children, (child, key) => {
      return extractRoutes(child, `${path}/${key}`)
    })))
  }
}

module.exports = {
  extractRoutes,
}
