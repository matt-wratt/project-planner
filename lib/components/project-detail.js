import React from 'react'
import { Alert, Col, Glyphicon, Jumbotron, ModalTrigger, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import Column from './column'
import List from './list'
import ProjectItem from './project-item'
import InputInline from './input-inline'
import Timestamp from './timestamp'
import StoryModal from './modals/story'
import ProjectActions from '../actions/project'
import ProjectSettingsModal from './modals/project-settings'
import { splitStories } from '../helpers'

export default class ProjectDetail extends React.Component {

  constructor(props) {
    super(props)
    this.handleShortcut = this.handleShortcut.bind(this)
    this.setVelocity = this.setVelocity.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
  }

  createStory(story) {
    ProjectActions.newStory(story)
  }

  handleShortcut(event) {
    if (event.altKey && event.which === 78) {
      event.preventDefault()
      this.refs.newStory.getDOMNode().click()
    }
  }

  setVelocity(velocity) {
    const { project } = this.props
    project.velocity = velocity
    ProjectActions.updateProject(project)
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleShortcut)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleShortcut)
  }

  showTooltip(event) {
    this.refs.tooltip.show()
  }

  hideTooltip(event) {
    this.refs.tooltip.hide()
  }

  renderStories() {
    const { project: { velocity, start, sprintDuration }, stories } = this.props
    const columns = splitStories(this.props.stories, velocity, sprintDuration, Date.parse(start))
    return Object.keys(columns).map(column => (
      <List name={ column } extra={ column === 'backlog' ? this.renderOptions() : null } key={ column }>
        {
          Object.keys(columns[column]).map(timestamp => (
            <List name={ <Timestamp timestamp={ Number(timestamp) } dateOnly /> } key={ timestamp }>
              { columns[column][timestamp].map(story => <ProjectItem item={ story } key={ story.id } />) }
            </List>
          ))
        }
      </List>
    ))
  }

  renderNoStories() {
    return (
      <List name="current" extra={ this.renderOptions() }>
        <Alert>There are currently no stories for this project</Alert>
      </List>
    )
  }

  renderOptions() {
    return (
      <div className="pull-right">
        <OverlayTrigger ref="tooltip" placement="left" overlay={ <Tooltip><strong>Create Story</strong> (Option + N)</Tooltip> }>
          <span style={{ display: 'inline-block', height: '1em' }} />
        </OverlayTrigger>
        <ModalTrigger modal={ <StoryModal story={{ type: 'story' }} onSuccess={ this.createStory.bind(this) } /> }>
          <Glyphicon glyph="plus" ref="newStory" onMouseEnter={ this.showTooltip } onMouseLeave={ this.hideTooltip } />
        </ModalTrigger>
      </div>
    )
  }

  render() {
    const { project, stories, project: { velocity }} = this.props

    return (
      <div className="container">
        <h1>
          <small className="pull-right">
            <InputInline
              type="number"
              defaultValue={ velocity }
              onChange={ this.setVelocity }
              addonBefore={ <Glyphicon glyph="flash" /> }
              style={{ 'margin-right': '20px', width: '70px' }}
              />
            <ModalTrigger modal={ <ProjectSettingsModal project={ project } stories={ stories } /> }>
              <Glyphicon glyph="cog" />
            </ModalTrigger>
          </small>
          Welcome to { project.name }
        </h1>
        <Column>
          { stories.length ? this.renderStories() : this.renderNoStories() }
        </Column>
      </div>
    )
  }

}

function byOrder(a, b) {
  a = a.order
  b = b.order
  return a > b ? 1 : a < b ? -1 : 0
}

function byState (a, b) {
  a = scoreState(a)
  b = scoreState(b)
  return a > b ? 1 : a < b ? -1 : 0
}

function scoreState ({ state }) {
  return ['accepted', 'finished', 'started', 'rejected', 'pending', undefined].indexOf(state)
}
