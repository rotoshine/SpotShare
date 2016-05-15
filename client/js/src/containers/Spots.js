import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import Hammer from 'react-hammerjs';
import {Button, Well, Panel, Form, FormGroup, FormControl, Col, ControlLabel, Modal} from 'react-bootstrap';

import App from '../App';
export default class Spots extends React.Component {
  state = {
    nowLoading: false,
    addModals: {
      visibleModal: false,
      spotName: null,
      address: null,
      latLng: null
    },
    spots: [],
    height: 0
  };

  componentDidMount() {
    this.setState({
      height: $(window).height() - $('.nav').height() - 2
    }, () => {
      this.createMap();
      this.registEvents();
      this.fetchSpots();
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
  }

  registEvents() {

    if (this.map !== null) {
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

  createSpot() {
    let {spots} = this.state;
    let {spotName, address, latLng} = this.state.addModals;
    spots.push({
      spotName: spotName,
      address: address,
      geo: [latLng.getLat(), latLng.getLng()]
    });

    this.setState({
      spots: spots
    }, () => {
      this.renderMarkers();
      this.handleModalClose();
      //this.fetchSpots();
    })
  }

  fetchSpots() {
    this.setState({
      nowLoading: true
    }, () => {
      $.get('/api/spots')
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
    });
  }

  render() {
    let style = {width: '100%', height: this.state.height};

    let spots = [];

    _.map(this.state.spots, (spot, i) => {
      spots.push(
        <li key={i} onClick={this.handleSpotListClick.bind(this, spot)}>
          {spot.spotName}
        </li>
      )
    });

    let panelHeader = <h3>Spot List</h3>;

    let {spotName, address} = this.state.addModals;

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
                               onChange={this.handleAddModalsSpotNameChange}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="description">
                <Col componentClass={ControlLabel} xs={6} sm={2}>
                  스팟 설명
                </Col>
                <Col xs={6} sm={10}>
                  <FormControl componentClass="textarea"
                               placeholder="스팟에 대한 설명을 적어주세요."/>
                </Col>
              </FormGroup>
              <FormGroup controlId="address">
                <Col componentClass={ControlLabel} sm={2}>
                  주소
                </Col>
                <Col sm={10}>
                  <FormControl type="text" value={address} readOnly/>
                </Col>
              </FormGroup>

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
            <div className="map-control">
              <Well>스팟을 등록하려면 해당 위치를 길게 누르세요.</Well>
              <Panel header={panelHeader}>
                <ul className="list-unstyled">
                  {spots}
                </ul>
              </Panel>
            </div>
          </div>
        </Hammer>
      </App>
    );
  }

  handlePress = (e) => {
    const proj = this.map.getProjection();
    const {x, y} = e.pointers[0];
    const point = new daum.maps.Point(x, y - $('.navbar').height());

    const latLng = proj.coordsFromPoint(point);

    const geocoder = new daum.maps.services.Geocoder();

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

  };

  handleAddModalsSpotNameChange = (e) => {
    let {addModals} = this.state;
    addModals.spotName = e.target.value;
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
  };

  handleSpotListClick = (spot) => {
    this.map.setCenter(new daum.maps.LatLng(spot.geo[0], spot.geo[1]));
  };

}
