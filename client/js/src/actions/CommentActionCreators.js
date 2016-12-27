import axios from 'axios';
import * as CommentAction from './commentActions';

export function fetchComments(spotId){
  return (dispatch) => {
    dispatch({
      type: CommentAction.RESET_COMMENTS,
      comments: []
    });

    dispatch({
      type: CommentAction.REQUEST_COMMENTS
    });

    return axios.get(`/api/spots/${spotId}/comments`)
      .then((response) => {
        dispatch({
          type: CommentAction.RECIEVE_COMMENTS,
          comments: response.data.comments
        });
      });
  }
}

export function createComment(spotId, content){
  return (dispatch) => {
    dispatch({
      type: CommentAction.CREATE_COMMENT,
      content: content
    });

    return axios.post(`/api/spots/${spotId}/comments`, {
      content: content
    }).then(() => {
      dispatch(fetchComments(spotId));
    });
  }
}

export function removeComment(spotId, commentId){
  return (dispatch) => {
    dispatch({
      type: CommentAction.RECIEVE_COMMENTS,
      commentId: commentId
    });

    return axios.delete(`/api/spots/${comment.spotId}/comments/${commentId}`);
  };
}
