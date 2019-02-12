// Polyfill to be able to use french locale
import IntlPolyfill from 'intl'
import 'intl/locale-data/jsonp/fr.js';

Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

export function formatNumber(value, options) {
  if (options && options.currency == 'AFRF') {
    return formatAFRF(value, options)
  }
  return (new Intl.NumberFormat('fr', options)).format(value)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('fr', {timeZone: 'UTC'}).format(new Date(value))
}

function formatAFRF(value, options) {
    const {currency, ...otherOptions} = options
    return formatNumber(value, {currency: 'FRF', ...otherOptions}).replace('F', 'AF')
}
