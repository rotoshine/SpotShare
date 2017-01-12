import appReducer from './appReducer';
import spotReducer from './spotsReducer';
import commentsReducer from './commentsReducer';
import {combineReducers} from 'redux';

export default combineReducers({
  ...appReducer,
  ...spotReducer,
  ...commentsReducer
});
