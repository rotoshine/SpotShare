import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Modal} from 'react-bootstrap';

import SpotDetail from './detail/SpotDetail';

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
    this.spotDetail.renderRoadView();
  }

  render() {
    const {
      spot, visible, isLogin, comments,
      onRemove, onClose, onAddComment, onRemoveComment, onModifyClick
    } = this.props;

    if(spot === null){
      return null;
    }

    return (
      <Modal bsSize="large" show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{spot.spotName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SpotDetail ref={(spotDetail) => { this.spotDetail = spotDetail; }}
                      spot={spot}
                      isLogin={isLogin}
                      comments={comments}
                      onRemove={onRemove}
                      onAddComment={onAddComment}
                      onRemoveComment={onRemoveComment}
                      onModifyClick={onModifyClick}/>
        </Modal.Body>
      </Modal>
    );
  }
}
