import React, {PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';


import Comment from './Comment';

export default class CommentBox extends React.Component {
  static propTypes = {
    spotId: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    nowLoading: PropTypes.bool.isRequired,
    comments: PropTypes.array,
    onAddComment: PropTypes.func.isRequired,
    onRemoveComment: PropTypes.func.isRequired
  };

  createComment(commentText) {
    const {spotId, onAddComment} = this.props;
    onAddComment(spotId, commentText);
  }

  renderComments() {
    const {nowLoading, comments} = this.props;
    let commentsComponent = [];
    if(nowLoading){
      return null;
    }

    if (_.isArray(comments) && comments.length > 0) {
      comments.forEach((comment, i) => {
        commentsComponent.push(
          <Comment key={i} comment={comment}/>
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
    const {nowLoading, comments, user} = this.props;
    const {isLogin} = user;
    let commentsComponent = [];

    if (_.isArray(comments)) {
      comments.forEach((comment, i) => {
        commentsComponent.push(
          <Comment key={i} comment={comment}/>
        );
      });
    }
    let commentForm = null;
    if (isLogin) {
      commentForm = (
        <form onSubmit={this.handleCreateCommentSubmit}>
          <div className="col-xs-3">
            <span className="label label-info">
              <i className={`fa fa-${user.provider}`}/> {user.name}
            </span>
          </div>
          <div className="col-xs-8">
            <input id="comment"
                   type="text"
                   className="form-control"
                   autoComplete="off"
                   placeholder="이 장소에 대한 생각을 입력해주세요."/>
          </div>
          <div className="col-xs-1">
            <div className="pull-right btn-group-sm">
              <button type="submit" className="btn btn-primary btn-fab">
                <i className="fa fa-2x fa-comment" style={{marginLeft: -12}}/>
              </button>
            </div>
          </div>
        </form>
      );
    }

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="row">
            {commentForm}
          </div>
        </div>
        <div className="col-xs-12">
          {
            nowLoading &&
            <div className="text-center">
              <img src="/images/loading.svg" alt=""/>
            </div>
          }
          {this.renderComments()}
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
