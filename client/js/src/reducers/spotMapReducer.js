import {
  FETCH_MAP_SPOTS,
  RECEIVE_MAP_SPOTS
} from '../actions/spotMapActions';
import _ from 'lodash';

const initialSpotsState = {
  nowLoading: true,
  spots: []
};

function spotMap(state = initialSpotsState, action) {
  switch (action.type) {
    case FETCH_MAP_SPOTS:
      return _.assign({}, state, {
        nowLoading: true,
        query: action.query
      });
    case RECEIVE_MAP_SPOTS:
      return _.assign({}, state, {
        nowLoading: false,
        spots: action.spots,
        totalCount: action.totalCount,
        page: action.page,
        limit: action.limit
      });
    default:
      return state;
  }
}

export default {
  spotMap
};
