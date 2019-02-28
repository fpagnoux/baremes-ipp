const isServerSide = (typeof window === 'undefined')

const env = isServerSide ? (require('dotenv').config().parsed || {}) : process.env

const basename = env.BASENAME || ''

module.exports = {
  basename,
  isWP: env.WORDPRESS,
  csvPath: env.CSV_PATH || '',
  basenameEnSections: env.BASENAME_EN_SECTIONS,
  basenameEnTables: env.BASENAME_EN_TABLES,
}
