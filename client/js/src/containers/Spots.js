import React from 'react';
import $ from 'jquery';

import App from '../App';
export default class Main extends React.Component {
  state = {
    // dummy spots
    spots: [
      {
        spotName: '천호동 스팟',
        address: '서울 강동구 천호동 481-5',
        lat: 37.54251441506003,
        lng: 127.11770256831429,
        createdDate: new Date(),
        updatedDate: new Date(),
        description: '어쩌구 저저구 시불시불~~'
      }
    ],
    height: $(window).height() - 86
  };

  componentDidMount () {
    this.createMap();
    this.registEvents();
    this.fetchSpots();
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
    }
  }

  fetchSpots () {
    // ajax fake~

    this.markers = [];

    const {spots} = this.state;

    spots.forEach(spot => {
      let marker = new daum.maps.Marker({
        position: new daum.maps.LatLng(spot.lat, spot.lng)
      });

      marker.setMap(this.map);
      this.markers.push(marker);
    });
  }

  render() {
    let style = { width: '100%', height: this.state.height };
    return (
      <App>
        <div id="spot-map" style={style}></div>
      </App>
    );
  }
}
