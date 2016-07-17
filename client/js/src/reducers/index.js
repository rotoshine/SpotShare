import spotReducers from './spotsReducers';
import commentsReducer from './commentsReducer';
import {combineReducers} from 'redux';

export default combineReducers({
  ...spotReducers,
  ...commentsReducer
});
