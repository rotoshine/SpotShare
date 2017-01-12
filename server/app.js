'use strict';

require('dotenv').config();
const logger = require('./utils/logger');
const config = require('./config');
const glob = require('glob');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const autoIncrement = require('mongoose-auto-increment');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const argv = require('minimist')(process.argv.slice(2));
const isDevMode = argv.mode !== 'production';

// webpack setting
if (isDevMode) {
  logger.info('Development Mode Run.');
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    hot: true,
    historyApiFallback: true
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: logger.info
  }));
} else {
  logger.info('Production Mode Run.');
}

// middleware loading
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// mongoose connect
const mongooseConnection = mongoose.connect(config.mongo);
// session
app.use(session({
  secret: config.sessionSecret || 'roto_is_good_programmer',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// model loading
const modelPaths = glob.sync(`${__dirname}/**/*.model.js`);

if (_.isArray(modelPaths)) {
  autoIncrement.initialize(mongooseConnection);
  logger.info('model loading start..');
  modelPaths.forEach((modelPath) => {
    require(modelPath)(mongoose, {
      autoIncrement: autoIncrement
    });

    logger.info(`${modelPath} model loaded.`);
  });
  logger.info('model loading done.');
}

// api loading
const apiPaths = glob.sync(`${__dirname}/api/**/index.js`);
if (_.isArray(apiPaths)) {
  logger.info('api loading start..');
  apiPaths.forEach((apiPath) => {
    app.use('/api', require(apiPath));
    logger.info(`${apiPath} api loaded.`);
  });
  logger.info('api loading done.');
}

// auth config
require('./auth/passport')(app, passport, config);

// client setting
const CLIENT_PATH = path.resolve(`${__dirname}`, '../client');
app.use(express.static(CLIENT_PATH));

// view engine
app.engine('.hbs', exphbs({
  extname: '.hbs'
}));
app.set('views', `${__dirname}/views`);
app.set('view engine', '.hbs');

app.use(handleRender);

import React from 'react';
import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from '../client/js/src/reducers';

import {match, RouterContext} from 'react-router';
import routes from '../client/js/src/routes';

function handleRender(req, res) {
  let user = {
    isLogin: false
  };

  if (req.user) {
    user = {
      _id: req.user._id,
      isLogin: true,
      name: req.user.name,
      provider: req.user.provider
    }
  }

  let preloadedState = {
    app: {
      user: user,
      providers: _.keys(config.auth),
      title: config.title,
      mapConfig: config.map
    }
  };

  const store = createStore(reducers, preloadedState);

  // avoid window object undefined error
  global.window = {};

  match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if(renderProps){
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );

      const finalState = store.getState();

      console.log(html);

      return res.render('index', {
        html: html,
        preloadedState: JSON.stringify(finalState),
        fireBase: config.fireBase,
        mapApiKey: config.map.apiKey,
        googleAnalyticsKey: config.googleAnalyticsKey || '',
        meta: config.meta
      });
    }else{
      res.status(404).send('not found')
    }
  });
}

app.listen(process.env.PORT);

logger.info(`server run. port : ${process.env.PORT}`);
