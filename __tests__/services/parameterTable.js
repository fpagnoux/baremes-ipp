import {parameterTable} from '../../services/parameterTable'

import rsaMajoration from '../assets/rsa_maj.json'

it('should build a parameterTable', () => {
  const result = parameterTable(rsaMajoration)
  expect(result.headers).toBeDefined()
  expect(result.data).toBeDefined()
  expect(result.columns).toBeDefined()
});
