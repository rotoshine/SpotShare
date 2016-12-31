import React, {PropTypes} from 'react';
import _ from 'lodash';
import nl2br from 'react-nl2br';

import {Modal, ButtonGroup} from 'react-bootstrap';
import CommentBox from './comments/CommentBox';

export default class SpotDetailModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    spot: PropTypes.object,
    isLogin: PropTypes.bool.isRequired,
    comments: PropTypes.array,
    onRemove: PropTypes.func.isRequired,
    onAddComment: PropTypes.func.isRequired,
    onRemoveComment: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    onModifyClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };
  
  renderRoadView() {
    const {spot} = this.props;

    if(_.isObject(spot)) {
      const roadViewContainer = document.getElementById('road-view');
      const roadView = new daum.maps.Roadview(roadViewContainer);
      const roadViewClient = new daum.maps.RoadviewClient();

      const position = new daum.maps.LatLng(spot.geo[0], spot.geo[1]);

      roadViewClient.getNearestPanoId(position, 50, (panoId) => {
        roadView.setPanoId(panoId, position);
      });
    }
  }
  
  render() {
    const {spot, visible, isLogin, comments,
      onRemove, onClose, onAddComment, onRemoveComment, onModifyClick} = this.props;

    if (spot === null) {
      return null;
    }

    let description = spot.description;

    if (description === null || description === '') {
      description = '설명이 딱히 없네요.';
    }

    let createdBy = spot.createdBy;

    if(createdBy === null){
      createdBy = { name: '신원미상' };
    }
    return (
      <Modal bsSize="large" show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{spot.spotName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="spot-detail-contents-container">
              <div className="spot-detail-modal-contents">
                <div><strong>{spot.address}</strong>에 위치</div>
                <div className="spot-detail-description">{nl2br(description)}</div>
              </div>
              <div id="road-view" className="road-view" />
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-xs-12">
              <div className="pull-left">
                <button className="btn btn-primary btn-raised"><i className="fa fa-thumbs-up "/> {spot.likeCount}</button>명이 추천합니다.
              </div>
              <div className="pull-right">
                <span className="label label-info"><i className={`fa fa-${createdBy.provider}`}/> {createdBy.name}</span>
                <span>님이 공유</span>
                <ButtonGroup>
                  <button className="btn btn-info btn-sm btn-raised " onClick={() => { alert('구현예정'); }}><i className="fa fa-share-alt"/></button>
                  <button className="btn btn-default btn-sm btn-raised" onClick={onModifyClick.bind(this, spot)}><i className="fa fa-edit"/></button>
                  <button className="btn btn-danger btn-sm btn-raised" onClick={onRemove.bind(this, spot)}><i className="fa fa-remove" /></button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <hr/>
          <CommentBox spotId={spot._id}
                      isLogin={isLogin}
                      comments={comments}
                      onAddComment={onAddComment}
                      onRemoveComment={onRemoveComment}/>
        </Modal.Body>
      </Modal>
    );
  }
}
