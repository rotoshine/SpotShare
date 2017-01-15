import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

/**
 * SpotFormContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 15.
 */
class SpotFormContainer extends React.Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired
    };
    render () {
        return (
            <div>
              스팟 수정을 여기에 구현한다.
            </div>
        );
    }
}

export default connect((state) => {
  return {
  };
})(SpotFormContainer)
