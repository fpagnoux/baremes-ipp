const isString = require('lodash.isstring')

function getTitle(parameter, lang, defaultToId = true) {
  if (isString(parameter.title)) {
    return parameter.title
  }
  if (parameter.title) {
    return parameter.title[lang] || parameter.title.fr
  }
  if (! lang) {
    return parameter.description
  }
  return (parameter.metadata && parameter.metadata[`description_${lang}`]) || parameter.description || (defaultToId && parameter.id)
}

module.exports = {getTitle}
