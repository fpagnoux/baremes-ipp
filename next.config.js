const withCSS = require('@zeit/next-css')
const loader = require('./server/loader')
const keyBy = require('lodash.keyby')

module.exports = withCSS({
  cssModules: false,
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    )
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
  }
})
