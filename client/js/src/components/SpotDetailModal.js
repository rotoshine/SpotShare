import React, {PropTypes} from 'react';

import {Modal} from 'react-bootstrap';
import CommentBox from './comments/CommentBox';

export default class SpotDetailModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    spot: PropTypes.object,
    comments: PropTypes.array,
    onAddComment: PropTypes.func.isRequired,
    onRemoveComment: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    const {spot, visible, comments, onClose, onAddComment, onRemoveComment} = this.props;

    if (spot === null) {
      return null;
    }

    let description = spot.description;

    if (description === null || description === '') {
      description = '설명이 딱히 없네요.';
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
              <span className="label label-primary">{spot.createdBy.name}</span>
              <span>님이 공유한 장소입니다.</span>
            </div>
          </div>
          <CommentBox spotId={spot._id}
                      comments={comments}
                      onAddComment={onAddComment}
                      onRemoveComment={onRemoveComment}/>
        </Modal.Body>
      </Modal>
    );
  }
}
