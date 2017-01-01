import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import _ from 'lodash';

// action creators
import * as SpotActionCreators from '../actions/SpotsActionCreators';
import * as CommentActionCreators from '../actions/CommentActionCreators';
import * as SpotFileActionCreators from '../actions/SpotFileActionCreators';

import {Well, Input, Button} from 'react-bootstrap';


import App from '../App';
import SimpleSpotList from '../components/SimpleSpotList';
import SpotFormModal from '../components/SpotFormModal';
import SpotDetailModal from '../components/SpotDetailModal';

const CLUSTERER_LEVEL = 5;
class SpotMapContainer extends React.Component {
  static propTypes = {
    nowLoading: PropTypes.bool.isRequired,
    spots: PropTypes.array.isRequired,
    spotForm: PropTypes.shape({
      _id: PropTypes.number,
      spotName: PropTypes.string,
      description: PropTypes.string,
      address: PropTypes.string,
      geo: []
    }).isRequired,
    comments: PropTypes.array
  };

  state = {
    nowLoading: false,
    formModal: {
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
    this.spotFileActions = bindActionCreators(SpotFileActionCreators, dispatch);

    this.markers = [];

    const mapConfig = JSON.parse(document.getElementById('mapConfig').innerHTML);

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
  }

  componentDidMount() {
    this.setState({
      height: $(window).height() - $('.navbar').height()
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

      this.fetchSpots();
      this.registMapEvents();
    });
  }

  registMapEvents() {
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
        if (this.state.user.isLogin) {
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
        this.fetchSpots();
        this.handleModalClose();
        this.showSpotDetail(spot);
      });
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
    const {formModal, detailDisplayModal, user} = this.state;
    const {spots, spotForm, nowLoading} = this.props;

    const {createComment, removeComment} = this.commentActions;

    return (
      <App>
        <SpotDetailModal ref="spotDetailModal"
                         visible={detailDisplayModal.visible}
                         spot={detailDisplayModal.displaySpot}
                         isLogin={user.isLogin}
                         comments={this.props.comments}
                         onRemove={this.handleSpotRemoveClick}
                         onAddComment={createComment}
                         onRemoveComment={removeComment}
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
      </App>
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
    if (this.state.user.isLogin) {
      this.handleModalClose();
      this.showModifySpotFormModal(spot);
    } else {
      alert('로그인 후 수정 가능합니다.');
    }
  };

  handleSpotRemoveClick = (spot) => {
    const {user} = this.state;

    const removeAfterCallback = () => {
      this.handleModalClose();
      this.fetchSpots();
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
      spots: state.spots.spots,
      spotForm: state.spots.spotForm,
      nowLoading: state.spots.nowLoading,
      comments: state.comments
    };
  })
(SpotMapContainer);
