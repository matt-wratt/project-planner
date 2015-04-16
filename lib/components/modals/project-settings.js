import React from 'react'
import { Button, Glyphicon, Input, Modal, ModalTrigger } from 'react-bootstrap'
import ConfirmationModal from './confirmation'
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
    const project = this.props.project
    const { name } = project
    const destroy = ProjectActions.removeProject.bind(ProjectActions, project)
    const destroyConfirmation = <ConfirmationModal message="Are you sure you want to completely remove this project?" onConfirmation={ destroy } />
    return (
      <Modal title={ `${name} Settings` }>
        <form onSubmit={ submit }>
          <div className="modal-body">
            <div className="row">
              <Input
                ref="sprintDuration"
                type="select"
                defaultValue={ this.props.project.sprintDuration || '1 week' }
                label="Sprint Duration"
                labelClassName="col-xs-6"
                wrapperClassName="col-xs-6"
                >
                <option value="1 week">1 Week</option>
                <option value="2 week">2 Week</option>
                <option value="3 week">3 Week</option>
                <option value="1 month">1 Month</option>
              </Input>
            </div>
            <div className="row" style={{ 'margin-top': '5px' }}>
              <div className="col-xs-6">
                <label>Remove this project</label>
              </div>
              <div className="col-xs-6">
                <ModalTrigger modal={ destroyConfirmation }>
                  <Button bsStyle="danger" block>
                    <Glyphicon glyph="warning-sign"/>
                    {' '}Destroy{' '}
                    <Glyphicon glyph="warning-sign"/>
                  </Button>
                </ModalTrigger>
              </div>
            </div>
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
