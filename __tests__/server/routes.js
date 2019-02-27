import {buildSectionRoutes, buildTableRouteEn, buildTableRoutes} from '../../server/routes'


it('Should use a french path if no english is specified', () => {
  const param = {}
  const sectionRoutes = buildSectionRoutes(param, 'impot-revenu')
  expect(sectionRoutes[0].route).toEqual('/impot-revenu')
  expect(sectionRoutes[1].route).toEqual('/en/impot-revenu')
  expect(sectionRoutes[0].query.enPage).toEqual('/en/impot-revenu')
  expect(sectionRoutes[1].query.frPage).toEqual('/impot-revenu')
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
  const tableRoutes = buildTableRoutes(param, '/impot-revenu')
  expect(tableRoutes[0].route).toEqual('/impot-revenu/plafond')
  expect(tableRoutes[1].route).toEqual('/en/income-tax/plafond')
  expect(tableRoutes[0].query.parents[0]).toEqual({ path: '/impot-revenu', title: 'Impôt sur le revenu' })
  expect(tableRoutes[1].query.parents[0]).toEqual({ path: '/en/income-tax', title: 'Income tax' })
})
