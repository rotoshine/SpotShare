import React, {PropTypes} from 'react';
import _ from 'lodash';
import nl2br from 'react-nl2br';

import {ButtonGroup} from 'react-bootstrap';
import CommentBox from '../comments/CommentBox'
/**
 * SpotDetail component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 5.
 */
export default class SpotDetail extends React.Component {
  static propTypes = {
    spot: PropTypes.object.isRequired,
    isLogin: PropTypes.bool.isRequired,
    comments: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    onModifyClick: PropTypes.func.isRequired
  };

  state = {
    visibleRoadView: false,
    visibleImageIndex: -1
  };

  renderRoadView() {
    const {spot} = this.props;

    if (!_.isNil(spot)) {
      this.setState({
        visibleRoadView: true,
        visibleImageIndex: -1
      }, () => {
        const roadViewContainer = document.getElementById('road-view');
        const roadView = new daum.maps.Roadview(roadViewContainer);
        const roadViewClient = new daum.maps.RoadviewClient();

        const position = new daum.maps.LatLng(spot.geo[0], spot.geo[1]);

        roadViewClient.getNearestPanoId(position, 50, (panoId) => {
          roadView.setPanoId(panoId, position);
        });
      });
    }
  }

  renderMediaContentThumbnails() {
    const {visibleRoadView, visibleImageIndex} = this.state;
    let imageMediaContents = [];
    const {spot} = this.props;
    const {files} = spot;

    if(_.isArray(files)){
      files.forEach((file, index) => {
        const url = `/api/spots/${spot._id}/files/${file._id}`;
        let thumbnailStyle = {
          backgroundImage: `url('${url}')`
        };

        // 별도의 class style로 빼자
        if(index === visibleImageIndex){
          thumbnailStyle.border = '1px solid #000000';
          thumbnailStyle.backgroundColor = 'rgba(0,0,0, 0.3)';
        }
        imageMediaContents.push(
          <li key={index}>
            <div className="spot-detail-media-thumbnail bg-center"
                 style={thumbnailStyle}
                 onClick={this.handleShowImage.bind(this, index)}
                 onMouseOver={this.handleShowImage.bind(this, index)}/>
          </li>
        )
      });
    }

    let roadViewBorderStyle = {};

    if(visibleRoadView){
      roadViewBorderStyle.border = '1px solid #000000';
      roadViewBorderStyle.backgroundColor = 'rgba(0,0,0,0.3)';
    }
    return (
      <ul className="list-inline">
        {imageMediaContents}
        <li onClick={this.renderRoadView.bind(this)}
            onMouseOver={this.renderRoadView.bind(this)}>
          <div style={{roadViewBorderStyle}} className="spot-detail-media-thumbnail">
            로드뷰 보기
          </div>
        </li>
      </ul>
    )
  }

  render() {
    const {visibleRoadView, visibleImageIndex} = this.state;

    const {
      spot,
      onRemove, onModifyClick
    } = this.props;
    const {createdBy} = spot;

    let style = {
      width: '100%',
      height: '100%',
      display: visibleRoadView ? 'none' : 'block'
    };

    if(!visibleRoadView && visibleImageIndex > -1){
      const file = spot.files[visibleImageIndex];
      let fileId = null;
      if(_.isObject(file) && file.hasOwnProperty('_id')){
        fileId = file._id;
      }else if(_.isNumber(fileId)){
        fileId = file;
      }

      if(_.isNumber(fileId)){
        style.backgroundImage = `url('/api/spots/${spot._id}/files/${fileId}')`;
      }
    }


    return (
      <div className="spot-detail">
        <div className="row">
          <div className="spot-detail-contents-container">
            <div className="spot-detail-contents">
              <div><strong>{spot.address}</strong>에 위치</div>
              <div className="spot-detail-description">{nl2br(spot.description)}</div>
            </div>
            <div className="spot-detail-media">
              <div id="image-media" className="bg-center" style={style}/>
              <div id="road-view"
                   className="road-view"
                   style={{display: this.state.visibleRoadView ? 'block' : 'none'}}/>
            </div>
          </div>
        </div>
        <hr/>
        {this.renderMediaContentThumbnails()}
        <hr/>
        <div className="row">
          <div className="col-xs-12">
            <div className="pull-left">
              <button className="btn btn-primary btn-raised btn-sm"
                      onClick={() => {
                        alert('따봉기능 커밍쑨');
                      }}>
                <i className="fa fa-thumbs-up "/> {spot.likeCount}</button>
              명이 추천합니다.
            </div>
            <div className="pull-right">
                <span className="label label-info"><i
                  className={`fa fa-${createdBy.provider}`}/> {createdBy.name}</span>
              <span>님이 공유</span>
              <ButtonGroup>
                <button className="btn btn-info btn-sm btn-raised " onClick={() => {
                  alert('구현예정');
                }}><i className="fa fa-share-alt"/></button>
                <button className="btn btn-default btn-sm btn-raised" onClick={onModifyClick.bind(this, spot)}><i
                  className="fa fa-edit"/></button>
                <button className="btn btn-danger btn-sm btn-raised" onClick={onRemove.bind(this, spot)}><i
                  className="fa fa-remove"/></button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleShowImage = (index) => {
    this.setState({
      visibleRoadView: false,
      visibleImageIndex: index
    });
  }
}
