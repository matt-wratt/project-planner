import React from 'react'
import { Button, Input, Modal } from 'react-bootstrap'
import ProjectActions from '../../actions/project'

export default class ProjectSettingsModal extends React.Component {

  submit(event) {
    event.preventDefault()
    const { project } = this.props
    project.sprintDuration = this.refs.sprintDuration.getValue()
    ProjectActions.updateProject(project)
    this.props.onRequestHide()
  }

  render() {
    const submit = this.submit.bind(this)
    const { name } = this.props.project
    return (
      <Modal title={ `${name} Settings` }>
        <form onSubmit={ submit }>
          <div className="modal-body">
            <Input
              ref="sprintDuration"
              type="select"
              defaultValue={ this.props.project.sprintDuration || '1 week' }
              label="Sprint Duration">
              <option value="1 week">1 Week</option>
              <option value="2 week">2 Week</option>
              <option value="3 week">3 Week</option>
              <option value="1 month">1 Month</option>
            </Input>
          </div>
          <div className="modal-footer">
            <Button type="submit" bsStyle="primary">Save</Button>
            <Button onClick={ this.props.onRequestHide }>Cancel</Button>
          </div>
        </form>
      </Modal>
    )
  }

}
