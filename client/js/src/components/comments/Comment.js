import React, {PropTypes} from 'react';
import moment from 'moment';

export default class Comment extends React.Component {
  static propTypes = {
    comment: PropTypes.object
  };

  render() {
    moment.locale('ko');
    const {comment} = this.props;

    return (
      <div className="row">
        <div className="col-xs-3">
          <span className="label label-info">
            {comment.createdBy.name}
          </span>
        </div>
        <div className="col-xs-6">
          {comment.content}
        </div>
        <div className="col-xs-3">
          {moment(comment.createdAt).fromNow()}
        </div>
      </div>
    )
  }
}
