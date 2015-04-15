import React from 'react'
import { Button, Input, Modal } from 'react-bootstrap'

export default class CommentModal extends React.Component {

  submit(event) {
    event.preventDefault()
    this.props.onSuccess(this.refs.comment.getValue())
    this.props.onRequestHide()
  }

  label() {
    return this.props.comment ? 'Create' : 'Update'
  }

  addCommentModal() {
    const submit = this.submit.bind(this)
    return (
      <Modal title="New Comment">
        <form onSubmit={ submit }>
          <div className="modal-body">
            <div className="form-group">
              <Input
                ref="comment"
                type="text"
                defaultValue={ this.props.comment || '' }
                label="Comment"
              />
            </div>
          </div>
          <div className="modal-footer">
            <Button type="submit" bsStyle="primary">{ this.label() }</Button>
            <Button onClick={ this.props.onRequestHide }>Cancel</Button>
          </div>
        </form>
      </Modal>
    )
  }

}
