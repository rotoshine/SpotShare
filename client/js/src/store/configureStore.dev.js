import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import DevTools from '../DevTools';
import { persistState } from 'redux-devtools';
import createSagaMiddleware  from 'redux-saga';


const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
  applyMiddleware(thunk),
  applyMiddleware(sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
  persistState(getDebugSessionKey())
);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}
export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);
  store.runSaga = sagaMiddleware.run;

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
    );
  }

  return store;
}
