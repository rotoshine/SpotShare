import React, {PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

import {Button} from 'react-bootstrap';

import Comment from './Comment';

export default class CommentBox extends React.Component {
  static propTypes = {
    spotId: PropTypes.number,
    isLogin: PropTypes.bool.isRequired,
    comments: PropTypes.array,
    onAddComment: PropTypes.func.isRequired,
    onRemoveComment: PropTypes.func.isRequired
  };

  createComment(commentText) {
    const {spotId, onAddComment} = this.props;
    onAddComment(spotId, commentText);
  }

  renderComments() {
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
        <div key="empty" className="text-center">아직 이 장소에 대한 댓글이 없습니다.</div>
      );
    }

    return commentsComponent;
  }
  render() {
    const {comments, isLogin} = this.props;
    let commentsComponent = [];
    if (_.isArray(comments) && comments.length > 0) {
      comments.forEach((comment, i) => {
        commentsComponent.push(
          <Comment key={i} comment={comment} />
        );
      });
    } else {
      commentsComponent.push(
        <div key="empty" className="text-center">아직 이 장소에 대한 댓글이 없습니다.</div>
      );
    }

    let commentForm = null;
    if(isLogin){
      commentForm = (
        <form onSubmit={this.handleCreateCommentSubmit}>
          <div className="col-xs-11">
            <input id="comment"
                   type="text"
                   className="form-control"
                   placeholder="이 장소에 대한 생각을 입력해주세요." />
          </div>
          <div className="col-xs-1">
            <div className="pull-right btn-group-sm">
              <button type="submit" className="btn btn-primary btn-fab">
                <i className="fa fa-2x fa-comment" style={{marginLeft:-12}}/>
              </button>
            </div>
          </div>
        </form>
      );
    }

    return (
      <div className="row">
        <div className="col-xs-12">
          {commentForm}
        </div>
        <div className="col-xs-12">
          <div style={{paddingLeft: 20}}>
            {this.renderComments()}
          </div>
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
}
