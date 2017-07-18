import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import rootSaga from './sagas';
// containers

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
const history = createHistory();

store.runSaga(rootSaga);
const rootInstance = ReactDOM.render(
  (
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
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
