import _ from 'lodash';
import * as CommentAction from '../actions/commentActions';

const initialState = {
  nowLoading: false,
  comments: []
};
function comments(state = initialState, action) {
  switch (action.type) {
    case CommentAction.RESET_COMMENTS:
      return _.assign({}, initialState);
    case CommentAction.FETCH_COMMENTS:
      return _.assign({}, state, {
        nowLoading: true
      });
    case CommentAction.RECEIVE_COMMENTS:
      return _.assign([], state, {
        nowLoading: false,
        comments: action.comments
      });
    case CommentAction.CREATE_COMMENT:
    default:
      return state;
  }
}

export default {
  comments
};
