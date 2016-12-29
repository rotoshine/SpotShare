import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import _ from 'lodash';
import Immutable from 'immutable';

import * as SpotActionCreators from '../actions/SpotsActionCreators';
import * as CommentActionCreators from '../actions/CommentActionCreators';

import {Well, Input} from 'react-bootstrap';


import App from '../App';
import SpotList from '../components/SpotList';
import SpotFormModal from '../components/SpotFormModal';
import SpotDetailModal from '../components/SpotDetailModal';


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
    user: JSON.parse(document.getElementById('user').innerHTML),
    useCurrentPosition: location.protocol === 'https:'
  };

  constructor(props) {
    super(props);

    const {dispatch} = props;

    this.actions = bindActionCreators(SpotActionCreators, dispatch);
    this.commentActions = bindActionCreators(CommentActionCreators, dispatch);

    this.markers = [];
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
        level: 3,
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: true
      };

      this.map = new daum.maps.Map(container, options);
      this.markers = [];

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
      event.addListener(map, 'dblclick', (mouseEvent) => {
        if(this.state.user.isLogin){
          this.showSpotFormModal(mouseEvent.latLng);
        }else{
          alert('로그인 후 등록 가능합니다.');
        }
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

  removeRenderedMarkers() {
    // 기존에 렌더링 된 마커 삭제
    this.markers.forEach((marker) => {
      marker.infoWindow.close();
      marker.setMap(null);
    });
    this.markers = [];
  }
  renderMarkers() {
    this.removeRenderedMarkers();
    const {spots} = this.props;

    spots.forEach(spot => {
      if (_.isArray(spot.geo) && spot.geo.length === 2) {
        const markerPosition = new daum.maps.LatLng(spot.geo[0], spot.geo[1]);
        let marker = new daum.maps.Marker({
          position: markerPosition,
          clickable: true
        });

        marker.spotId = spot._id;

        marker.setMap(this.map);

        const infoWindow = new daum.maps.InfoWindow({
          position: markerPosition,
          content: `<div class="marker-info-window">${spot.spotName}</div>`,
          zIndex: 3
        });

        infoWindow.open(this.map, marker);
        marker.infoWindow = infoWindow;

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
    }, () => {
      this.refs.spotDetailModal.renderRoadView();
    });
  }

  showSpotFormModal(latLng) {
    // getting pressed position
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
      const defaultHandler = () => {
        return resolve({
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE
        });
      };

      try {
        // geolocation 사용이 가능한 경우
        if ('geolocation' in navigator && this.state.useCurrentPosition) {
          return navigator.geolocation.getCurrentPosition((position) => {
            if (_.isObject(position)) {
              const {latitude, longitude} = position.coords;
              return resolve({
                latitude: latitude,
                longitude: longitude
              });
            } else {
              defaultHandler();
            }
          }, () => {
            alert('gps를 켜주세요.');
            defaultHandler();
          }, {
            timeout: 1000 * 3
          });
        } else {
          defaultHandler();
        }
      } catch (e) {
        defaultHandler();
      }
    });

  }

  setCurrentPosition() {
    this.getCurrentPosition().then((latLng) => {
      this.map.setCenter(new daum.maps.LatLng(latLng.latitude, latLng.longitude));
    });

  }

  render() {
    const {addModal, detailDisplayModal, user} = this.state;
    const {spots, spotForm} = this.props;

    const {createComment, removeComment} = this.commentActions;

    return (
      <App>
        <SpotDetailModal ref="spotDetailModal"
                         visible={detailDisplayModal.visible}
                         spot={detailDisplayModal.displaySpot}
                         isLogin={user.isLogin}
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
        <div className="map-wrapper flex-container">
          <Well className="map-tooltip">{user.isLogin ?
            '스팟을 등록하려면 해당 위치를 더블클릭 하세요' :
            '스팟을 등록하려면 로그인 하세요.'}.
          </Well>
          <div className="map" id="spot-map" />
          <div className="map-control">
            <SpotList spots={spots}
                      useCurrentPosition={this.state.useCurrentPosition}
                      onSpotClick={this.handleSpotListClick}
                      onMouseOver={this.handleMouseOver}
                      onCurrentPositionClick={this.handleCurrentPositionClick}/>
          </div>
        </div>
      </App>
    );
  }

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

  handleMouseOver = (spotId) => {
    // 현재 마커중 찾아서 표시하기

    console.log(spotId);
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
