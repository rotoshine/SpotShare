import appReducer from './appReducer';
import spotReducer from './spotReducer';
import spotFormReducer from './spotFormReducer';
import spotsReducer from './spotsReducer';
import spotMapReducer from './spotMapReducer';
import commentsReducer from './commentsReducer';
import { combineReducers } from 'redux';

export default combineReducers({
  ...appReducer,
  ...spotReducer,
  ...spotFormReducer,
  ...spotsReducer,
  ...spotMapReducer,
  ...commentsReducer
});
