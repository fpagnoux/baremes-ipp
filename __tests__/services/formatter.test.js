import {formatNumber, formatDate} from '../../services/formatter'

it('formatNumber should format numbers in a French style', () => {
  expect(formatNumber(3000)).toEqual('3\xa0000')
});

it('formatNumber should format currencies in a French style', () => {
  expect(formatNumber(3000, {style: 'currency', currency: 'EUR'})).toEqual('3\xa0000,00\xa0€')
});

it('formatDate should format dates in a French style', () => {
  expect(formatDate('2019-02-01')).toEqual('01/02/2019')
});
