'use strict';

require('dotenv').config();
const config = require('./config');
const glob = require('glob');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
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

// auth config
const passport = require('passport');
require('./auth/passport')(passport, config);
app.get('/auth/facebook/login', passport.authenticate('facebook', {
  session: false,
  scope: ['public_profile', 'user_about_me', 'user_location']
}));
app.get('/auth/facebook/login/callback', passport.authenticate('facebook', {
  session: false,
  successRedirect: '/'
}));
app.get('/api/me', passport.authenticate('facebook', { session: false}), (req, res) => {
  res.json(req.user);
});

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

// client setting
const CLIENT_PATH = path.resolve(`${__dirname}`, '../client');
app.use(express.static(CLIENT_PATH));

// view engine
app.engine('handlebars', exphbs());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.get('', (req, res) => {
  return res.render('index', {
    title: config.title,
    daumMapApiKey: config.daumMapApiKey
  });
});

app.listen(process.env.PORT);

console.log(`server run. port : ${process.env.PORT}`);
