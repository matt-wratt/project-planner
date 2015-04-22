import React from 'react'
import { Alert, Col, Glyphicon, Jumbotron, ModalTrigger, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import InputInline from './input-inline'
import SprintList from './sprint-list'
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

  renderNoStories() {
    return (
      <Alert>There are currently no stories for this project</Alert>
    )
  }

  renderColumns() {
    const { project: { velocity, start, sprintDuration }, stories } = this.props
    const columns = splitStories(stories, velocity, sprintDuration, Date.parse(start))

    if (stories.length > 0) {
      return keys(columns, (name, sprints) => (
        <SprintList name={ name } sprints={ sprints } />
      ))
    } else {
      return this.renderNoStories()
    }
  }

  renderHeader() {
    const { project: { name, velocity }, project, stories } = this.props
    return (
      <h1>
        <small className="pull-right">
          <InputInline
            type="number"
            defaultValue={ velocity }
            onChange={ this.setVelocity }
            addonBefore={ <Glyphicon glyph="flash" /> }
            style={{ width: '70px' }}
            />
          {' '}
          <ModalTrigger modal={ <ProjectSettingsModal project={ project } stories={ stories } /> }>
            <Glyphicon glyph="cog" />
          </ModalTrigger>
          {' '}
          <OverlayTrigger ref="tooltip" placement="left" overlay={ <Tooltip><strong>Create Story</strong> (Option + N)</Tooltip> }>
            <span style={{ display: 'inline-block', height: '1em' }} />
          </OverlayTrigger>
          <ModalTrigger modal={ <StoryModal story={{ type: 'story' }} onSuccess={ this.createStory.bind(this) } /> }>
            <Glyphicon glyph="plus" ref="newStory" onMouseEnter={ this.showTooltip } onMouseLeave={ this.hideTooltip } />
          </ModalTrigger>
        </small>
        Welcome to { name }
      </h1>
    )
  }

  render() {
    return (
      <div className="container-fluid">
        { this.renderHeader() }
        { this.renderColumns() }
      </div>
    )
  }

}

function keys(obj, fn) {
  return Object.keys(obj).map(key => fn(key, obj[key]))
}
