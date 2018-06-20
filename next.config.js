const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  cssModules: false,
  webpack: function (config) {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    )
    return config
  }
})
