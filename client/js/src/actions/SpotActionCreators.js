import * as SpotActions from './spotsActions';

import axios from 'axios';

export function requestSpot(spotId) {
  return fetchSpot(spotId);
}

export function fetchSpot(spotId) {
  return (dispatch) => {
    dispatch({
      type: SpotActions.FETCH_SPOT
    });

    return new Promise((resolve, reject) => {
      axios
        .get(`/api/spots/${spotId}`)
        .then((result) => {
          dispatch({
            type: SpotActions.RECEIVE_SPOT,
            loadedSpot: result.data
          });
          resolve(result.data)
        })
        .catch(reject);
    });

  }
}
