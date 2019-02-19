const extractData = require('../services/dataPreprocesser').extractData
const {buildColumns} = require('./columnBuilder')

function parameterTable(parameter) {
    const tableData = extractData(parameter)
    const columns = buildColumns(parameter)
    return {
      tableData,
      columns,
    }
  }

module.exports = {
  parameterTable,
}
