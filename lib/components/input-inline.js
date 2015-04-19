import React from 'react'
import { Input } from 'react-bootstrap'

export default class InputInline extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editing: this.props.editing || false,
      value: this.props.value || this.props.defaultValue
    }
    this.submit = this.submit.bind(this)
    this.toggleState = this.toggleState.bind(this)
    this.handleEscape = this.handleEscape.bind(this)
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value || props.defaultValue
    })
  }

  input() {
    return this.refs.input.getDOMNode().querySelector('input')
  }

  handleEscape(event) {
    if (event.which === 27) {
      this.toggleState()
    }
  }

  submit(event) {
    event.preventDefault()
    const { value } = this.input()
    this.setState({ value: value })
    if (this.props.onChange) {
      this.props.onChange(value)
    }
    this.toggleState()
  }

  toggleState() {
    this.setState({ editing: !this.state.editing })
    setTimeout(() => {
      if (this.state.editing) {
        this.input().select()
      }
    }, 0)
  }

  renderEditing() {
    const props = select(this.props, 'type', 'style', 'addonBefore', 'addonAfter')
    return (
      <form onSubmit={ this.submit } className="form-inline" style={{ display: 'inline' }}>
        <Input ref="input" defaultValue={ this.state.value } { ...props } onKeyDown={ this.handleEscape } />
      </form>
    )
  }

  renderValue() {
    return (
      <span onDoubleClick={ this.toggleState } { ...this.props }>
        { this.props.addonBefore ? this.props.addonBefore : null }
        { this.state.value }
        { this.props.addonAfter ? this.props.addonAfter : null }
      </span>
    )
  }

  render() {
    return this.state.editing ? this.renderEditing() : this.renderValue()
  }

}

function select(props, ...keys) {
  return keys.reduce((selected, key) => {
    selected[key] = props[key]
    return selected
  }, {})
}
