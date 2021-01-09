const path = require('path')

module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_MOCK_SERVER,
        pathRewrite: { '^/api': '' }
      },
      '/wechat': {
        target: process.env.VUE_APP_NEWWECHAT_SERVER,
        pathRewrite: { '^/wechat': ''}
      },
      '/data/myContent': {
        target: process.env.VUE_APP_MOCK_SERVER,
        pathRewrite: { '^/data': ''}
      },
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('services', path.resolve(__dirname, './src/services'))
  }
}
