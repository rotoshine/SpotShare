import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

/**
 * IndexContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 13.
 */
class IndexContainer extends React.Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired
    };
    render () {
        return (
            <div>
              Hi!
            </div>
        );
    }
}

export default connect((state) => {
  return {
  };
})(IndexContainer)
