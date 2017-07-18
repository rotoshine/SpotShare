import axios from 'axios';

export function fetchComments(spotId){
  return axios.get(`/api/spots/${spotId}/comments`)
    .then((response) => response.data);
}

export function createComment(spotId, content){
  return axios.post(`/api/spots/${spotId}/comments`, {
    content: content
  });
}

export function removeComment(spotId, commentId){
  return axios.delete(`/api/spots/${comment.spotId}/comments/${commentId}`);
}
