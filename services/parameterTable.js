const extractData = require('./dataPreprocesser').extractData
const {buildColumns} = require('./columnBuilder')
const {buildHeaders} = require('./headerBuilder')

function parameterTable(parameter, lang) {
    const data = extractData(parameter)
    const nestedColumns = buildColumns(parameter, lang)
    const {headers, columns} = buildHeaders(nestedColumns)
    return {
      columns,
      headers,
      data,
    }
  }

module.exports = {
  parameterTable,
}
