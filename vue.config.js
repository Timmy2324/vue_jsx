const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^/api/v2': {
        target: 'http://62.113.98.233:5000',
        secure: true,
        changeOrigin: true,
        ws: true,
      }
    }
  }
})
