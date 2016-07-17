import axios from 'axios';
import * as CommentAction from './commentActions';

export function fetchComments(spotId){
  return (dispatch) => {
    dispatch({
      type: CommentAction.REQUEST_COMMENTS
    });

    return axios.get(`/spots/${spotId}/comments`)
      .then((response) => {
        dispatch({
          type: CommentAction.RECIEVE_COMMENTS,
          comments: response.data.comments
        });
      });
  }
}

export function createComment(comment){
  return (dispatch) => {
    dispatch({
      type: CommentAction.CREATE_COMMENT,
      comment: comment
    });

    return axios.post(`/spots/${comment.spot._id}/comments`);
  }
}

export function removeComment(comment){
  return (dispatch) => {
    dispatch({
      type: CommentAction.RECIEVE_COMMENTS,
      commentId: comment._id
    });

    return axios.delete(`/spots/${comment.spot._id}/comments/${comment._id}`);
  };
}
