const isServerSide = (typeof window === 'undefined')

const env = isServerSide ? (require('dotenv').config().parsed || {}) : process.env

const basename = env.BASENAME || ''
const defaultEnBasename = basename + '/en'

module.exports = {
  basename,
  isProd: env.PRODUCTION,
  csvPath: env.CSV_PATH || '',
  basenameEnSections: env.BASENAME_EN_SECTIONS || defaultEnBasename,
  basenameEnTables: env.BASENAME_EN_TABLES || defaultEnBasename,
}
