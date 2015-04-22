import React from 'react'
import { Button, DropdownButton, Glyphicon, Input, Nav, Navbar, NavItem, MenuItem } from 'react-bootstrap'
import ProjectActions from '../actions/project'
import ProjectStore from '../stores/projects'
import ProjectDetail from './project-detail'
import BatteryStatus from './battery-status'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = ProjectStore.getInitialState()
    ProjectStore.listen(this.update.bind(this), this.update.bind(this))
  }

  newProject(event) {
    event.preventDefault()
    ProjectActions.newProject({ name: this.refs.projectName.getValue() })
    this.refs.projectName.getDOMNode().querySelector('input').value = ''
  }

  switchProject(key) {
    ProjectActions.selectProject(this.projects()[key])
  }

  projects() {
    return this.state.projects.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
  }

  update(store) {
    this.setState(store)
  }

  getButtonStyle(name) {
    return name === this.state.menu ? 'info' : ''
  }

  renderProjectItem(project, i) {
    const current = this.state.selected
    const active = current && current.id === project.id ? 'active' : ''
    return (
      <MenuItem key={ i } eventKey={ i } className={ active }>{ project.name }</MenuItem>
    )
  }

  renderProjectDetail() {
    if (!this.state.selected) return null
    return (
      <ProjectDetail project={ this.state.selected } stories={ this.state.stories } />
    )
  }

  render() {
    const projects = this.projects()
    const handleSelect = this.switchProject.bind(this)
    return (
      <div className="container-fluid">
        <Navbar brand="Project Planner" inverse toggleNavKey={ 0 } className="navbar-fixed-top">
          <Nav>
            <DropdownButton eventKey={ 1 } title="Switch Projects" onSelect={ handleSelect }>
              { projects.map(this.renderProjectItem.bind(this)) }
            </DropdownButton>
          </Nav>
          <Nav>
            <MenuItem>
              <BatteryStatus />
            </MenuItem>
          </Nav>
          <Nav eventKey={ 0 } right>
            <form className="navbar-form" onSubmit={ this.newProject.bind(this) }>
              <Input ref="projectName" type="input" placeholder="New Project" />
              {' '}
              <Button type="submit" bsStyle="success">Create</Button>
            </form>
          </Nav>
        </Navbar>
        { this.renderProjectDetail() }
      </div>
    )
  }

}
