import React from 'react'
import { Glyphicon, ModalTrigger } from 'react-bootstrap'
import ConfirmationModal from './modals/confirmation'
import Timestamp from './timestamp'
import ProjectActions from '../actions/project'

export default class Comment extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { story, comment } = this.props
    const remove = ProjectActions.removeComment.bind(ProjectActions, story, comment)
    return (
      <div>
        <div className="pull-right">
          <ModalTrigger modal={ <ConfirmationModal message="Are you sure you want to remove this comment?" onConfirmation={ remove } /> }>
            <Glyphicon glyph="remove" />
          </ModalTrigger>
        </div>
        <small>
          <Timestamp timestamp={ comment.timestamp } />
        </small>
        {' '}
        { this.props.comment.text }
      </div>
    )
  }

}
