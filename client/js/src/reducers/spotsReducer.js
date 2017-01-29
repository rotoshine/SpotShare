import {
  FETCH_SPOTS,
  RECEIVE_SPOTS,
  RESET_LOADED_SPOTS,
  CREATE_SPOT
} from '../actions/spotsActions';
import _ from 'lodash';

const initialSpotsState = {
  nowLoading: true,
  spots: null,
  totalCount: 0,
  page: 1,
  limit: 0,
  query: {}
};

function spots(state = initialSpotsState, action) {
  switch (action.type) {
    case FETCH_SPOTS:
      return _.assign({}, state, {
        nowLoading: true,
        query: action.query
      });
    case RECEIVE_SPOTS:
      return _.assign({}, state, {
        nowLoading: false,
        spots: action.spots,
        totalCount: action.totalCount,
        page: action.page,
        limit: action.limit
      });
    case RESET_LOADED_SPOTS:
      return _.assign({}, state, {
        spots: null
      });
    case CREATE_SPOT:
      let nextSpots = _.cloneDeep(state.spots);
      nextSpots.push(action.spot);
      return _.assign({}, state, {
        spots: _.concat(state.spots, action.spot)
      });
    default:
      return state;
  }
}

export default {
  spots
};
