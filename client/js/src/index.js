import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import routes from './routes';

// containers

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

const rootInstance = ReactDOM.render(
  (
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>
  ), document.getElementById('root'));

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
