import React from 'react'
import { Button, Input, Modal } from 'react-bootstrap'

export default class StoryModal extends React.Component {

  componentDidMount() {
    this.refs.title.getDOMNode().querySelector('input').focus()
  }

  submit(event) {
    event.preventDefault()
    const story = this.props.story
    story.title = this.refs.title.getValue()
    this.props.onSuccess(this.props.story)
    this.props.onRequestHide()
  }

  label() {
    return this.props.story.title ? 'Update' : 'Create'
  }

  render() {
    return (
      <Modal { ...this.props } title="Story">
        <form onSubmit={ this.submit.bind(this) }>
          <div className="modal-body">
            <div className="form-group">
              <Input
                ref="title"
                type="text"
                defaultValue={ this.props.story.title || '' }
                placeholder="As a persona I can do something so that good things happen"
                label="Description"
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
