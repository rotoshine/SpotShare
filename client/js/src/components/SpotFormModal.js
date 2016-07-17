import React, {PropTypes} from 'react';

import {Modal, Col, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

export default class SpotFormModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    spotForm: PropTypes.object.isRequired,
    onFormUpdate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  render () {
    const {spotForm, visible, onClose, onFormUpdate, onSubmit} = this.props;

    return (
      <Modal show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>스팟 등록하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal onSubmit={onSubmit}>
            <FormGroup controlId="spotName">
              <Col componentClass={ControlLabel} xs={6} sm={2}>
                스팟 이름
              </Col>
              <Col xs={6} sm={10}>
                <FormControl type="text"
                             placeholder="스팟의 이름을 입력해주세요."
                             value={spotForm.spotName}
                             onChange={(e) => {
                                onFormUpdate('spotName', e.target.value);
                             }}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="description">
              <Col componentClass={ControlLabel} xs={6} sm={2}>
                스팟 설명
              </Col>
              <Col xs={6} sm={10}>
                <FormControl componentClass="textarea"
                             value={spotForm.description}
                             onChange={(e) => {
                                onFormUpdate('description', e.target.value);
                             }}/>
              </Col>
            </FormGroup>
            <div className="form-group">
              <label htmlFor="address" className="col-sm-2 col-xs-6 control-label">
                주소
              </label>
              <Col sm={10}>
                <input id="address"
                       type="text"
                       value={spotForm.address}
                       className="form-control"
                       readOnly/>
              </Col>
            </div>

            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button bsStyle="primary" type="submit">
                  등록하기
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
