import {extractValues, extractData} from '../../services/tableifier'

import rsaForFaitLogement from '../assets/rsa_forfait_logement.json'
import rsaMajoration from '../assets/rsa_majoration.json'
import bareme from '../assets/bareme.json'

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
      "2016-09-01": {value: 535.17},
      "2017-04-01": {value: 536.78},
      "2017-09-01": {value: 545.48},
      "2018-04-01": {value: 550.93}
    }})
});

it('extractValues can extract dates from a scale', () => {
  const data = extractValues(bareme)
  expect(data['impot_revenu.bareme.2.thresold']).toEqual(
    {
      "2002-01-01": {value: 9500.0},
      "2014-01-01": {value: 26764.0},
      "2015-01-01": {value: 26791.0}
    })
})

it('extractValues can extract dates from a parameter node', () => {
  const data = extractValues(rsaForFaitLogement)
  expect(data['prestations.minima_sociaux.rsa.forfait_logement.taux_1_personne']).toEqual({"2009-06-01": {value: 0.12}})
  expect(data['prestations.minima_sociaux.rsa.forfait_logement.taux_2_personnes']).toEqual({"2009-06-01": {value: 0.16}})
});

it('extractValues can extract metadata from a parameter node', () => {
  const data = extractValues(rsaForFaitLogement)
  expect(data['date_parution_jo']).toEqual({"2009-06-01": "2009-05-01"})
});

it('extractValues can extract dates from a custom parameter node', () => {
  const data = extractValues(rsaMajoration)
  expect(data['prestations.minima_sociaux.rsa.majoration_rsa.taux_deuxieme_personne']).toEqual({"2009-06-01": {value: 0.5}})
});

it('extractValues can extract a unit', () => {
  const parameter = {
    "description": "Montant de base du RSA",
    "id": "prestations.minima_sociaux.rsa.montant_de_base_du_rsa",
    "values": {
      "2016-09-01": 535.17,
      "2017-04-01": 536.78,
    },
    "metadata": {
      "unit": 'currency-EUR'
    }
  }
  expect(extractValues(parameter)).toEqual({
    "prestations.minima_sociaux.rsa.montant_de_base_du_rsa": {
      "2016-09-01": {value: 535.17, unit: "currency-EUR"},
      "2017-04-01": {value: 536.78, unit: "currency-EUR"},
    }})
});

it('extractValues can extract a chaning unit', () => {
  const parameter = {
    "description": "Montant du PSS",
    "id": "cotisations.pss",
    "values": {
      "2010-01-01": 3500,
      "2002-01-01": 3000,
      "1990-01-01": 20000,
      "1985-01-01": 15000,
    },
    "metadata": {
      "unit": {
        "2002-01-01": 'currency-EUR',
        "1985-01-01": 'currency-FRF'
      }
    }
  }
  expect(extractValues(parameter)).toEqual({
    "cotisations.pss": {
      "2010-01-01": {value: 3500, unit: "currency-EUR"},
      "2002-01-01": {value: 3000, unit: "currency-EUR"},
      "1990-01-01": {value: 20000, unit: "currency-FRF"},
      "1985-01-01": {value: 15000, unit: "currency-FRF"},
    }})
});

it('extractData can extract the data', () => {
  const data = extractData(rsaMajoration)
  expect(data).toHaveLength(3)
  expect(data[1].date).toBe('2009-06-01')
  expect(data[1]['prestations.minima_sociaux.rsa.majoration_parent_isole.femmes_enceintes'].value).toBe(1.284)
});
