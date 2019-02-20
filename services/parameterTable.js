const extractData = require('./dataPreprocesser').extractData
const {buildColumns} = require('./columnBuilder')
const {buildHeaders} = require('./headerBuilder')

function parameterTable(parameter) {
    const data = extractData(parameter)
    const nestedColumns = buildColumns(parameter)
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
