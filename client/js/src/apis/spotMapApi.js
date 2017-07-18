import axios from 'axios';

export function fetchSpotsWithCoordinates(x1, y1, x2, y2){
  const querystring = `x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;

  return axios.get(`/api/spots/with-coordinates?${querystring}`).then(response => response.data)
}
