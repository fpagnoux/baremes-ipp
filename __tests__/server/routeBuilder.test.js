import routeBuilder from '../../server/routeBuilder'

const extractRoutes = routeBuilder.extractRoutes

it('should create a route towards a table', () => {
  const desc = { table: {}}
  expect(extractRoutes(desc, '/rsa_montant')).toEqual([{route: '/rsa_montant', page: '/table', params: {}}])
});

it('should handle a section containing tables', () => {
  const desc = {
    "children": {
      "rsa_montant": {"table": {decription: "Montant" }},
      "rsa_forfait_logement": {"table": {decription: "Forfait logement"}},
    }
  }
  const routes = extractRoutes(desc, '/rsa')
  expect(routes[0].route).toEqual('/rsa')
  expect(routes[0].page).toEqual('/section')

  expect(routes[1].route).toEqual('/rsa/rsa_montant')
  expect(routes[1].page).toEqual('/table')
  expect(routes[1].params).toEqual({decription: "Montant" })

  expect(routes[2].route).toEqual('/rsa/rsa_forfait_logement')
  expect(routes[2].page).toEqual('/table')
  expect(routes[2].params).toEqual({decription: "Forfait logement"})
});

it('should handle a section containing sections', () => {
  const desc = {
    "children": {
      "rsa": {"children": {}}
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
    "children": {
      "contributions": {"children": {}}
    }
  }
  const routes = extractRoutes(desc, '/prestations')
  expect(routes[0].route).toEqual('/prestations')
  expect(routes[0].page).toEqual('/section')

  expect(routes[1].route).toEqual('/prestations/contributions')
  expect(routes[1].page).toEqual('/section')
});
