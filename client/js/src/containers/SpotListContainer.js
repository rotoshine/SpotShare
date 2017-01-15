import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';
import * as SpotsActionCreators from '../actions/SpotsActionCreators';

import {Panel, ButtonGroup, Button, Pagination} from 'react-bootstrap';
import Loading from '../components/commons/Loading';
/**
 * SpotListContainer component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2016. 12. 30.
 */
class SpotListContainer extends React.Component {
  static propTypes = {
    nowLoading: PropTypes.bool.isRequired,
    spots: PropTypes.array,
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

  renderSpotList() {
    let components = [];
    const {spots} = this.props;
    const defaultImageUrl = '/images/food_tool.svg';
    if (_.isArray(spots)) {
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

        components.push(
          <li key={i}>
            <Link to={`/spots/${spot._id}`}>
              <div className="spot-item" style={{border: '1px solid #ccc', marginBottom: 10}}>
                <div className="spot-photo" style={spotPhotoStyle}/>
                <div className="spot-description" style={{paddingTop: 15}}>
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
    }


    return components;
  }

  renderPaging() {
    return (
      <Pagination items={10} activePage={1} onSelect={() => {
      }}/>
    );
  }

  render() {
    const {nowLoading} = this.props;
    if(nowLoading){
      return (
        <div className="text-center" style={{marginTop:20}}>
          <Loading visible={true} />
        </div>
      );
    }
    return (
      <div className="container" style={{paddingTop: 20}}>
        <Panel>
          정렬
          <ButtonGroup>
            <Button className="btn-raised"><i className="fa fa-sort-desc"/>등록일순</Button>
          </ButtonGroup>
        </Panel>
        <Panel>
          <ul className="list-unstyled spot-list" style={{overflowY: 'auto'}}>
            {this.renderSpotList()}
            <div className="text-center">
              {this.renderPaging()}
            </div>
          </ul>
        </Panel>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    nowLoading: state.spots.nowLoading,
    spots: state.spots.spots
  };
})(SpotListContainer);
