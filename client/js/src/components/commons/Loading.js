import React, {PropTypes} from 'react';

/**
 * Loading component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 16.
 */
export default class Loading extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired
  };

  render() {
    if (this.props.visible) {
      return (
        <div>
          <img src="/images/loading.svg" alt="loading image"/>
        </div>
      );
    } else {
      return null;
    }
  }
}
