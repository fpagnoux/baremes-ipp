import {toCSV, toXLSX, cleanDatum} from '../../services/csv'

import rsaMajorationTable from '../assets/rsa_maj_table.json'
import rsaMajoration from '../assets/rsa_maj.json'

it('should clean a datum', () => {
  const result = cleanDatum(rsaMajorationTable.data[0], rsaMajoration.id)
  expect(result['majoration_montant_maximal_en_base_rsa.couples_celibataire_avec_enfant']).toEqual(0.5)
});


it('should make a CSV', () => {
  const result = toCSV(rsaMajorationTable.data, rsaMajoration.id)
  expect(result).toContain('2016-01-01,0.5,0.3,0.4')
});

it('should make a XLSX', (done) => {
  const result = toXLSX(rsaMajorationTable, rsaMajoration.id)
  // result.xlsx.writeFile('/Users/florianpagnoux/Desktop/test.xlsx').then(() => done());
  done() // Uncomment previous line to generate local xlsx
})
