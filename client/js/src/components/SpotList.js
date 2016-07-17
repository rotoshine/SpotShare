import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Panel, Button} from 'react-bootstrap';

export default class SpotList extends React.Component {
  static propTypes = {
    spots: PropTypes.array.isRequired,
    onSpotClick: PropTypes.func.isRequired,
    onCurrentPositionClick: PropTypes.func.isRequired
  };

  render() {
    const {spots, onSpotClick} = this.props;

    let spotListComponents = [];

    if (_.isArray(spots)) {
      spots.forEach((spot, i) => {
        spotListComponents.push(
          <li key={i}>
            <a href="#" onClick={onSpotClick.bind(this, spot)}>{spot.spotName}</a>
          </li>
        );
      });

      if (spotListComponents.length === 0) {
        spotListComponents.push(
          <li key="empty">이 지역엔 공유된 장소가 없습니다.</li>
        )
      }
    }

    return (
      <Panel>
        <ul className="list-unstyled">
          {spotListComponents}
        </ul>
        <Button size="xs" onClick={this.props.onCurrentPositionClick}>
          <i className="fa fa-location-arrow"/> 현재 위치 찾기</Button>
      </Panel>
    )
  }
}
