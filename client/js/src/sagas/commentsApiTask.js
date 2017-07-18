import { takeEvery, put, call } from 'redux-saga/effects';
import * as comments from '../actions/commentActions';
import * as api from '../apis/commentsApi';

export function* fetchCommentsTask({ spotId }) {
  const response = yield call(api.fetchComments, spotId);
  if(response) {
    yield put({
      type: comments.RECEIVE_COMMENTS,
      comments: response.comments
    });
  }
}

export function* createCommentTask({ spotId, content }) {
  yield call(api.createComment, spotId, content);
  yield put({
    type: comments.FETCH_COMMENTS,
    spotId
  });
}

export function* removeCommentTask({ spotId, commentId }) {
  yield call(api.removeComment, spotId, commentId);
  yield put({
    type: comments.FETCH_COMMENTS,
    spotId
  });
}

export default function* () {
  yield [
    takeEvery(comments.FETCH_COMMENTS, fetchCommentsTask),
    takeEvery(comments.CREATE_COMMENT, createCommentTask),
    takeEvery(comments.REMOVE_COMMENT, removeCommentTask)
  ]
}
