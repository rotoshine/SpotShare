import React, {PropTypes} from 'react';

import {Row, Panel, FormGroup, FormControl, ButtonGroup, Button} from 'react-bootstrap';
/**
 * SeachPanel component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 17.
 */
export default class SearchPanel extends React.Component {
  static propTypes = {
    keyword: PropTypes.string,
    onSearch: PropTypes.func.isRequired
  };

  state = {
    keyword: this.props.keyword,
    showFilterAndOrder: false
  };

  render() {
    const {keyword, showFilterAndOrder} = this.state;

    return (
      <Panel>
        <Row>
          <form onSubmit={this.handleSubmit}>
            <div className="col-xs-10">
              <FormGroup>
                <FormControl type="text" placeholder="검색어를 입력하세요." value={keyword} onChange={this.handleChange}/>
              </FormGroup>
            </div>
            <div className="col-xs-2">
              <Button type="submit" className="btn-raised" bsStyle="info" style={{height:50}}>
                <i className="fa fa-search"/>
              </Button>
              <Button type="button"
                      style={{height:50}}
                      bsSize="small"
                      className={`btn-raised ${showFilterAndOrder && 'active'}`}
                      onClick={this.handleFilterAndOrderVisible}>
                <i className="fa fa-filter"/>
              </Button>
            </div>
          </form>
        </Row>
        <ButtonGroup style={{display: showFilterAndOrder ? 'block' : 'none'}}>
          <Button className="btn-raised"><i className="fa fa-sort-desc"/>등록일순</Button>
        </ButtonGroup>
      </Panel>
    );
  }

  handleFilterAndOrderVisible = () => {
    this.setState({
      showFilterAndOrder: !this.state.showFilterAndOrder
    });
  };

  handleChange = (e) => {
    this.setState({
      keyword: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if(this.state.keyword.length > 1){
      this.props.onSearch(this.state.keyword);
    }else{
      alert('검색어는 2글자 이상 입력해주십시오.');
    }
  }
}
