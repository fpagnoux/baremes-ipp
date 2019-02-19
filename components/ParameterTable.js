import {parameterTable} from '../server/parameterTable'
import {extractData} from '../services/dataPreprocesser'
import Table from '../components/Table'



const ParameterTable = ({parameter}) => {
  const {tableData, columns} = parameterTable(parameter)
  return (
    <div>
      <Table
        columns={columns}
        data={tableData}
      />
      <p className="table-doc">{parameter.documentation}</p>
    </div>
  )
}

export default ParameterTable
