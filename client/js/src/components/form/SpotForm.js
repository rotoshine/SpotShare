import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Form, FormGroup, Col, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Dropzone from 'react-dropzone';

/**
 * SpotForm component.
 * @author 로토(rotoshine@coupang.com)
 * @since 2017. 1. 15.
 */
export default class SpotForm extends React.Component {
  static propTypes = {
    spotForm: PropTypes.object.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    onFormUpdate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  isValidForm() {
    const ERROR_CLASS_NAME = 'has-error';
    const {spotForm} = this.props;
    const validationFields = ['spotName'];

    let isValid = true;
    validationFields.forEach((field) => {
      const value = spotForm[field];
      const $formGroup = $(`label[for=${field}]`).parents('.form-group');

      if (_.isEmpty(value)) {
        $formGroup.addClass(ERROR_CLASS_NAME);
        isValid = false;
      } else {
        $formGroup.removeClass(ERROR_CLASS_NAME);
      }
    });

    return isValid;
  }

  renderUploadFile() {
    const {spotForm} = this.props;
    const {files} = spotForm;

    let uploadedFiles = [];

    files.forEach((spotFile, i) => {
      let fileUrl = `/api/files/upload/temp/${spotFile.filename}`;

      if (spotFile.hasOwnProperty('_id')) {
        fileUrl = `/api/files/${spotFile._id}`;
      }
      uploadedFiles.push(
        <li key={i}
            className="upload-file bg-center"
            style={{backgroundImage: `url('${fileUrl}')`}}/>
      );
    });

    return (
      <ul className="list-unstyled upload-file-list">
        {uploadedFiles}
        <li key="upload-trigger" className="upload-file upload-button">
          <button className="button-unstyled" onClick={this.handleUploadButtonClick}>
            <div style={{paddingTop: 23}}>
              <i className="fa fa-2x fa-plus" style={{marginRight: 7}}/>
              <i className="fa fa-3x fa-image"/>
            </div>
          </button>
        </li>
      </ul>
    )

  }

  render() {
    const {spotForm, onFormUpdate} = this.props;
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormGroup controlId="spotName">
          <Col componentClass={ControlLabel} xs={3} sm={2}>
            스팟 이름
          </Col>
          <Col xs={9} sm={10}>
            <FormControl type="text"
                         placeholder="스팟의 이름을 입력해주세요."
                         value={spotForm.spotName}
                         onChange={(e) => {
                           onFormUpdate('spotName', e.target.value);
                         }}/>
          </Col>
        </FormGroup>
        <FormGroup controlId="description">
          <Col componentClass={ControlLabel} xs={3} sm={2}>
            스팟 설명
          </Col>
          <Col xs={9} sm={10}>
            <FormControl componentClass="textarea"
                         rows="10"
                         value={spotForm.description}
                         onChange={(e) => {
                           onFormUpdate('description', e.target.value);
                         }}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <label htmlFor="address" className="col-sm-2 col-xs-3 control-label">
            주소
          </label>
          <Col sm={10} xs={9}>
            <input id="address"
                   type="text"
                   value={spotForm.address}
                   className="form-control"
                   readOnly/>
          </Col>
        </FormGroup>
        <Dropzone ref={(dropzone) => {this.dropzone = dropzone;}}
                  id="dropzone"
                  disableClick={true}
                  className="file-dropzone"
                  accept="image/*"
                  onDrop={this.handleFileUpload}>
          <Col xs={12}>
            <div className="alert alert-info">파일을 이곳에 drag&drap 하거나 + 버튼을 눌러서 이미지를 업로드 할 수 있어요.</div>
            {this.renderUploadFile()}
          </Col>
        </Dropzone>
        <FormGroup>
          <Button bsStyle="primary" type="submit" style={{width: '100%'}} className="btn-raised">
            <i className="fa fa-save"/> {spotForm._id ? '수정' : '등록'}
          </Button>
        </FormGroup>
      </Form>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.isValidForm()) {
      this.props.onSubmit();
    }
  };

  handleUploadButtonClick = (e) => {
    e.preventDefault();
    this.dropzone.open();
  };

  handleFileUpload = (acceptedFiles) => {
    this.props.onFileUpload(this.props.spotForm._id, acceptedFiles);
  };
}
