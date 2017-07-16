// @flow
import * as Actions from './spotMapActions';

import axios from 'axios';

export function fetchSpotsWithCoordinates (x1: number, y1: number, x2: number, y2: number): Dispatch {
  return (dispatch) => {
    dispatch({
      type: Actions.FETCH_MAP_SPOTS
    });

    const querystring = `x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;

    return axios.get(`/api/spots/with-coordinates?${querystring}`)
      .then((result) => {
        dispatch({
          type: Actions.RECEIVE_MAP_SPOTS,
          spots: result.data.spots
        });
      });
  };
}
