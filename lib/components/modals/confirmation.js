import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default class ConfirmationModal extends React.Component {

  confirm(event) {
    this.props.onRequestHide()
    this.props.onConfirmation()
  }

  render() {
    return (
      <Modal { ...this.props } title="Confirmation">
        <div className="modal-body">
          { this.props.message }
        </div>
        <div className="modal-footer">
          <Button onClick={ this.confirm.bind(this) } bsStyle="primary">Confirm!</Button>
          <Button onClick={ this.props.onRequestHide }>Cancel</Button>
        </div>
      </Modal>
    )
  }

}
