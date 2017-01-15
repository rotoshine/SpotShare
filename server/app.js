'use strict';

require('dotenv').config();
import logger from './utils/logger';
import config from './config';
import glob from 'glob';
import _ from 'lodash';
import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import autoIncrement from 'mongoose-auto-increment';
import path from 'path';
import exphbs from 'express-handlebars';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));
const isDevMode = argv.mode !== 'production';

const app = express();

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

// web controller loading
const webControllerPaths = glob.sync(`${__dirname}/webController/**/*.js`);
if( _.isArray(webControllerPaths)){
  logger.info('web controller loading start..');
  webControllerPaths.forEach((webControllerPath) => {
    require(webControllerPath)(app);
  });
  logger.info('web controller loading done.');
}

// auth config
require('./auth/passport')(app, passport, config);

// client setting
const CLIENT_PATH = path.resolve(`${__dirname}`, '../client');
app.use(express.static(CLIENT_PATH));

// view engine
app.engine('.hbs', exphbs({
  partialsDir: `${__dirname}/views/partials`,
  extname: '.hbs'
}));
app.set('views', `${__dirname}/views`);
app.set('view engine', '.hbs');

// react-redux server side rendering
app.use(require('./utils/reactRenderer').default);

app.listen(process.env.PORT);

logger.info(`server run. port : ${process.env.PORT}`);
