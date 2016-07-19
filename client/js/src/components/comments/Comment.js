import React, {PropTypes} from 'react';

export default class Comment extends React.Component {
  static propTypes = {
    comment: PropTypes.object
  };

  render() {
    const {comment} = this.props;

    return (
      <div className="row">
        <div className="col-xs-4">
          <span className="label label-info">
            {comment.createdBy.name}
          </span>
        </div>
        <div className="col-xs-8">
          {comment.content}
        </div>
      </div>
    )
  }
}
