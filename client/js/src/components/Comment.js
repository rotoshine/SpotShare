import React, {PropTypes} from 'react';

export default class Comment extends React.Component {
  static propTypes = {
    comment: PropTypes.object
  };

  render() {
    const {comment} = this.props;

    return (
      <div>
        <div className="col-xs-2">
          {comment.createBy.name}
        </div>
        <div className="col-xs-10">
          {comment.comment}
        </div>
      </div>
    )
  }
}
