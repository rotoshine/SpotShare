import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as SpotsActionCreators from '../actions/SpotsActionCreators';
import * as CommentActionCreators from '../actions/CommentActionCreators';
import {Row, Col, Panel} from 'react-bootstrap';
import SpotDetail from '../components/detail/SpotDetail';
/**
 * SpotDetailContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 2.
 */
class SpotDetailContainer extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    loadedSpot: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const {dispatch} = props;
    this.spotDetail = null;
    this.spotActions = bindActionCreators(SpotsActionCreators, dispatch);
    this.commentActions = bindActionCreators(CommentActionCreators, dispatch);
  }

  componentDidMount() {
    const {loadedSpot} = this.props;
    if(!_.isArray(loadedSpot.files) || loadedSpot.files.length === 0){
      this.spotDetail.renderRoadView();
    }

    this.commentActions.fetchComments(loadedSpot._id);
    this.renderSpotStaticMap();
  }

  renderSpotStaticMap () {
    const {loadedSpot} = this.props;

    if(window.daum){
      const position = new daum.maps.LatLng(loadedSpot.geo[0], loadedSpot.geo[1]);
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

  render() {
    const {app, loadedSpot} = this.props;
    const {createComment, removeComment} = this.commentActions;
    return (
      <div className="container">
        <Row>
          <Col xs={12}>
            <Panel style={{marginTop:10}}
                   bsStyle="info"
                   header={loadedSpot.spotName}>
              <div id="map" style={{width:'100%', height: 300, marginBottom: 20}} />
              <SpotDetail ref={(spotDetail) => { this.spotDetail = spotDetail; }}
                          spot={loadedSpot}
                          isLogin={app.user.isLogin}
                          comments={[]}
                          onRemove={() => {}}
                          onAddComment={createComment}
                          onRemoveComment={removeComment}
                          onModifyClick={() => {}}/>
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    app: state.app,
    loadedSpot: state.spots.loadedSpot
  };
})(SpotDetailContainer)
