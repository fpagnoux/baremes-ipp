import {formatNumber, formatDate} from '../../services/formatter'

it('formatNumber should format numbers in a French style', () => {
  expect(formatNumber(3000)).toEqual('3\xa0000')
});

it('formatNumber should format currencies in a French style', () => {
  expect(formatNumber(3000, {style: 'currency', currency: 'EUR'})).toEqual('3\xa0000,00\xa0€')
});

it('formatNumber should format anciens francs', () => {
  expect(formatNumber(3000, {style: 'currency', currency: 'AFRF'})).toEqual('3\xa0000,00\xa0AF')
});

it('formatDate should format dates in a French style', () => {
  expect(formatDate('2019-02-01')).toEqual('01/02/2019')
});

it('formatNumber should not remove decimals', () => {
  expect(formatNumber(0.4378, {style: 'currency', currency: 'EUR'})).toEqual('0,4378\xa0€')
});

it('formatNumber should not add decimals', () => {
  debugger;
  expect(formatNumber(2.3492, {style: 'currency', currency: 'EUR'})).toEqual('2,3492\xa0€')
});
