const path = require('path')
const webpack = require('webpack')

const dev = process.env.NODE_ENV !== 'production'

const config = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'boundle-[hash].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_models/
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: dev ? '"development"' : '"production"'
      }
    })
  ]
}

module.exports = config;
