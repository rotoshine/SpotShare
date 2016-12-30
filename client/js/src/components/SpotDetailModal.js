import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Modal} from 'react-bootstrap';
import CommentBox from './comments/CommentBox';

export default class SpotDetailModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    spot: PropTypes.object,
    isLogin: PropTypes.bool.isRequired,
    comments: PropTypes.array,
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
      onClose, onAddComment, onRemoveComment, onModifyClick} = this.props;

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
      <Modal show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{spot.spotName} 상세정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <dl className="dl-horizontal">
            <dt>이름</dt>
            <dd>{spot.spotName}</dd>
            <dt>주소</dt>
            <dd>{spot.address}</dd>
            <dt>설명</dt>
            <dd>{description}</dd>
          </dl>
          <hr/>
          <div className="row" style={{marginTop:-10, marginBottom:10}}>
            <div className="col-xs-offset-2">
              <span className="label label-primary"><i className={`fa fa-${createdBy.provider}`} />{createdBy.name}</span>
              <span>님이 공유한 장소입니다.</span>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <button className="btn btn-default btn-raised pull-left" onClick={onModifyClick.bind(this, spot)}><i className="fa fa-edit"/> Modify</button>
              <button className="btn btn-info btn-raised pull-right" onClick={() => { alert('구현예정'); }}><i className="fa fa-share-alt"/> Share</button>
            </div>
          </div>
          <div className="row">
            <div style={{width:'100%', height: 300}} id="road-view">
          </div>
          </div>
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
