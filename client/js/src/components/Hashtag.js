import React, {PropTypes} from 'react';

/**
 * Hashtag component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2016. 12. 29.
 */
export default class Hashtag extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  render() {
    const {name} = this.props;

    return (
      <span>
        <a href="">#{name}</a>
      </span>
    );
  }
}
