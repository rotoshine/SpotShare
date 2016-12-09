require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const webpack = require('webpack');

let entry = [
  './client/js/src/index'
];

let loaders = ['babel'];
let devtool = 'evel';
let plugins = [];
if(argv.mode !== 'production'){
  entry = [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './client/js/src/index'
  ];
  loaders = ['react-hot', 'babel'];
  plugins = [
    new webpack.HotModuleReplacementPlugin()
  ];
  console.log('Webpack hot loader enable.');
}else{
  devtool = 'source-map';
  plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ko/),
    new webpack.DefinePlugin({
      'process.env': {
          'NODE_ENV': 'production'
      }
    })
  ]
}



module.exports = {
  devtool: devtool,
  entry: entry,
  output: {
    path: path.join(__dirname, 'client/js/dist'),
    filename: 'bundle.js',
    publicPath: '/js/dist/'
  },
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: loaders,
        include: path.join(__dirname, 'client/js/src')
      }
    ]
  }
};
