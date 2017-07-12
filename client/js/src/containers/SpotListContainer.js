import React, {PropTypes} from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
import _ from 'lodash';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as SpotsActionCreators from '../actions/SpotsActionCreators';

import SearchPanel from '../components/search/SearchPanel';
import SpotList from '../components/list/SpotList';

/**
 * SpotListContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2016. 12. 30.
 */
class SpotListContainer extends React.Component {
  static propTypes = {
    nowLoading: PropTypes.bool.isRequired,
    totalCount: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    spots: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const {dispatch} = props;
    this.spotsAction = bindActionCreators(SpotsActionCreators, dispatch);
  }

  componentDidMount() {
    if (_.isNil(this.props.spots)) {
      this.spotsAction.fetchSpots();
    }
  }

  updateUrl(url){
    const {router} = this.props;
    router.push(url);
  }
  render() {
    const {query} = this.props;

    let keyword = '';
    if(_.isObject(query) && _.isString(query.spotName)){
      keyword = query.spotName;
    }
    return (
      <div className="container" style={{paddingTop: 20}}>
        <SearchPanel keyword={keyword} onSearch={this.handleSearch}/>
        <SpotList {...this.props} onPageClick={this.handlePageClick}/>
      </div>
    );
  }

  handleSearch = (keyword) => {
    this.updateUrl(`/spots?spotName=${keyword}`);
    this.spotsAction.fetchSpots({
      spotName: keyword
    });
  };

  handlePageClick = (page) => {
    const {query} = this.props;
    let nextQueryString = [
      `page=${page}`
    ];

    if(query && query.spotName && query.spotName.length > 0){
      nextQueryString.push(`spotName=${query.spotName}`);
    }
    this.updateUrl(`/spots?${nextQueryString.join('&')}`);
    this.spotsAction.fetchSpots(this.props.query, page);
    $(window).animate({
      scrollTop: 0
    }, 300);
  };
}

export default withRouter(connect((state) => {
  return {
    nowLoading: state.spots.nowLoading,
    spots: state.spots.spots,
    totalCount: state.spots.totalCount,
    page: state.spots.page,
    limit: state.spots.limit,
    query: state.spots.query
  };
})(SpotListContainer));
