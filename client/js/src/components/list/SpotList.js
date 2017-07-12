import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Link} from 'react-router-dom';

import {Panel, Row, Col, Pagination} from 'react-bootstrap';

import Loading from '../commons/Loading';
/**
 * SpotList component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 2.
 */
export default class SpotList extends React.Component {
  static propTypes = {
    nowLoading: PropTypes.bool.isRequired,
    spots: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
    onPageClick: PropTypes.func.isRequired
  };

  renderSearchResult() {
    const {spots, totalCount, query} = this.props;
    const hasSearchKeyword = _.isObject(query) && _.isString(query.spotName) && query.spotName.length > 0;
    const hasSearchResult = _.isArray(spots) && spots.length > 0;
    if (hasSearchKeyword && hasSearchResult) {
      return (
        <Row>
          <Col xs={12}>
            <strong>{query.spotName}</strong>의 검색결과가
            <span className="badge badge-info">{totalCount}</span> 개 있습니다.
          </Col>
        </Row>
      );
    }

    return null;
  }

  renderSpotList() {
    let components = [];
    const {spots} = this.props;
    // config 에서 하는 걸로 바꾸자
    const defaultImageUrl = '/images/food_tool.svg';
    if (_.isArray(spots) && spots.length > 0) {
      spots.forEach((spot, i) => {
        let imageUrl = defaultImageUrl;

        if (_.isArray(spot.files) && spot.files.length > 0) {
          imageUrl = `/api/spots/${spot._id}/files/${spot.files[0]._id}`
        }
        let spotPhotoStyle = {
          width: 200,
          height: 200,
          backgroundImage: `url('${imageUrl}')`
        };

        let spotDescriptionStype = {
          borderTop: '1px solid #ccc',
          borderRight: '1px solid #ccc',
          borderBottom: '1px solid #ccc',
          paddingTop: 15
        };
        components.push(
          <li key={i}>
            <Link to={`/spots/${spot._id}`}>
              <div className="spot-item" style={{marginBottom: 10}}>
                <div className="spot-photo" style={spotPhotoStyle}/>
                <div className="spot-description"
                     style={spotDescriptionStype}>
                  <h3 className="spot-name" style={{fontSize: '1.5em'}}>
                    {spot.spotName}
                  </h3>
                  <div className="spot-hashtags">
                    #테스트
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      });
    } else {
      components.push(
        <li key="no-result">
          공유된 스팟이 없습니다.
        </li>
      );
    }

    return components;
  }

  render() {
    let pageCount = 1;
    const {nowLoading, totalCount, page, limit} = this.props;

    if(totalCount > 0){
      pageCount = Math.ceil(totalCount / limit);
    }

    let nowLoadingComponent = nowLoading ? (
        <div className="text-center" style={{marginTop: 20}}>
          <Loading visible={nowLoading}/>
        </div>
      ) : null;
    return (
      <Panel>
        {nowLoadingComponent}
        {this.renderSearchResult()}
        <Row>
          <ul className="list-unstyled spot-list" style={{overflowY: 'auto'}}>
            {this.renderSpotList()}
            <div className="text-center">
              <Pagination items={pageCount} activePage={page} onSelect={this.props.onPageClick}/>
            </div>
          </ul>
        </Row>
      </Panel>
    );
  }
}
