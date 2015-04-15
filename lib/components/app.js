import React from 'react'
import { Button, ButtonGroup, Glyphicon, Input } from 'react-bootstrap'
import ProjectActions from '../actions/project'
import ProjectStore from '../stores/projects'
import ProjectDetail from './project-detail'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = ProjectStore.getInitialState()
    ProjectStore.listen(this.update.bind(this), this.update.bind(this))
  }

  newProject(event) {
    event.preventDefault()
    ProjectActions.newProject({ name: this.refs.projectName.getValue() })
  }

  viewProject(project) {
    event.preventDefault()
    ProjectActions.selectProject(project)
  }

  update(store) {
    this.setState(store)
  }

  getButtonStyle(name) {
    return name === this.state.menu ? 'info' : ''
  }

  submitButton() {
    return (
      <Input type="submit" value="Submit" />
    )
  }

  renderProject(project) {
    return (
      <h4 className="col-xs-12" onClick={ this.viewProject.bind(this, project) }>
        <Glyphicon
          glyph="remove"
          className="pull-right"
          onClick={ ProjectActions.removeProject.bind(ProjectActions, project) }
          />
        { project.name }
      </h4>
    )
  }

  renderProjectDetail() {
    if (!this.state.selected) return null
    return (
      <ProjectDetail project={ this.state.selected } stories={ this.state.stories } />
    )
  }

  render() {
    const projects = this.state.projects.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <form onSubmit={ this.newProject.bind(this) }>
              <Input ref="projectName" type="input" buttonAfter={ this.submitButton() } />
            </form>
          </div>
        </div>
        <div className="row">
          { projects.map(this.renderProject.bind(this)) }
        </div>
        { this.renderProjectDetail() }
      </div>
    )
  }

}
