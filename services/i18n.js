const isString = require('lodash.isstring')

function getTitle(parameter, lang) {
  if (isString(parameter.title)) {
    return parameter.title
  }
  if (parameter.title) {
    return parameter.title[lang] || parameter.title.fr
  }
  if (! lang) {
    return parameter.description
  }
  return (parameter.metadata && parameter.metadata[`description_${lang}`]) || parameter.description || parameter.id
}

module.exports = {getTitle}
