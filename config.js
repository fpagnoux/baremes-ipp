const isServerSide = (typeof window === 'undefined')

const env = isServerSide ? (require('dotenv').config().parsed || {}) : process.env

module.exports = {
  basename: env.BASENAME || '',
  isProd: env.PRODUCTION,
  csvPath: env.CSV_PATH || '',
}
