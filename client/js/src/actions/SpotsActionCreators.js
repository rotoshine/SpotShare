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

export function createOrUpdateSpot(spot) {
  const uploadedFiles = spot.files;
  delete spot.files;
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      if (spot._id) {
        dispatch({
          type: Actions.MODIFY_SPOT,
          spot: spot
        });
        return axios.put(`/api/spots/${spot._id}`, spot).then((result) => {
          resolve(result.data);
        });
      } else {
        dispatch({
          type: Actions.CREATE_SPOT,
          spot: spot
        });

        return axios.post('/api/spots', spot).then(result => {
          const savedSpot = result.data;
          dispatch({
            type: Actions.SAVE_SPOT_TEMP_FILES
          });

          axios
            .post(`/api/spots/${savedSpot._id}/files/temp-files-save`, {
              tempUploadedFiles: uploadedFiles
            })
            .then((result) => {
              savedSpot.files = result.data;
              return resolve(savedSpot);
            })
            .catch(reject);
        }).catch(reject);
      }
    });
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
