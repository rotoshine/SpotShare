// react server side rendering
import React from 'react';
import _ from 'lodash';
import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from '../../client/js/src/reducers';

import {match, RouterContext} from 'react-router';
import routes from '../../client/js/src/routes';

import config from '../config';

export default function handleRender(req, res) {
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

  let preloadedState = req.preloadedState || {};
  preloadedState = _.assign({}, preloadedState, {
    app: {
      user: user,
      providers: _.keys(config.auth),
      defaultTitle: config.title,
      title: req.title ? req.title : config.title,
      mapConfig: config.map
    }
  });

  const store = createStore(reducers, preloadedState);
  const finalState = store.getState();

  // meta tag
  const meta = req.meta ? req.meta : config.meta;

  // avoid window object undefined error
  global.window = {};
  global.document = {};
  global.navitator = {};

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

      return res.render('index', {
        html: html,
        preloadedState: JSON.stringify(finalState),
        fireBase: config.fireBase,
        mapApiKey: config.map.apiKey,
        googleAnalyticsKey: config.googleAnalyticsKey || '',
        meta: meta
      });
    }else{
      res.status(404).send('not found')
    }
  });
}
