const withCSS = require('@zeit/next-css')
const {loadRoutes, generateStaticTables} = require('./server/loader')
const keyBy = require('lodash.keyby')
const webpack = require('webpack')
const { parsed: localEnv } = require('dotenv').config()
const {basename, isProd} = require('./config')

module.exports = withCSS({
  cssModules: false,
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    )
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    config.node = {fs: "empty"}
    return config
  },
  exportPathMap: () => {
    return loadRoutes().then(routes => {
      if (isProd) {
        routes.map(generateStaticTables)
      }
      return Object.assign(
        {},
        {'/': { page: '/' }},
        {'/en': { page: '/en' }},
        keyBy(routes, 'route')
      )
    })
  },
  assetPrefix: basename
})
