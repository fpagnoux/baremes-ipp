/** Creates the routes from the parametersTree */

const map = require('lodash.map')
const flatten = require('lodash.flatten')

const {getTitle} = require('../services/i18n')

function getRoutes(parametersTree) {
  const sectionRoutes = map(parametersTree, buildSectionRoutes)
  const tableRoutes = map(parametersTree, buildTableRoutes)
  return flatten(sectionRoutes.concat(tableRoutes))
}

function buildSectionRoutes(parameter, path) {
  const frRoute = {
    route: addLeadingSlash(path),
    page: '/section',
    query: {section: parameter, lang: 'fr'}
  }
  const enPath = '/en/' + (parameter.name_en || path)
  const enRoute = {
    route: addLeadingSlash(enPath),
    page: frRoute.page,
    query: Object.assign({}, frRoute.query, {lang: 'en'})
  }
  frRoute.query.translationPage = enRoute.route
  enRoute.query.translationPage = frRoute.route
  return [frRoute, enRoute]
}

function buildOneTableRoutes(parameter, paths, parents) {
  const frRoute = {
    route: addLeadingSlash(paths.fr),
    page: '/table',
    query: {parameter: parameter.table, parents: parents.fr, lang: 'fr'}
  }
  const enRoute = {
    route: addLeadingSlash(paths.en),
    page: frRoute.page,
    query: {parameter: parameter.table, parents: parents.en, lang: 'en'}
  }
  frRoute.query.translationPage = enRoute.route
  enRoute.query.translationPage = frRoute.route
  return [frRoute, enRoute]
}

function buildTableRoutesRec(parameter, paths, parents = {en: [], fr: []}) {
  if (parameter.table) {
    return buildOneTableRoutes(parameter, paths, parents)
  }
  if (parameter.subparams) {
    const parentLinkFr = {path: paths.fr, title: getTitle(parameter, 'fr', false)}
    const parentLinkEn = {path: paths.en, title: getTitle(parameter, 'en', false)}
    return flatten(map(parameter.subparams, (child, key) => {
      const childPaths = {en: `${paths.en}/${key}`, fr: `${paths.fr}/${key}`}  // TODO: Allow to specify a English keys
      return buildTableRoutesRec(child,
        childPaths,
        {en: parents.en.concat([parentLinkEn]), fr: parents.fr.concat([parentLinkFr])}
      )
    }))
  }
}

function buildTableRoutes(parameter, path) {
  const enPath = '/en/' + parameter.name_en || path
  return buildTableRoutesRec(parameter, {fr: path, en: enPath})
}

function addLeadingSlash(string) {
  return string.startsWith('/') ? string : `/${string}`
}


module.exports = {getRoutes, buildSectionRoutes, buildTableRoutes}
