import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Button, Well} from 'react-bootstrap';

export default class SimpleSpotList extends React.Component {
  static propTypes = {
    spots: PropTypes.array.isRequired,
    onSpotClick: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onMouseOut: PropTypes.func.isRequired
  };

  render() {
    const {spots, onSpotClick, onMouseOver, onMouseOut} = this.props;

    let spotListComponents = [];

    if (_.isArray(spots)) {
      if (spots.length === 0) {
        spotListComponents.push(
          <li key="empty">
            <Well className="text-center">
              <img src="/images/errors/404.jpg" alt="404 image" width="100%"/>
              <strong>이 지역엔 공유된 장소가 없습니다.</strong>
            </Well>
          </li>
        );
      }else{
        spotListComponents.push(
          <li key="summary"><div className="well well-sm">총 {spots.length} 개의 Spot</div></li>
        );
      }

      let spotsPartial = spots;
      let hasMoreSpots = false;
      if(spots.length > 10){
        hasMoreSpots = true;
        spotsPartial = spots.slice(0, 10);
      }
      const defaultImageUrl = '/images/food_tool.svg';
      spotsPartial.forEach((spot, i) => {
        let imageUrl = defaultImageUrl;

        if(spot.images){
          imageUrl = `/api/spots/${spot._id}/files/${spot.images[0]._id}`
        }
        let spotPhotoStyle = {
          backgroundImage: `url('${imageUrl}')`
        };

        spotListComponents.push(
          <li key={i}>
            <a href="#" onClick={onSpotClick.bind(this, spot)}
               onMouseOver={onMouseOver.bind(this, spot._id)}
               onMouseOut={onMouseOut.bind(this, spot._id)}>
              <div className="spot-item">
                <div className="spot-photo" style={spotPhotoStyle}/>
                <div className="spot-description">
                  <h3 className="spot-name">
                    {spot.spotName}
                  </h3>
                  <div className="spot-hashtags">
                    #테스트
                  </div>
                </div>
              </div>
            </a>
          </li>
        );
      });

      if(hasMoreSpots){
        spotListComponents.push(
          <li key="and-more">...and more...</li>
        );
      }
    }


    return (
      <div className="spot-list">
        <ul className="list-unstyled">
          {spotListComponents}
        </ul>
      </div>
    )
  }
}
