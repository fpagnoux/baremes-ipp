import {buildColumn, buildColumns} from '../../services/columnBuilder'
import rsaMajoration from './rsa_maj.json'

const node = rsaMajoration.subparams.majoration_isolement_en_base_rsa
const leaf = node.subparams.parents_isoles_2_femmes_enceintes

it('should build a simple column', () => {
  const column = buildColumn(leaf)
  expect(column.Header).toBe(leaf.description)
  expect(column.id).toBe(leaf.id)
});

it('should build a complex column', () => {
  const column = buildColumn(node)
  expect(column.Header).toBe(node.description)
  expect(column.columns[0].Header).toBe(leaf.description)
});

it('should build metadata columns', () => {
  const column = buildColumn(rsaMajoration)
  expect(column.columns.find(column => column.id == 'reference')).toBeDefined()
});

it('should build a date column', () => {
  const columns = buildColumns(rsaMajoration)
  expect(columns[0].id).toBe('date')
});

