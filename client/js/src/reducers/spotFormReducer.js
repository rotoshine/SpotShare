import {
  SET_SPOT_FORM,
  UPDATE_SPOT_FORM,
  RESET_SPOT_FORM
} from '../actions/spotsActions';

import _ from 'lodash';

const initialState = {
  _id: null,
  spotName: '',
  description: '',
  address: '',
  geo: [],
  files: []
};

function spotForm(state = initialState, action) {
  switch (action.type) {
    case SET_SPOT_FORM:
      return _.assign({}, state, {
        _id: action.spotForm._id,
        spotName: action.spotForm.spotName,
        description: action.spotForm.description,
        address: action.spotForm.address,
        geo: action.spotForm.geo,
        files: action.spotForm.files
      });
    case UPDATE_SPOT_FORM:
      let spotForm = _.cloneDeep(state);
      spotForm[action.field] = action.value;

      return _.assign({}, state, spotForm);
    case RESET_SPOT_FORM:
      return _.assign({}, state, {
        _id: null,
        spotName: '',
        description: '',
        address: '',
        geo: [],
        files: []
      });
    default:
      return state;
  }
}

export default {
  spotForm
};
