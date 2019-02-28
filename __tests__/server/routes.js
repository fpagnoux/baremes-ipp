import {buildSectionRoutes, buildTableRoutes, getRoutes} from '../../server/routes'

  // This 1st serie only tests the FR routes, which have an even index

it('should create a route towards a table', () => {
  const param = { table: {}}
  const route = buildTableRoutes(param, 'rsa_montant')[0]
  expect(route.route).toEqual('/rsa_montant')
});

it('should handle a section containing tables', () => {
  const param = {
    "subparams": {
      "rsa_montant": {"table": {description: "Montant" }},
      "rsa_forfait_logement": {"table": {description: "Forfait logement"}},
    }
  }
  const routes = getRoutes({rsa: param})
  expect(routes[0].route).toEqual('/rsa')
  expect(routes[0].page).toEqual('/section')

  expect(routes[2].route).toEqual('/rsa/rsa_montant')
  expect(routes[2].page).toEqual('/table')
  expect(routes[2].query.parameter).toEqual({description: "Montant" })

  expect(routes[4].route).toEqual('/rsa/rsa_forfait_logement')
  expect(routes[4].page).toEqual('/table')
  expect(routes[4].query.parameter).toEqual({description: "Forfait logement"})
});

it('should handle a section containing sections', () => {
  const param = {
    "subparams": {
      "rsa": {"subparams": {montant: { table: {}}}}
    }
  }
  const routes = getRoutes({prestations: param})
  expect(routes[0].route).toEqual('/prestations')
  expect(routes[0].page).toEqual('/section')

  expect(routes[2].route).toEqual('/prestations/rsa/montant')
  expect(routes[2].page).toEqual('/table')
});


it('should handle a section containing a list', () => {
  const param = {
    "subparams": [
      {"table": {description: "Montant"}},
      {"table": {description: "Forfait logement"}},
    ]
  }
  const routes = getRoutes({prestations: param})
  expect(routes[0].route).toEqual('/prestations')
  expect(routes[0].page).toEqual('/section')
  expect(routes[2].route).toEqual('/prestations/0')
  expect(routes[2].page).toEqual('/table')
  expect(routes[4].route).toEqual('/prestations/1')
  expect(routes[4].page).toEqual('/table')
});


// This 2nd serie test then EN routes too

it('Should use a french path if no english is specified', () => {
  const param = {}
  const sectionRoutes = buildSectionRoutes(param, 'impot-revenu')
  expect(sectionRoutes[0].route).toEqual('/impot-revenu')
  expect(sectionRoutes[1].route).toEqual('/en/impot-revenu')
  expect(sectionRoutes[0].query.translationPage).toEqual('/en/impot-revenu')
  expect(sectionRoutes[1].query.translationPage).toEqual('/impot-revenu')
});

it('Should use the english path if section english name if specified', () => {
  const param = {name_en: 'income-tax'}
  const sectionRoutes = buildSectionRoutes(param, 'impot-revenu')
  expect(sectionRoutes[0].route).toEqual('/impot-revenu')
  expect(sectionRoutes[1].route).toEqual('/en/income-tax')
});

it('Should build a french and english page for a table', () => {
  const param = {
    title: {fr: "Impôt sur le revenu", en: "Income tax"},
    name_en: 'income-tax',
    subparams: {plafond: {table:{}}}
  }
  const tableRoutes = buildTableRoutes(param, 'impot-revenu')
  expect(tableRoutes[0].route).toEqual('/impot-revenu/plafond')
  expect(tableRoutes[1].route).toEqual('/en/income-tax/plafond')
  expect(tableRoutes[0].query.parents[0]).toEqual({ path: '/impot-revenu', title: 'Impôt sur le revenu' })
  expect(tableRoutes[1].query.parents[0]).toEqual({ path: '/en/income-tax', title: 'Income tax' })
})
