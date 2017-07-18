import * as Actions from '../actions/spotMapActions';
import { takeEvery, put, call } from 'redux-saga/effects';
import * as api from '../apis/spotMapApi';

export function* fetchSpotsWithCoordinatesTask({ x1, y1, x2, y2 }) {
  const response = yield call(api.fetchSpotsWithCoordinates, x1, y1, x2, y2);
  if(response && response.spots) {
    yield put({
      type: Actions.RECEIVE_MAP_SPOTS,
      spots: response.spots
    })
  }

}

export default function* () {
  return [
    yield takeEvery(Actions.FETCH_MAP_SPOTS, fetchSpotsWithCoordinatesTask)
  ]
}

