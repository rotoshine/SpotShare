import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
// containers
import SpotMapContainer from './containers/SpotMapContainer';
import SpotListStyleContainer from './containers/SpotListStyleContainer';
const store = configureStore();

const rootInstance = ReactDOM.render(
  (
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={SpotMapContainer}/>
        <Route path="/spots" component={SpotListStyleContainer} />
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
