import React from 'react'
import { Button, DropdownButton, Input, MenuItem, Modal } from 'react-bootstrap'
import typeStyle from '../../story-type-colors'

export default class StoryModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = { type: 'story' }
  }

  componentDidMount() {
    this.refs.title.getDOMNode().querySelector('input').focus()
    this.setState({ type: this.props.story.type || 'story' })
  }

  componentDidReceiveProps(props) {
    this.setState({ type: props.story.type || 'story' })
  }

  submit(event) {
    event.preventDefault()
    const story = this.props.story
    story.title = this.refs.title.getValue()
    story.type = this.state.type
    this.props.onSuccess(this.props.story)
    this.props.onRequestHide()
  }

  label() {
    return this.props.story.title ? 'Update' : 'Create'
  }

  renderTypeSelection() {
    const types = ['story', 'bug', 'task']
    const type = this.state.type
    const active = value => value === type ? 'active' : ''
    const select = value => this.setState({ type: value })
    return (
      <DropdownButton title={ type } bsStyle={ typeStyle(type) } onSelect={ select }>
        { types.map(value => <MenuItem eventKey={ value } className={ active(value) }>{ value }</MenuItem>) }
      </DropdownButton>
    )
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
                buttonBefore={ this.renderTypeSelection() }
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
