import appReducer from './appReducer';
import spotReducer from './spotReducer';
import spotFormReducer from './spotFormReducer';
import spotsReducer from './spotsReducer';
import commentsReducer from './commentsReducer';
import {combineReducers} from 'redux';

export default combineReducers({
  ...appReducer,
  ...spotReducer,
  ...spotFormReducer,
  ...spotsReducer,
  ...commentsReducer
});
