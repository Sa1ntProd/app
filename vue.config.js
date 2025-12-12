const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'source-map'
  },
  css: {
    extract: true,
    sourceMap: false
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    https: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Верификация личности'
      return args
    })
  }
})