require('dotenv').config();
const config = require('./config');
const glob = require('glob');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const parseArgs = require('minimist');

const argv = parseArgs(process.argv.slice(2));

// webpack setting
if(argv.dev){
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }));
}

// middleware loading
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongoose connect
mongoose.connect(config.mongo);

// model loading
const modelPaths = glob.sync(`${__dirname}/**/*.model.js`);

if(_.isArray(modelPaths)){
  console.log('model loading start..');
  modelPaths.forEach((modelPath) => {
    require(modelPath)(mongoose);
    console.log(`${modelPaths} model loaded.`);
  });
  console.log('model loading done.');
}

// api loading
const apiPaths = glob.sync(`${__dirname}/api/**/index.js`);
if(_.isArray(apiPaths)){
  console.log('api loading start..');
  apiPaths.forEach((apiPath) => {
    app.use('/api', require(apiPath));
    console.log(`${apiPath} api loaded.`);
  });
  console.log('api loading done.');
}

const CLIENT_PATH = path.resolve(`${__dirname}`, '../client');
app.use(express.static(CLIENT_PATH));
app.get('', (req, res) => {
  console.log('!');
  return res.sendFile(`${CLIENT_PATH}/html/index.html`);
});

app.listen(process.env.PORT);

console.log(`server run. port : ${process.env.PORT}`);
