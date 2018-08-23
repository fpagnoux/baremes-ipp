import {extractRoutes} from '../../server/loader'

it('should create a route towards a table', () => {
  const desc = { table: {}}
  expect(extractRoutes(desc, '/rsa_montant')).toEqual([{route: '/rsa_montant', page: '/table', query: {}}])
});

it('should handle a section containing tables', () => {
  const desc = {
    "subparams": {
      "rsa_montant": {"table": {description: "Montant" }},
      "rsa_forfait_logement": {"table": {description: "Forfait logement"}},
    }
  }
  const routes = extractRoutes(desc, '/rsa')
  expect(routes[0].route).toEqual('/rsa')
  expect(routes[0].page).toEqual('/section')

  expect(routes[1].route).toEqual('/rsa/rsa_montant')
  expect(routes[1].page).toEqual('/table')
  expect(routes[1].query).toEqual({description: "Montant" })

  expect(routes[2].route).toEqual('/rsa/rsa_forfait_logement')
  expect(routes[2].page).toEqual('/table')
  expect(routes[2].query).toEqual({description: "Forfait logement"})
});

it('should handle a section containing sections', () => {
  const desc = {
    "subparams": {
      "rsa": {"subparams": {}}
    }
  }
  const routes = extractRoutes(desc, '/prestations')
  expect(routes[0].route).toEqual('/prestations')
  expect(routes[0].page).toEqual('/section')

  expect(routes[1].route).toEqual('/prestations/rsa')
  expect(routes[1].page).toEqual('/section')
});

it('should handle a section containing subsections', () => {
  const desc = {
    "subparams": {
      "contributions": {"subparams": {}}
    }
  }
  const routes = extractRoutes(desc, '/prestations')
  expect(routes[0].route).toEqual('/prestations')
  expect(routes[0].page).toEqual('/section')

  expect(routes[1].route).toEqual('/prestations/contributions')
  expect(routes[1].page).toEqual('/section')
});

it('should handle a section containing a list', () => {
  const desc = {
    "subparams": [
      {"table": {description: "Montant"}},
      {"table": {description: "Forfait logement"}},
    ]
  }
  const routes = extractRoutes(desc, '/prestations')
  expect(routes[0].route).toEqual('/prestations')
  expect(routes[0].page).toEqual('/section')
});
