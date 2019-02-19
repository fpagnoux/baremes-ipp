import fs from 'fs-extra'

import {toCSV, toXLSX, cleanDatum, generateTables} from '../../server/csv'
import rsaMajoration from './rsa_majoration_table.json'


const rsaMajorationId = 'prestations.minima_sociaux.rsa'


it('should clean a datum', () => {
  const result = cleanDatum(rsaMajoration[0], rsaMajorationId)
  expect(result['majoration_rsa.taux_personne_supp']).toEqual(0.4)
});


it('should convert to CSV', () => {
  const result = toCSV(rsaMajoration, rsaMajorationId)
  expect(result).toContain('2009-06-20,0.5,0.3,0.4,1.28412,0.42804')
});

it('should create a XLSX file', (done) => {
  const result = toXLSX(rsaMajoration, rsaMajorationId)
  result.xlsx.writeFile('/Users/florianpagnoux/Desktop/text.xlsx')
    .then(() => done());
})
