import fs from 'fs-extra'

import {toCSV, toXLSX, cleanDatum, generateTables} from '../../server/csv'
import rsaMajorationTable from '../assets/rsa_maj_table.json'
import rsaMajoration from '../services/rsa_maj.json'

// it('should clean a datum', () => {
//   const result = cleanDatum(rsaMajoration[0], rsaMajorationId)
//   expect(result['majoration_rsa.taux_personne_supp']).toEqual(0.4)
// });


// it('should convert to CSV', () => {
//   const result = toCSV(rsaMajoration, rsaMajorationId)
//   expect(result).toContain('2009-06-20,0.5,0.3,0.4,1.28412,0.42804')
// });

it('should create a XLSX file', (done) => {
  const result = toXLSX(rsaMajorationTable, rsaMajoration.id)
  result.xlsx.writeFile('/Users/florianpagnoux/Desktop/test.xlsx')
    .then(() => done());
})
