import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as SpotsActionCreators from '../actions/SpotsActionCreators';

import App from '../App';
/**
 * SpotDetailContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 2.
 */
class SpotDetailContainer extends React.Component {
    static propTypes = {
      spots: PropTypes.array.isRequired,
      dispatch: PropTypes.func.isRequired
    };

    constructor(props){
      super(props);

      const {dispatch} = props;

      this.spotActions = bindActionCreators(dispatch)
    }

    componentDidMount() {
      this.spotActions.fetchSpots();
    }

    render () {
        return (
            <App>
              <div className="container">

              </div>
            </App>
        );
    }
}

export default connect((state) => {
  return {
    spots: state.spots.spots
  };
})(SpotDetailContainer)
