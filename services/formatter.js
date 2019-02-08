// Polyfill to be able to use french locale
import IntlPolyfill from 'intl'

Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

export function formatNumber(value, options) {
  return (new Intl.NumberFormat('fr', options)).format(value)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('fr', {timeZone: 'UTC'}).format(new Date(value))
}
