const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const ExtractPlugin = require('extract-text-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const config = merge(baseConfig, {
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractPlugin.extract({
        fallback: 'style-loader',
        // use: ['css-loader'],
        use: {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }
      })
    }]
  },
  plugins: [
    new ExtractPlugin('style-[contenthash:8].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyCSS: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    })
  ]

})

module.exports = config;