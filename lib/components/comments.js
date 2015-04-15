import React from 'react'
import { Button, Glyphicon, ModalTrigger } from 'react-bootstrap'
import Comment from './comment'
import ProjectActions from '../actions/project'

export default class Comments extends React.Component {

  addComment(event) {
    event.preventDefault()
    ProjectActions.newComment(this.props.story, this.refs.newComment.getDOMNode().value)
    this.refs.newComment.getDOMNode().value = ''
  }

  renderComment(comment) {
    return (
      <Comment comment={ comment } story={ this.props.story }/>
    )
  }

  render() {
    var { comments } = this.props.story
    comments = comments || []
    return (
      <div>
        { comments.map(this.renderComment.bind(this)) }
        <br />
        <form onSubmit={ this.addComment.bind(this) }>
          <textarea ref="newComment" style={{ width: '100%' }}></textarea>
          <Button type="submit" bsStyle="primary" className="pull-right">Add Comment</Button>
          <div className="clearfix" />
        </form>
      </div>
    )
  }

}
