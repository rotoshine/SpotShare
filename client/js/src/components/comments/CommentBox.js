import React, {PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

import {Button} from 'react-bootstrap';

import Comment from './Comment';

export default class CommentBox extends React.Component {
  static propTypes = {
    spotId: PropTypes.string,
    comments: PropTypes.array,
    onAddComment: PropTypes.func.isRequired,
    onRemoveComment: PropTypes.func.isRequired
  };

  createComment(commentText) {
    const {spotId, onAddComment} = this.props;
    onAddComment(spotId, commentText);
  }

  render() {
    const {comments} = this.props;
    let commentsComponent = [];
    if (_.isArray(comments) && comments.length > 0) {
      comments.forEach((comment, i) => {
        commentsComponent.push(
          <Comment key={i} comment={comment} />
        );
      });
    } else {
      commentsComponent.push(
        <div key="empty">댓글이 없습니다.</div>
      );
    }

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="col-xs-2">
            <div className="btn-group-sm">
              <button className="btn btn-info btn-fab" onClick={this.handleLike}>
                <i className="material-icons">
                  star
                </i>
              </button>
            </div>
          </div>
          <form onSubmit={this.handleCreateCommentSubmit}>
            <div className="col-xs-8">
              <input id="comment"
                     type="text"
                     className="form-control"
                     placeholder="이 장소에 대한 생각을 입력해주세요." />
            </div>
            <div className="col-xs-2">
              <div className="pull-right btn-group-sm">
                <button type="submit" className="btn btn-primary btn-fab">
                  <i className="material-icons">
                    comment
                  </i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-xs-10 col-xs-offset-2">
          {commentsComponent}
        </div>
      </div>
    )
  }


  handleCreateCommentSubmit = (e) => {
    e.preventDefault();
    const $comment = $('#comment');
    const value = $comment.val();

    if (value !== '') {
      this.createComment(value);
      $comment.val('');
    }
  };

  handleLike = (e) => {
    e.preventDefault();
  };
}
