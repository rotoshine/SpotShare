import { all } from 'redux-saga/effects';
import spotApiTask from './spotApiTask';
import spotsApiTask from './spotsApiTask';
import spotMapApiTask from './spotMapApiTask';
import spotFileApiTask from './spotFileApiTask';
import commentsApiTask from './commentsApiTask';

export default function* rootSaga () {
  yield all([
    //spotApiTask(),
    //spotsApiTask(),
    spotMapApiTask(),
    //spotFileApiTask(),
    commentsApiTask()
  ]);
}
