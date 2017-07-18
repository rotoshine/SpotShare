import React, {PropTypes} from 'react';
import {Link} from 'react-router-dom';
import {Modal} from 'react-bootstrap';

import SpotDetail from '../detail/SpotDetail';
import CommentBox from '../comments/CommentBox';

export default class SpotDetailModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    spot: PropTypes.object,
    user: PropTypes.object.isRequired,
    nowCommentLoading: PropTypes.bool.isRequired,
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
      user, spot, visible, nowCommentLoading, comments,
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
                      user={user}
                      comments={comments}
                      onRemove={onRemove}
                      onModifyClick={onModifyClick}/>
          <CommentBox user={user}
                      spotId={spot._id}
                      nowLoading={nowCommentLoading}
                      comments={comments}
                      onAddComment={onAddComment}
                      onRemoveComment={onRemoveComment}/>
        </Modal.Body>
        <Modal.Footer>
          <Link to={`/spots/${spot._id}`}>자세히 보기</Link>
        </Modal.Footer>
      </Modal>
    );
  }
}
