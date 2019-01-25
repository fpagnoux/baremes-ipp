const withCSS = require('@zeit/next-css')
const loader = require('./server/loader')
const keyBy = require('lodash.keyby')
const webpack = require('webpack')
const { parsed: localEnv } = require('dotenv').config()

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
    return config
  },
  exportPathMap: () => {
    return loader.loadRoutes().then(routes => {
      return Object.assign(
        {},
        {'/': { page: '/' }},
        keyBy(routes, 'route')
      )
    })
  },
  assetPrefix: (localEnv && localEnv.BASENAME) || ""
})
