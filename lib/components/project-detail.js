import React from 'react'
import { Alert, Col, Glyphicon, Jumbotron, ModalTrigger, Row } from 'react-bootstrap'
import Column from './column'
import List from './list'
import StoryModal from './modals/story'
import ProjectItem from './project-item'
import ProjectActions from '../actions/project'
import ProjectSettingsModal from './modals/project-settings'

export default class ProjectDetail extends React.Component {

  constructor(props) {
    super(props)
    this.handleShortcut = this.handleShortcut.bind(this)
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

  componentWillMount() {
    document.addEventListener('keydown', this.handleShortcut)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleShortcut)
  }

  renderStories() {
    return this.props.stories
            .sort((a, b) => byState(a, b) || byOrder(a, b))
            .map(item => <ProjectItem item={ item } key={ item.id } />)
  }

  renderNoStories() {
    return (
      <Alert>There are currently no stories for this project</Alert>
    )
  }

  renderOptions() {
    return (
      <div className="pull-right">
        <ModalTrigger modal={ <StoryModal story={{ type: 'story' }} onSuccess={ this.createStory.bind(this) } /> }>
          <Glyphicon glyph="plus" ref="newStory" />
        </ModalTrigger>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        <h1>
          <small className="pull-right">
            <ModalTrigger modal={ <ProjectSettingsModal project={ this.props.project } /> }>
              <Glyphicon glyph="cog" />
            </ModalTrigger>
          </small>
          Welcome to { this.props.project.name }
        </h1>
        <Column>
          <List name="current" extra={ this.renderOptions() }>
            { this.props.stories.length ? this.renderStories() : this.renderNoStories() }
          </List>
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
