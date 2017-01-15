import React, {PropTypes} from 'react';

import {Modal} from 'react-bootstrap';

import SpotForm from '../form/SpotForm';

export default class SpotFormModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    spotForm: PropTypes.object.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    onFormUpdate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  render() {
    const {visible, onClose} = this.props;

    return (
      <Modal bsSize="large" show={visible} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>스팟 등록하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SpotForm {...this.props}/>
        </Modal.Body>
      </Modal>
    );
  }
}
