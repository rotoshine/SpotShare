import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import Hammer from 'react-hammerjs';
import {Button, Well, Panel, Form, FormGroup, FormControl, Input, Col, ControlLabel, Modal} from 'react-bootstrap';

import App from '../App';
export default class Spots extends React.Component {
  state = {
    nowLoading: false,
    addModals: {
      visibleModal: false,
      spotName: null,
      address: null,
      description: null,
      latLng: null
    },
    spots: [],
    height: 0,
    user: JSON.parse(document.getElementById('user').innerHTML)
  };

  componentDidMount() {
    this.setState({
      height: $(window).height() - $('.navbar').height() - 2
    }, () => {
      this.createMap();
      this.registEvents();
    });
  }

  createMap() {
    // daum map initialize
    let container = document.getElementById('spot-map');
    let options = {
      center: new daum.maps.LatLng(37.54251441506003, 127.11770256831429), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };

    this.map = new daum.maps.Map(container, options);
    this.markers = [];

    this.fetchSpots();
  }

  registEvents() {
    if (this.map !== null) {
      const {event} = daum.maps;
      const map = this.map;
      event.addListener(map, 'dragend', () => {
        this.fetchSpots();
      });
      event.addListener(map, 'zoom_changed', () => {
        this.fetchSpots();
      });
    }
  }

  createSpot() {
    let {spots} = this.state;
    let {spotName, address, latLng, description} = this.state.addModals;
    let newSpot = {
      spotName: spotName,
      address: address,
      geo: [latLng.getLat(), latLng.getLng()],
      description: description
    };

    spots.push(newSpot);

    this.setState({
      spots: spots
    }, () => {
      this.renderMarkers();
      this.handleModalClose();
    });

    return $.ajax({
      url: '/api/spots',
      type: 'POST',
      data: JSON.stringify(newSpot),
      contentType: 'application/json',
      dataType: 'json'
    }).done(() => {
      console.log(result);
    });
  }

  fetchSpots() {
    this.setState({
      nowLoading: true
    }, () => {
      const bounds = this.map.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      const querystring = `x1=${neLatLng.getLat()}&y1=${neLatLng.getLng()}&x2=${swLatLng.getLat()}&y2=${swLatLng.getLng()}`;
      $.get(`/api/spots?${querystring}`)
        .done((result) => {
          this.setState({
            spots: result.spots
          }, () => {
            this.renderMarkers();
          });
        })
    });
  }

  renderMarkers() {
    this.markers = [];

    const {spots} = this.state;

    spots.forEach(spot => {
      if (_.isArray(spot.geo) && spot.geo.length === 2) {
        let marker = new daum.maps.Marker({
          position: new daum.maps.LatLng(spot.geo[0], spot.geo[1]),
          clickable: true
        });

        marker.infoWindow = new daum.maps.InfoWindow({
          content: `<div style="padding:5px"><h5>${spot.spotName}</h5><p>${spot.description}</p></div>`,
          removable: true
        });
        marker.setMap(this.map);
        this.markers.push(marker);

        // marker 이벤트 등록
        daum.maps.event.addListener(marker, 'click', () => {
          marker.infoWindow.open(this.map, marker);
        });
      }
    });
  }

  render() {
    let style = {width: '100%', height: this.state.height};

    let spotListComponents = [];

    const {spots} = this.state;

    if(_.isArray(spots)){
      spots.forEach((spot, i) => {
        spotListComponents.push(
          <li key={i}>
            <a href="#" onClick={this.handleSpotListClick.bind(this, spot)}>{spot.spotName}</a>
          </li>
        );
      });

      if(spotListComponents.length === 0){
        spotListComponents.push(
          <li key="empty">이 지역엔 공유된 스팟이 없습니다.</li>
        )
      }
    }

    let {spotName, address, description} = this.state.addModals;

    return (
      <App>
        <Modal show={this.state.addModals.visibleModal} onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>스팟 등록하기</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal onSubmit={this.handleSpotFormSubmit}>
              <FormGroup controlId="spotName">
                <Col componentClass={ControlLabel} xs={6} sm={2}>
                  스팟 이름
                </Col>
                <Col xs={6} sm={10}>
                  <FormControl type="text"
                               placeholder="스팟의 이름을 입력해주세요."
                               value={spotName}
                               onChange={this.handleFormChange.bind(this, 'spotName')}/>
                </Col>
              </FormGroup>
              <FormGroup controlId="description">
                <Col componentClass={ControlLabel} xs={6} sm={2}>
                  스팟 설명
                </Col>
                <Col xs={6} sm={10}>
                  <FormControl componentClass="textarea"
                               value={description}
                               placeholder="스팟에 대한 설명을 적어주세요."
                               onChange={this.handleFormChange.bind(this, 'description')}/>
                </Col>
              </FormGroup>
              <div className="form-group">
                <label htmlFor="address" className="col-sm-2 col-xs-6 control-label">
                  주소
                </label>
                <Col sm={10}>
                  <input id="address" type="text" value={address} className="form-control" readOnly/>
                </Col>
              </div>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button bsStyle="primary" type="submit">
                    등록하기
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
        <Hammer onPress={this.handlePress}>
          <div className="map-wrapper">
            <div className="map" id="spot-map" style={style}></div>
            <div className="map-control col-md-4 hidden-xs">
              <Well>{this.state.user.isLogined ?
                '스팟을 등록하려면 해당 위치를 길게 누르세요' :
                '스팟을 등록하려면 로그인 하세요.'}.</Well>
              <Panel>
                <ul className="list-unstyled">
                  {spotListComponents}
                </ul>
                <Button size="xs" onClick={this.handleCurrentPositionClick}>현재 위치 찾기</Button>
              </Panel>
            </div>
          </div>
        </Hammer>
      </App>
    );
  }

  handlePress = (e) => {
    if(this.state.user.isLogined){
      // getting pressed position
      const proj = this.map.getProjection();
      const {x, y} = e.pointers[0];
      const point = new daum.maps.Point(x, y - $('.navbar').height());

      const latLng = proj.coordsFromContainerPoint(point);
      const geocoder = new daum.maps.services.Geocoder();

      // getting pressed positions address
      return geocoder.coord2detailaddr(latLng, (status, result) => {
        if (status === daum.maps.services.Status.OK) {
          let address = result[0].roadAddress.name;
          if (_.isEmpty(address)) {
            address = `[지번] ${result[0].jibunAddress.name}`;
          }

          if (_.isEmpty(address)) {
            address = result[0].region
          }
          this.setState({
            addModals: {
              visibleModal: true,
              latLng: latLng,
              address: address
            }
          }, () => {
            $('#spotName').focus();
          });
        }
      });
    }
  };

  handleFormChange = (field, e) => {
    let {addModals} = this.state;
    addModals[field] = e.target.value;
    this.setState({
      addModals: addModals
    });
  };

  handleModalClose = () => {
    this.setState({
      addModals: {
        visibleModal: false,
        eventX: null,
        eventY: null
      }
    });
  };

  handleSpotFormSubmit = (e) => {
    e.preventDefault();
    this.createSpot();
    this.handleModalClose();
  };

  handleSpotListClick = (spot, e) => {
    e.preventDefault();
    this.map.setCenter(new daum.maps.LatLng(spot.geo[0], spot.geo[1]));
  };

  handleCurrentPositionClick = (e) => {
    e.preventDefault();
    // geolocation 사용이 가능한 경우
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        this.map.setCenter(new daum.maps.LatLng(latitude, longitude));
      });
    }else{
      alert('현재 브라우저에선 지원하지 않는 기능입니다.');
    }
  }

}
