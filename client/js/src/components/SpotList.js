import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Panel, Button} from 'react-bootstrap';

export default class SpotList extends React.Component {
  static propTypes = {
    spots: PropTypes.array.isRequired,
    useCurrentPosition: PropTypes.bool,
    onSpotClick: PropTypes.func.isRequired,
    onCurrentPositionClick: PropTypes.func.isRequired
  };

  render() {
    const {spots, useCurrentPosition, onSpotClick} = this.props;

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

    let currentPositionButton = null;

    if(useCurrentPosition){
      currentPositionButton = (
        <Button size="xs" onClick={this.props.onCurrentPositionClick}>
          <i className="fa fa-location-arrow"/> 현재 위치 찾기</Button>
      );
    }
    return (
      <Panel>
        <ul className="list-unstyled">
          {spotListComponents}
        </ul>
        {currentPositionButton}
      </Panel>
    )
  }
}
