require('dotenv').config();

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './client/js/src/index'
  ],
  output: {
    path: path.join(__dirname, 'client/js'),
    filename: 'bundle.js',
    publicPath: '/client/js/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'client/js/src')
      }
    ]
  }
};
