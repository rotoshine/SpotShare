import React, {PropTypes} from 'react';

/**
 * AbstractMap component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2016. 12. 30.
 */
export default class AbstractMap {
  static propTypes = {};

  constructor(container) {
    this.map = null;
    this.container = container;
  }

  renderMarker() {
  };

  renderMap() {
  }
}
