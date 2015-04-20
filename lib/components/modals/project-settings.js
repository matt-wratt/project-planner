import React from 'react'
import { Button, Glyphicon, Input, Modal, ModalTrigger } from 'react-bootstrap'
import ConfirmationModal from './confirmation'
import ProjectActions from '../../actions/project'

export default class ProjectSettingsModal extends React.Component {

  submit(event) {
    event.preventDefault()
    const { project } = this.props
    project.sprintDuration = this.refs.sprintDuration.getValue()
    project.start = this.refs.start.getValue()
    ProjectActions.updateProject(project)
    const newName = this.refs.name.getValue()
    if (newName !== project.name) {
      ProjectActions.renameProject(project, newName)
    }
    this.props.onRequestHide()
  }

  renderExportCsvButton() {
    const { id, name, sprintDuration } = this.props.project
    const date = new Date().toISOString().replace(/T.*$/, '')
    const filename = `${id}-${date}.csv` 
    const csv = new CSVBuilder()
    csv.addRow('id', 'type', 'name', 'duration', 'history')
    csv.addRow(id, 'project', name, sprintDuration, null)
    this.props.stories.forEach(story => {
      csv.addRow(story.id, story.type, story.title, null, JSON.stringify(story.history))
    })
    return (
      <a className="btn btn-success btn-block" download={ filename } href={ csv.dataUrl() }>
        <Glyphicon glyph="export"/>
        {' '}Export{' '}
        <Glyphicon glyph="export"/>
      </a>
    )
  }

  renderDestroyButton() {
    const destroy = ProjectActions.removeProject.bind(ProjectActions, this.props.project)
    const destroyConfirmation = <ConfirmationModal message="Are you sure you want to completely remove this project?" onConfirmation={ destroy } />
    return (
      <ModalTrigger modal={ destroyConfirmation }>
        <Button bsStyle="danger" block>
          <Glyphicon glyph="exclamation-sign"/>
          {' '}Destroy{' '}
          <Glyphicon glyph="exclamation-sign"/>
        </Button>
      </ModalTrigger>
    )
  }

  render() {
    const submit = this.submit.bind(this)
    const oneDay = 1000 * 60 * 60 * 24
    const oneWeek = 7 * oneDay
    const { onRequestHide, project: { name, start, sprintDuration }} = this.props
    return (
      <Modal title={ `${name} Settings` }>
        <form onSubmit={ submit }>
          <div className="modal-body">
            <div className="row" style={{ 'margin-top': '5px' }}>
              <Input
                ref="name"
                type="text"
                defaultValue={ name }
                label="Project Name"
                labelClassName="col-xs-6"
                wrapperClassName="col-xs-6"
                />
            </div>
            <div className="row" style={{ 'margin-top': '5px' }}>
              <Input
                ref="start"
                type="date"
                defaultValue={ start || new Date().toISOString().replace(/T.*$/, '') }
                label="Start Date"
                labelClassName="col-xs-6"
                wrapperClassName="col-xs-6"
                />
            </div>
            <div className="row" style={{ 'margin-top': '5px' }}>
              <Input
                ref="sprintDuration"
                type="select"
                defaultValue={ sprintDuration || '1 week' }
                label="Sprint Duration"
                labelClassName="col-xs-6"
                wrapperClassName="col-xs-6"
                >
                <option value={ oneDay }>1 Day</option>
                <option value={ 3 * oneDay }>3 Days</option>
                <option value={ oneWeek }>1 Week</option>
                <option value={ 2 * oneWeek }>2 Weeks</option>
                <option value={ 3 * oneWeek }>3 Weeks</option>
              </Input>
            </div>
            <hr />
            <div className="row" style={{ 'margin-top': '5px' }}>
              <div className="col-xs-6">
                <label>Export project stories to csv</label>
              </div>
              <div className="col-xs-6">
                { this.renderExportCsvButton() }
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-xs-6">
                <label>Remove this project</label>
              </div>
              <div className="col-xs-6">
                { this.renderDestroyButton() }
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <Button type="submit" bsStyle="primary">Save</Button>
            <Button onClick={ onRequestHide }>Cancel</Button>
          </div>
        </form>
      </Modal>
    )
  }

}

class CSVBuilder {
  constructor() {
    this.rows = []
  }

  addRow(...columns) {
    this.rows.push(columns)
  }

  dataUrl() {
    var data = this.rows.map(row => row.map(csvValue).join(',')).join("\r\n")
    data = new Blob([data])
    return URL.createObjectURL(data)
  }
}

function csvValue(value) {
  if (typeof value === 'number') {
    return value.toString()
  } else {
    return `"${(value || '').replace(/"/, '""')}"`
  }
}
