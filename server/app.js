require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
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

const CLIENT_PATH = path.resolve(`${__dirname}`, '../client');
app.use(express.static(CLIENT_PATH));
app.get('', (req, res) => {
  console.log('!');
  return res.sendFile(`${CLIENT_PATH}/html/index.html`);
});

app.listen(process.env.PORT);

console.log(`server run. port : ${process.env.PORT}`);
