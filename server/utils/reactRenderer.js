// react server side rendering
import React from './WrappedReact';
import _ from 'lodash';
import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from '../../client/js/src/reducers';
import {StaticRouter, Redirect} from 'react-router-dom';
import App from '../../client/js/src/App';
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

  const context = {};
  const preloadedStateJSONString = JSON.stringify(finalState);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}
                    context={context}>
        <App location={req.url}/>
      </StaticRouter>
    </Provider>
  );

  if (context.url) {
    // Somewhere a `<Redirect>` was rendered
    Redirect(301, context.url)
  } else {
    return res.render('index', {
      html: html,
      preloadedState: preloadedStateJSONString,
      fireBase: config.fireBase,
      mapApiKey: config.map.apiKey,
      googleAnalyticsKey: config.googleAnalyticsKey || '',
      meta: meta
    });
  }
}
