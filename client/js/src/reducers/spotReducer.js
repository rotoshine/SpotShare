import {
  FETCH_SPOT,
  RECEIVE_SPOT
} from '../actions/spotsActions';

import _ from 'lodash';

const initialState = {
  spot: {
    nowLoading: false,
    loadedSpot: null
  }
};

function spot(state = initialState, action){
  switch(action.type){
    case FETCH_SPOT:
      return _.assign({}, state, {
        nowLoading: true
      });
    case RECEIVE_SPOT:
      return _.assign({}, state, {
        nowLoading: false,
        loadedSpot: action.loadedSpot
      });
    default:
      return state;
  }
}

export default {
  spot
}
