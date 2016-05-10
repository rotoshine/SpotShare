import React from 'react';
import $ from 'jquery';
import {Button} from 'react-bootstrap';

import App from '../App';
export default class Spots extends React.Component {
  state = {
    // dummy spots
    spots: [
      {
        spotName: '천호동 스팟',
        address: '서울 강동구 천호동 481-5',
        geo: [37.54251441506003, 127.11770256831429],
        createdDate: new Date(),
        updatedDate: new Date(),
        description: '어쩌구 저저구 시불시불~~'
      }
    ],
    height: 0
  };

  componentDidMount () {
    this.setState({
      height: $(window).height() - $('.nav').height() - 2
    }, () => {
      this.createMap();
      this.registEvents();
      this.fetchSpots();
    });
  }

  createMap(){
    // daum map initialize
    let container = document.getElementById('spot-map');
    let options = {
      center: new daum.maps.LatLng(37.54251441506003, 127.11770256831429), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };

    this.map = new daum.maps.Map(container, options);
    this.markers = [];
  }

  registEvents() {

    if(this.map !== null){
      const {event} = daum.maps;
      const map = this.map;
      event.addListener(map, 'dragend', () => {
        console.log(map.getBounds());
      });

      event.addListener(map, 'tilesloaded', () => {
        console.log('tileload!', map.getBounds());
      });

      event.addListener(map, 'click', (mouseEvent) => {
        let latLng = mouseEvent.latLng;
          this.createSpot(latLng);
      });
    }
  }

  createSpot(latLng) {
    let {spots} = this.state;
    spots.push({
      spotName: 'test',
      geo: [latLng.getLat(), latLng.getLng()]
    });

    this.setState({
      spots: spots
    }, () => {
      this.fetchSpots();
    })
  }

  fetchSpots () {
    // ajax fake~
    this.markers = [];

    const {spots} = this.state;

    spots.forEach(spot => {
      let marker = new daum.maps.Marker({
        position: new daum.maps.LatLng(spot.geo[0], spot.geo[1])
      });

      marker.setMap(this.map);
      this.markers.push(marker);
    });

    console.log(this.markers);
  }

  render() {
    let style = { width: '100%', height: this.state.height };
    return (
      <App>
        <div className="map-wrapper">
          <div className="map" id="spot-map" style={style}></div>
          <div className="map-control">
            <Button bsStyle="info">등록</Button>
          </div>
        </div>
      </App>
    );
  }
}
