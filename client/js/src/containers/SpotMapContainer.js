import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import _ from 'lodash';

// action creators
import * as SpotActionCreators from '../actions/SpotsActionCreators';
import * as commentActions from '../actions/commentActions';
import * as SpotFileActionCreators from '../actions/SpotFileActionCreators';
import * as spotMapActions from '../actions/spotMapActions';

import {Well, Input, Button} from 'react-bootstrap';

import SimpleSpotList from '../components/SimpleSpotList';
import SpotFormModal from '../components/modals/SpotFormModal';
import SpotDetailModal from '../components/modals/SpotDetailModal';

const CLUSTERER_LEVEL = 5;
class SpotMapContainer extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    nowLoading: PropTypes.bool.isRequired,
    spots: PropTypes.array.isRequired,
    spotForm: PropTypes.object.isRequired,
    comments: PropTypes.array
  };

  state = {
    formModal: {
      visible: false
    },
    detailDisplayModal: {
      visible: false,
      displaySpot: null
    },
    height: 0,
    useCurrentPosition: window && window.location && window.location.protocol === 'https:'
  };

  constructor(props) {
    super(props);

    const {dispatch} = props;

    this.actions = bindActionCreators(SpotActionCreators, dispatch);
    this.spotFileActions = bindActionCreators(SpotFileActionCreators, dispatch);

    this.markers = [];
  }

  componentDidMount() {
    const {mapConfig} = this.props;

    if (mapConfig && mapConfig.markerUrl) {
      this.markerImage = new daum.maps.MarkerImage(
        mapConfig.markerUrl,
        new daum.maps.Size(32, 32),
        {
          offset: new daum.maps.Point(16, 16)
        }
      );
      this.bigMarkerImage = new daum.maps.MarkerImage(
        mapConfig.markerUrl,
        new daum.maps.Size(48, 48),
        {
          offset: new daum.maps.Point(24, 24)
        }
      );
    }

    this.setState({
      height: window ? $(window).height() - $('.navbar').height() : 1000
    }, () => {
      this.createMap();
      $('#spot-map').on('click', '.marker-info-window', (e) => {
        const spotId = $(e.target).data('spotId');
        this.showSpotDetail(_.find(this.props.spots, (spot) => spot._id === spotId));
      });
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
      const zoomControl = new daum.maps.ZoomControl();
      this.map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
      this.clusterer = new daum.maps.MarkerClusterer({
        map: this.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: CLUSTERER_LEVEL // 클러스터 할 최소 지도 레벨
      });

      this.markers = [];

      this.fetchSpotsWithCoordinates();
      this.registMapEvents();
    });
  }

  registMapEvents() {
    if (this.map !== null) {
      const {event} = daum.maps;
      const map = this.map;
      event.addListener(map, 'dragend', () => {
        this.fetchSpotsWithCoordinates();
      });
      event.addListener(map, 'zoom_changed', () => {
        this.fetchSpotsWithCoordinates();
      });
      event.addListener(map, 'dblclick', (mouseEvent) => {
        if (this.props.user.isLogin) {
          this.showNewSpotFormModal(mouseEvent.latLng);
        } else {
          alert('로그인 후 등록 가능합니다.');
        }
      });
    }
  }

  createOrUpdateSpot() {
    const {spotForm} = this.props;
    this.actions
      .createOrUpdateSpot(spotForm)
      .then((spot) => {
        this.actions.resetSpotForm();
        this.fetchSpotsWithCoordinates();
        this.handleModalClose();
        this.showSpotDetail(spot);
      });
  }

  fetchSpotsWithCoordinates() {
    const { dispatch } = this.props;

    const bounds = this.map.getBounds();
    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();

    dispatch({
      type: spotMapActions.FETCH_MAP_SPOTS,
      x1: neLatLng.getLat(),
      y1: neLatLng.getLng(),
      x2: swLatLng.getLat(),
      y2: swLatLng.getLng()
    });
  }

  removeRenderedMarkers() {
    // 기존에 렌더링 된 마커 삭제
    this.markers.forEach((marker) => {
      marker.infoWindow.setMap(null);
      marker.setMap(null);
    });
    this.clusterer.removeMarkers(this.markers);
    this.markers = [];
  }

  renderMarkers() {
    this.removeRenderedMarkers();
    const {spots} = this.props;

    spots.forEach(spot => {
      if (_.isArray(spot.geo) && spot.geo.length === 2) {
        const markerPosition = new daum.maps.LatLng(spot.geo[0], spot.geo[1]);

        let markerParams = {
          position: markerPosition,
          clickable: true
        };

        if (this.markerImage) {
          markerParams.image = this.markerImage;
        }

        let marker = new daum.maps.Marker(markerParams);
        marker.spotId = spot._id;
        marker.setMap(this.map);

        marker.infoWindow = new daum.maps.CustomOverlay({
          map: this.map,
          position: markerPosition,
          content: this.map.getLevel() < CLUSTERER_LEVEL ?
            `<div class="marker-info-window" data-spot-id="${spot._id}">${spot.spotName}</div>` :
            '',
          zIndex: 3,
          yAnchor: 1.5
        });

        this.markers.push(marker);

        // marker 이벤트 등록
        daum.maps.event.addListener(marker, 'click', () => {
          this.showSpotDetail(spot);
        });
      }
    });

    this.clusterer.addMarkers(this.markers);
  }

  showSpotDetail(spot) {
    const { dispatch } = this.props;
    dispatch({
      type: commentActions.FETCH_COMMENTS,
      spotId: spot._id
    });

    this.setState({
      detailDisplayModal: {
        visible: true,
        displaySpot: spot
      }
    }, () => {
      this.spotDetailModal.renderRoadView();
    });
  }

  showNewSpotFormModal(latLng) {
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
          formModal: {
            visible: true
          }
        }, () => {
          $('#spotName').focus();
        });
      }
    });
  }

  showModifySpotFormModal(spot) {
    this.actions.setSpotForm(spot);
    this.setState({
      formModal: {
        visible: true
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
        if (window && 'geolocation' in window.navigator && this.state.useCurrentPosition) {
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
            timeout: 1000 * 5
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

  renderCurrentPositionButton() {
    //if(this.state.useCurrentPosition){
    return (
      <Button className="current-position btn-raised" onClick={this.handleCurrentPositionClick}>
        <i className="fa fa-location-arrow"/>
      </Button>
    );
    //}else{
    //  return null;
    //}
  }

  render() {
    const {formModal, detailDisplayModal} = this.state;
    const {user, spots, spotForm, nowLoading, dispatch} = this.props;


    if(_.isArray(spots) && spots.length > 0) {
      this.renderMarkers();
    }

    return (
      <div>
        <SpotDetailModal ref={(spotDetailModal) => { this.spotDetailModal = spotDetailModal; }}
                         visible={detailDisplayModal.visible}
                         spot={detailDisplayModal.displaySpot}
                         user={user}
                         nowCommentLoading={this.props.nowCommentLoading}
                         comments={this.props.comments}
                         onRemove={this.handleSpotRemoveClick}
                         onAddComment={(spotId, content) => dispatch({type: commentActions.CREATE_COMMENT, spotId, content})}
                         onRemoveComment={() => {}}
                         onLike={this.handleSpotLike}
                         onClose={this.handleModalClose}
                         onModifyClick={this.handleSpotModifyClick}/>
        <SpotFormModal visible={formModal.visible}
                       spotForm={spotForm}
                       onFormUpdate={this.actions.updateSpotForm}
                       onClose={this.handleModalClose}
                       onSubmit={this.handleSpotFormSubmit}
                       onFileUpload={this.handleFileUpload}/>
        <div className="map-wrapper flex-container">
          {this.renderCurrentPositionButton()}
          <Well className="map-tooltip">{user.isLogin ?
            '스팟을 등록하려면 해당 위치를 더블클릭 하세요' :
            '스팟을 등록하려면 로그인 하세요.'}.
          </Well>
          <div className="map" id="spot-map"/>
          <div className="map-control">
            <SimpleSpotList spots={spots}
                            nowLoading={nowLoading}
                            onSpotClick={this.handleSimpleSpotListClick}
                            onMouseOver={this.handleMouseOver}
                            onMouseOut={this.handleMouseOut}/>
          </div>
        </div>
      </div>
    );
  }

  handleModalClose = () => {
    this.actions.resetSpotForm();
    this.setState({
      formModal: {
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

  handleSpotFormSubmit = () => {
    this.createOrUpdateSpot();
    this.handleModalClose();
  };

  handleSimpleSpotListClick = (spot, e) => {
    e.preventDefault();
    this.map.setCenter(new daum.maps.LatLng(spot.geo[0], spot.geo[1]));
    this.showSpotDetail(spot);
  };

  handleCurrentPositionClick = (e) => {
    e.preventDefault();
    this.setCurrentPosition();
  };

  handleSpotLike = (spotId) => {
    this.actions.likeSpot(spotId);
  };

  handleMouseOver = (spotId) => {
    if (this.markerImage) {
      // 현재 마커중 찾아서 표시하기
      const marker = _.find(this.markers, (marker) => marker.spotId === spotId);
      marker.setImage(this.bigMarkerImage);
    }
  };

  handleMouseOut = (spotId) => {
    if (this.markerImage) {
      const marker = _.find(this.markers, (marker) => marker.spotId === spotId);
      marker.setImage(this.markerImage);
    }
  };

  handleSpotModifyClick = (spot) => {
    if (this.props.user.isLogin) {
      this.handleModalClose();
      this.showModifySpotFormModal(spot);
    } else {
      alert('로그인 후 수정 가능합니다.');
    }
  };

  handleSpotRemoveClick = (spot) => {
    const {user} = this.props;

    const removeAfterCallback = () => {
      this.handleModalClose();
      this.fetchSpotsWithCoordinates();
    };
    if (user.isLogin) {
      if (user._id === spot.createdBy._id) {
        if (confirm('공유하신 스팟을 삭제하시겠습니까?')) {
          this.actions.removeSpot(spot._id).then(removeAfterCallback);
        }
      } else {
        if (confirm('등록한 사용자가 아니기 때문에 삭제요청만 가능합니다.\n삭제요청하시겠습니까?')) {
          this.actions.removeRequestSpot(spot._id).then(removeAfterCallback);
        }
      }
    } else {
      alert('로그인 하세요.');
    }
  };

  handleFileUpload = (spotId, files) => {
    if (files.length > 0) {
      this.spotFileActions.upload(spotId, files);
    }
  };
}


export default connect(
  (state) => {
    return {
      user: state.app.user,
      mapConfig: state.app.mapConfig,
      spots: state.spotMap.spots,
      spotForm: state.spotForm,
      nowLoading: state.spotMap.nowLoading,
      nowCommentLoading: state.comments.nowLoading,
      comments: state.comments.comments
    };
  })
(SpotMapContainer);
