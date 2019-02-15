import {toCSV, cleanDatum, generateTables} from '../../server/csv'
import rsaMajoration from '../services/rsa_majoration.json'

const dirtyDatum = { date: '2009-06-20',
  'prestations.minima_sociaux.rsa.majoration_rsa.taux_deuxieme_personne': { value: 0.5, unit: undefined },
  'prestations.minima_sociaux.rsa.majoration_rsa.taux_troisieme_personne': { value: 0.3, unit: undefined },
  'prestations.minima_sociaux.rsa.majoration_rsa.taux_personne_supp': { value: 0.4, unit: undefined },
  'prestations.minima_sociaux.rsa.majoration_parent_isole.femmes_enceintes': { value: 1.28412, unit: undefined },
  'prestations.minima_sociaux.rsa.majoration_parent_isole.par_enfant_a_charge': { value: 0.42804, unit: undefined },
  'reference': 'Article X du 1er janvier 2019' }


it('should clean a datum', () => {
  const result = cleanDatum(dirtyDatum, rsaMajoration.id)
  expect(result['majoration_rsa.taux_personne_supp']).toEqual(0.4)
});


it('should convert to CSV', () => {
  const result = toCSV(rsaMajoration)
  // console.log(result)
});

it('should create a CSV', () => {
  const result = toCSV(generateTables, '')
  // console.log(result)
});
