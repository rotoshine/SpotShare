import React, {PropTypes} from 'react';

import AbstractMap from './AbstractMap';

/**
 * DaumMap component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2016. 12. 30.
 */
export default class DaumMap extends AbstractMap {
  renderMap(latLng) {
    let options = {
      center: new daum.maps.LatLng(latLng.latitude, latLng.longitude), //지도의 중심좌표.
      level: 3,
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: true
    };

    this.map = new daum.maps.Map(this.container, options);

    return this;
  }


}
