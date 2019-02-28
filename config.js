const isServerSide = (typeof window === 'undefined')

const env = isServerSide ? (require('dotenv').config().parsed || {}) : process.env

const basename = env.BASENAME || ''

module.exports = {
  basename,
  isProd: env.PRODUCTION,
  csvPath: env.CSV_PATH || '',
  basenameEnSections: env.BASENAME_EN_SECTIONS || basename,
  basenameEnTables: env.BASENAME_EN_TABLES || basename,
}
