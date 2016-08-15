require('dotenv').config();

var path = require('path');
var webpack = require('webpack');

var entry = [
  './client/js/src/index'
];

if(process.env !== 'production'){
  entry = [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './client/js/src/index'
  ];
}

module.exports = {
  devtool: 'eval',
  entry: entry,
  output: {
    path: path.join(__dirname, 'client/js/dist'),
    filename: 'bundle.js',
    publicPath: '/js/dist/'
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
