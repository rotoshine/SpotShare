import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import _ from 'lodash';
import Hammer from 'react-hammerjs';
import Immutable from 'immutable';

import * as SpotActionCreators from '../actions/SpotsActionCreators';
import * as CommentActionCreators from '../actions/CommentActionCreators';

import {Button, Well, Panel, Form, FormGroup, FormControl, Input, ControlLabel, Modal, Row, Col} from 'react-bootstrap';


import App from '../App';
import SpotList from '../components/SpotList';
import SpotFormModal from '../components/SpotFormModal';
import SpotDetailModal from '../components/SpotDetailModal';
import CommentBox from '../components/comments/CommentBox';


class Spots extends React.Component {
  static propTypes = {
    nowLoading: PropTypes.bool.isRequired,
    spots: PropTypes.array.isRequired,
    spotForm: PropTypes.shape({
      spotName: PropTypes.string,
      description: PropTypes.string,
      address: PropTypes.string,
      geo: []
    }).isRequired,
    comments: PropTypes.array
  };

  state = {
    nowLoading: false,
    addModal: {
      visible: false
    },
    detailDisplayModal: {
      visible: false,
      displaySpot: null
    },
    height: 0,
    user: JSON.parse(document.getElementById('user').innerHTML)
  };

  constructor(props) {
    super(props);

    const {dispatch} = props;

    this.actions = bindActionCreators(SpotActionCreators, dispatch);
    this.commentActions = bindActionCreators(CommentActionCreators, dispatch);
  }

  componentDidMount() {
    this.setState({
      height: $(window).height() - $('.navbar').height()
    }, () => {
      this.createMap();
    });
  }

  createMap() {
    this.getCurrentPosition().then((latLng) => {
      // daum map initialize
      let container = document.getElementById('spot-map');
      let options = {
        center: new daum.maps.LatLng(latLng.latitude, latLng.longitude), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      this.map = new daum.maps.Map(container, options);
      this.markers = Immutable.List.of();

      this.fetchSpots();
      this.registEvents();
    });
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
    this.actions.createSpot(this.props.spotForm).then(() => {
      this.fetchSpots();
    });
    this.actions.resetSpotForm();

    this.renderMarkers();
    this.handleModalClose();

  }

  fetchSpots() {
    const bounds = this.map.getBounds();
    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();

    this.actions.fetchSpots(
      neLatLng.getLat(),
      neLatLng.getLng(),
      swLatLng.getLat(),
      swLatLng.getLng()
    ).then(() => {
      this.renderMarkers();
    });
  }

  renderMarkers() {
    this.markers = Immutable.List.of();

    const {spots} = this.props;

    spots.forEach(spot => {
      if (_.isArray(spot.geo) && spot.geo.length === 2) {
        let marker = new daum.maps.Marker({
          position: new daum.maps.LatLng(spot.geo[0], spot.geo[1]),
          clickable: true
        });

        marker.spotId = spot._id;

        marker.setMap(this.map);
        this.markers.push(marker);

        // marker 이벤트 등록
        daum.maps.event.addListener(marker, 'click', () => {
          this.showSpotDetail(spot);
        });
      }
    });
  }

  showSpotDetail(spot) {
    this.commentActions.fetchComments(spot._id);

    this.setState({
      detailDisplayModal: {
        visible: true,
        displaySpot: spot
      }
    });
  }

  showSpotFormModal(x, y) {
    // getting pressed position
    const proj = this.map.getProjection();
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
        this.actions.updateSpotForm('geo', [latLng.getLat(), latLng.getLng()]);
        this.actions.updateSpotForm('address', address);
        this.setState({
          addModal: {
            visible: true
          }
        }, () => {
          $('#spotName').focus();
        });
      }
    });
  }

  getCurrentPosition() {
    const DEFAULT_LATITUDE = 37.54251441506003;
    const DEFAULT_LONGITUDE = 127.11770256831429;

    return new Promise((resolve) => {
      // geolocation 사용이 가능한 경우
      if ('geolocation' in navigator) {
        // chrome에선 https가 아니면 이 부분에서 에러가 발생한다. 방어코드
        try {
          navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            return resolve({
              latitude: latitude,
              longitude: longitude
            });
          });
        } catch (e) {
          console.error(e);
          return resolve({
            latitude: DEFAULT_LATITUDE,
            longitude: DEFAULT_LONGITUDE
          });
        }
      } else {
        return resolve({
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE
        });
      }
    });

  }

  setCurrentPosition() {
    this.getCurrentPosition().then((latLng) => {
      this.map.setCenter(new daum.maps.LatLng(latLng.latitude, latLng.longitude));
    });

  }

  render() {
    let style = {width: '100%', height: this.state.height};

    const {addModal, detailDisplayModal, user} = this.state;
    const {spots, spotForm} = this.props;

    const {createComment, removeComment} = this.commentActions;
    return (
      <App>
        <SpotDetailModal visible={detailDisplayModal.visible}
                         spot={detailDisplayModal.displaySpot}
                         comments={this.props.comments}
                         onAddComment={createComment}
                         onRemoveComment={removeComment}
                         onLike={this.handleSpotLike}
                         onClose={this.handleModalClose}/>
        <SpotFormModal visible={addModal.visible}
                       spotForm={spotForm}
                       onFormUpdate={this.actions.updateSpotForm}
                       onClose={this.handleModalClose}
                       onSubmit={this.handleSpotFormSubmit}/>
        <Hammer onPress={this.handlePress}>
          <div className="map-wrapper">
            <div className="map" id="spot-map" style={style}></div>
            <div className="map-control col-md-4 hidden-xs">
              <Well>{user.isLogined ?
                '스팟을 등록하려면 해당 위치를 길게 누르세요' :
                '스팟을 등록하려면 로그인 하세요.'}.</Well>
              <SpotList spots={spots}
                        onSpotClick={this.handleSpotListClick}
                        onCurrentPositionClick={this.handleCurrentPositionClick}/>
            </div>
          </div>
        </Hammer>
      </App>
    );
  }

  handlePress = (e) => {
    if (this.state.user.isLogined) {
      const {x, y} = e.pointers[0];
      this.showSpotFormModal(x, y);
    }
  };

  handleModalClose = () => {
    this.setState({
      addModal: {
        visible: false,
        eventX: null,
        eventY: null
      },
      detailDisplayModal: {
        visible: false,
        displaySpot: null,
        comments: []
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
    this.showSpotDetail(spot);
  };

  handleCurrentPositionClick = (e) => {
    e.preventDefault();
    this.setCurrentPosition();
  };

  handleSpotLike = () => {
    // 현재 선택된 스팟에서 id 뽑아서 action 보내기~
  };
}


export default connect((state) => {
  return {
    spots: state.spots.spots,
    spotForm: state.spots.spotForm,
    nowLoading: state.spots.nowLoading,
    comments: state.comments
  };
})(Spots);
