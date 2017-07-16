import React, { PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Panel } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import * as SpotActionCreators from '../actions/SpotActionCreators';
import * as CommentActionCreators from '../actions/CommentActionCreators';

import SpotDetail from '../components/detail/SpotDetail';
import CommentBox from '../components/comments/CommentBox';

/**
 * SpotDetailContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 2.
 */
class SpotDetailContainer extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    loadedSpot: PropTypes.object,
    nowCommentsLoading: PropTypes.bool.isRequired,
    comments: PropTypes.array,
    match: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    nowCommentsLoading: false
  };

  constructor (props) {
    super(props);

    const { dispatch } = props;
    this.spotDetail = null;
    this.spotActions = bindActionCreators(SpotActionCreators, dispatch);
    this.commentActions = bindActionCreators(CommentActionCreators, dispatch);
  }

  componentDidMount () {
    const { loadedSpot, match } = this.props;

    const didMountCallback = (loadedSpot) => {
      $(window).scrollTop(0);
      this.spotDetail.renderRoadView();
      this.commentActions.fetchComments(loadedSpot._id);
      this.renderSpotStaticMap();
    };

    const paramsSpotId = parseInt(match.params.spotId);
    if ( !_.isNil(loadedSpot) && loadedSpot._id === paramsSpotId ) {
      didMountCallback(loadedSpot);
    } else {
      this.spotActions
        .requestSpot(paramsSpotId)
        .then(didMountCallback);
    }
  }

  renderSpotStaticMap () {
    const { loadedSpot } = this.props;

    if ( !_.isNil(loadedSpot) && window.daum ) {
      const position = new daum.maps.LatLng(loadedSpot.geo[ 0 ], loadedSpot.geo[ 1 ]);
      const marker = {
        position: position,
        text: loadedSpot.spotName
      };

      this.staticMap = new daum.maps.StaticMap(
        document.getElementById('map'),
        {
          center: position,
          level: 3,
          marker: marker
        }
      );

    }
  }

  render () {
    const { app, loadedSpot, nowCommentsLoading, comments } = this.props;
    const { user } = app;
    const { isLogin } = user;
    const { createComment, removeComment } = this.commentActions;

    if ( !_.isNil(loadedSpot) ) {
      return (
        <div className="container spot-detail-container">
          <Row>
            <Col xs={12}>
              <Panel style={{ marginTop: 10 }}
                     bsStyle="info"
                     header={loadedSpot.spotName}>
                <div id="map" style={{ width: '100%', height: 300, marginBottom: 20 }}/>
                <SpotDetail ref={(spotDetail) => {
                  this.spotDetail = spotDetail;
                }}
                            spot={loadedSpot}
                            isLogin={isLogin}
                            onRemove={this.handleSpotRemoveClick}
                            onModifyClick={this.handleSpotModifyClick}/>
              </Panel>
            </Col>
            <Col xs={12}>
              <Panel>
                <CommentBox user={user}
                            spotId={loadedSpot._id}
                            nowLoading={nowCommentsLoading}
                            comments={comments}
                            onAddComment={createComment}
                            onRemoveComment={removeComment}/>
              </Panel>
            </Col>
            <Col xs={12} className="text-right">
              <Link to="/spots" className="btn btn-info btn-raised">
                <i className="fa fa-list-ul" style={{ marginRight: 10 }}/>
                Move List
              </Link>
            </Col>
          </Row>
        </div>
      );
    } else {
      return <div>now loading..</div>;
    }
  }

  handleSpotModifyClick = (spot) => {
    const { app, history } = this.props;
    if ( app.user.isLogin ) {
      history.push(`/spots/${spot._id}/form`);
    } else {
      alert('로그인 후 수정 가능합니다.');
    }
  };

  handleSpotRemoveClick = (spot) => {
    const { user } = this.props.app;

    const removeAfterCallback = () => {
      this.handleModalClose();
      this.fetchSpotsWithCoordinates();
    };
    if ( user.isLogin ) {
      if ( user._id === spot.createdBy._id ) {
        if ( confirm('공유하신 스팟을 삭제하시겠습니까?') ) {
          this.actions.removeSpot(spot._id).then(removeAfterCallback);
        }
      } else {
        if ( confirm('등록한 사용자가 아니기 때문에 삭제요청만 가능합니다.\n삭제요청하시겠습니까?') ) {
          this.actions.removeRequestSpot(spot._id).then(removeAfterCallback);
        }
      }
    } else {
      alert('로그인 하세요.');
    }
  };
}

export default withRouter(connect((state) => {
  return {
    app: state.app,
    loadedSpot: state.spot.loadedSpot,
    nowCommentsLoading: state.comments.nowLoading,
    comments: state.comments.comments
  };
})(SpotDetailContainer));
