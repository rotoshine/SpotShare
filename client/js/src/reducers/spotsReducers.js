import {
  FETCH_SPOTS,
  REQUEST_SPOTS,
  RECEIVE_SPOTS,
  CREATE_SPOT,
  SET_SPOT_FORM,
  UPDATE_SPOT_FORM,
  RESET_SPOT_FORM
} from '../actions/spotsActions';
import _ from 'lodash';

const initialSpotsState = {
  nowLoading: false,
  spots: [],
  spotForm: {
    _id: null,
    spotName: '',
    description: '',
    address: '',
    geo: []
  },
  height: 0
};

function spots(state = initialSpotsState, action) {
  switch (action.type) {
    case FETCH_SPOTS:
    case REQUEST_SPOTS:
      return _.assign({}, state, {
        nowLoading: true
      });
    case RECEIVE_SPOTS:
      return _.assign({}, state, {
        nowLoading: false,
        spots: action.spots
      });
    case CREATE_SPOT:
      let nextSpots = _.cloneDeep(state.spots);
      nextSpots.push(action.spot);
      return _.assign({}, state, {
        spots: _.concat(state.spots, action.spot)
      });
    case SET_SPOT_FORM:
      return _.assign({}, state, {
        spotForm: {
          _id: action.spotForm._id,
          spotName: action.spotForm.spotName,
          description: action.spotForm.description,
          address: action.spotForm.address,
          geo: action.spotForm.geo
        }
      });
    case UPDATE_SPOT_FORM:
      let spotForm = _.cloneDeep(state.spotForm);
      spotForm[action.field] = action.value;

      return _.assign({}, state, {
        spotForm: spotForm
      });
    case RESET_SPOT_FORM:
      return _.assign({}, state, {
        spotForm: {
          _id: null,
          spotName: '',
          description: '',
          address: '',
          geo: []
        }
      });
    default:
      return state;
  }
}

export default {
  spots
};
