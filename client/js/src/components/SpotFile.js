import React, {PropTypes} from 'react';

/**
 * SpotFile component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 2.
 */
export default class SpotFile extends React.Component {
  static propTypes = {
    spotId: PropTypes.number,
    spotFileId: PropTypes.number,
    uploadedFileName: ProTypes.string
  };

  render() {
    let url = `url('/api/files/upload/temp/')`;
    return (
      <div>

      </div>
    );
  }
}
