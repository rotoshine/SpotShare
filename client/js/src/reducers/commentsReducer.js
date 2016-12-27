import _ from 'lodash';
import * as CommentAction from '../actions/commentActions';

function comments(state = [], action) {
  switch (action.type) {
    case CommentAction.RESET_COMMENTS:
      return _.assign([]);
    case CommentAction.FETCH_COMMENTS:
    case CommentAction.REQUEST_COMMENTS:
    case CommentAction.RECIEVE_COMMENTS:
      return _.assign([], state, action.comments);
    case CommentAction.CREATE_COMMENT:
    default:
      return state;
  }
}

export default {
  comments
};
