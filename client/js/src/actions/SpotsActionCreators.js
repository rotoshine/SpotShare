import * as Actions from './spotsActions';

import axios from 'axios';

export function fetchSpots(x1, y1, x2, y2) {
  return (dispatch) => {
    dispatch({
      type: Actions.REQUEST_SPOTS
    });

    const querystring = `x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;

    return axios.get(`/api/spots?${querystring}`)
      .then((response) => {
        dispatch({
          type: Actions.RECEIVE_SPOTS,
          spots: response.data.spots
        });
      })
  };
}

export function requestSpots(x1, y1, x2, y2) {
  return fetchSpots(x1, y1, x2, y2);
}

export function createSpot(newSpot) {
  return (dispatch) => {
    dispatch({
      type: Actions.CREATE_SPOT,
      spot: newSpot
    });

    return axios.post('/api/spots', newSpot);
  };
}

export function modifySpot(spot) {
  return (dispatch) => {
    dispatch({
      type: Actions.MODIFY_SPOT,
      spot: spot
    });
    return axios.put(`/api/spots/${spot._id}`, spot);
  }
}

export function removeSpot(spotId) {
  return (dispatch) => {
    dispatch({
      type: Actions.REMOVE_SPOT,
      spotId: spotId
    });

    return axios.delete(`/api/spots/${spotId}`);
  }
}

export function removeRequestSpot(spotId) {
  return (dispatch) => {
    dispatch({
      type: Actions.REMOVE_REQUEST_SPOT,
      spotId: spotId
    });

    return axios.post(`/api/spots/${spotId}/remove-request`);
  }
}
export function likeSpot(spotId) {
  return {
    type: Actions.LIKE_SPOT,
    spotId: spotId
  };
}

export function setSpotForm(spotForm) {
  return {
    type: Actions.SET_SPOT_FORM,
    spotForm: spotForm
  };
}

export function updateSpotForm(field, value) {
  return {
    type: Actions.UPDATE_SPOT_FORM,
    field: field,
    value: value
  };
}

export function resetSpotForm() {
  return {
    type: Actions.RESET_SPOT_FORM
  };
}
