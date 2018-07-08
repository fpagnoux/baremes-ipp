import extractData from '../../services/dataPreprocesser'
import {extractValues} from '../../services/dataPreprocesser'
import rsaForFaitLogement from './rsa_forfait_logement.json'
import rsaMajoration from './rsa_majoration.json'
import bareme from './bareme.json'

it('extractValues can extract dates from a simple parameter', () => {
  const parameter = {
    "description": "Montant de base du RSA",
    "id": "prestations.minima_sociaux.rsa.montant_de_base_du_rsa",
    "values": {
      "2016-09-01": 535.17,
      "2017-04-01": 536.78,
      "2017-09-01": 545.48,
      "2018-04-01": 550.93
    }
  }
  expect(extractValues(parameter)).toEqual({
    "prestations.minima_sociaux.rsa.montant_de_base_du_rsa": {
      "2016-09-01": 535.17,
      "2017-04-01": 536.78,
      "2017-09-01": 545.48,
      "2018-04-01": 550.93
    }})
});

it('extractValues can extract dates from a scale', () => {
  const data = extractValues(bareme)
  expect(data['impot_revenu.bareme.2.thresold']).toEqual({"2002-01-01":"9500.0","2014-01-01":"26764.0","2015-01-01":"26791.0"})
})

it('extractValues can extract dates from a parameter node', () => {
  const data = extractValues(rsaForFaitLogement)
  expect(data['prestations.minima_sociaux.rsa.forfait_logement.taux_1_personne']).toEqual({"2009-06-01": 0.12})
  expect(data['prestations.minima_sociaux.rsa.forfait_logement.taux_2_personnes']).toEqual({"2009-06-01": 0.16})
});

it('extractValues can extract dates from a custom parameter node', () => {
  const data = extractValues(rsaMajoration)
  expect(data['prestations.minima_sociaux.rsa.majoration_rsa.taux_deuxieme_personne']).toEqual({"2009-06-01": 0.5})
});

it('extractData can extract the data', () => {
  const data = extractData(rsaMajoration)
  expect(data).toHaveLength(3)
  expect(data[2].date).toBe('2009-06-20')
  expect(data[2]['prestations.minima_sociaux.rsa.majoration_parent_isole.femmes_enceintes']).toBe(1.28412)
});
