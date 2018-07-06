const merge = require('webpack-merge')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const devServer = {
  port: '8020',
  host: '127.0.0.1',
  overlay: {
    error: true
  },
  hot: false,
  // open: true
}

const config = merge(baseConfig, {
  devServer,
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]

});

module.exports = config;
