import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

/**
 * NotFoundContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 15.
 */
class NotFoundContainer extends React.Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired
    };
    render () {
        return (
            <div className="text-center">
              <h3>404 Not Found!!</h3>
              <img src="/images/errors/404.jpg" alt=""/>
            </div>
        );
    }
}

export default connect((state) => {
  return {
  };
})(NotFoundContainer)
