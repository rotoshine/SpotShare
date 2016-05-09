import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

// containers
import Spots from './containers/Spots';

ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={Spots}/>
    </Router>
  ), document.getElementById('root'));
