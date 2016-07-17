import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import $ from 'jquery';
import _ from 'lodash';
import Immutable from 'immutable';
import Comment from './Comment';

export default class CommentBox extends React.Component {
  static propTypes = {
    spotId: PropTypes.string,
    comments: PropTypes.array,
    onCreateComment: PropTypes.func
  };

  componentDidMount() {
    this.fetchComments();
  }

  fetchComments() {
    this.setState({
      nowLoading: true
    }, () => {
      $.get(`/api/spots/${this.props.spotId}/comments`)
        .done(result => {
          this.setState({
            nowLoading: false,
            comments: Immutable.List.of(result.comments)
          });
        });
    });
  }

  createComment(comment) {
    const data = {
      spot: this.props.spotId,
      comment: comment
    };

    return $.ajax({
      url: `/api/spots/${this.props.spotId}/comments`,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json'
    }).done(() => {
      this.fetchComments();
    });
  }

  render() {
    const {comments} = this.props;
    let commentsComponent = [];
    if (comments.length > 0) {
      comments.forEach(comment, i => {
        commentsComponent.push(
          <Comment comment={comment} key={i}/>
        );
      });
    }else{
      commentsComponent.push(
        <div key="empty">댓글이 없습니다.</div>
      );
    }

    return (
      <div>
        <div className="col-xs-1">
          <Button>
            <i className="fa fa-heart"/>
          </Button>
        </div>
        <div className="col-xs-10">
          <input id="comment" type="text" className="form-control" placeholder="이 장소에 대한 생각을 입력해주세요."/>
        </div>
        <div className="col-xs-1">
          <Button bsStyle="primary" onClick={this.handleCreateCommentClick}><i className="fa fa-comment"/> </Button>
        </div>
        {commentsComponent}
      </div>
    )
  }


  handleCreateCommentClick = (e) => {
    e.preventDefault();
    const $comment = $('#comment');
    const value = $comment.val();

    if(value !== ''){
      this.createComment(value);
      $comment.val('');
    }
  };
}
