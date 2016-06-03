'use strict';

require('dotenv').config();
const config = require('./config');
const glob = require('glob');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongoose connect
mongoose.connect(config.mongo);

// session
app.use(session({
  secret: config.sessionSecret || 'roto_is_good_programmer',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());



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

// auth config
require('./auth/passport')(app, passport, config);

// client setting
const CLIENT_PATH = path.resolve(`${__dirname}`, '../client');
app.use(express.static(CLIENT_PATH));

// view engine
app.engine('handlebars', exphbs());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.get('', (req, res) => {
  let user = {
    isLogined: false
  };
  if(req.user){
    user = {
      isLogined: true,
      name: req.user.name
    }
  }

  return res.render('index', {
    title: config.title,
    daumMapApiKey: config.daumMapApiKey,
    user: JSON.stringify(user)
  });
});

app.listen(process.env.PORT);

console.log(`server run. port : ${process.env.PORT}`);
