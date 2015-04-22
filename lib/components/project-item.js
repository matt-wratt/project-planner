import React from 'react'
import { DragDropMixin } from 'react-dnd';
import { Button, Glyphicon, ModalTrigger, Nav, NavItem } from 'react-bootstrap'
import ConfirmationModal from './modals/confirmation'
import StoryModal from './modals/story'
import ProjectActions from '../actions/project'
import Comments from './comments'
import History from './history'
import Estimate from './estimate'
import { storyTypeStyle } from '../helpers'

const dragSource = {
  beginDrag(component) {
    ProjectActions.startMove(component.props.item.id)
    return component.props
  },

  endDrag(component) {
    ProjectActions.finishMove(component.props.item.id)
  }
}

const dropTarget = {
  over(component, item) {
    ProjectActions.moveStory(item.id, component.props.item.id)
  }
}

export default React.createClass({

  mixins: [DragDropMixin],

  statics: {
    configureDragDrop(register) {
      register('story', { dragSource, dropTarget })
    }
  },

  getInitialState() {
    return {
      expand: false,
      selectedTab: 'Comments'
    }
  },

  tabs() {
    return {
      Comments: story => <Comments story={ story } />,
      History: story => <History story={ story } />
    }
  },

  alertStyle({ state }) {
    switch (state) {
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'danger'
      case 'finished':
        return 'warning'
      case 'started':
        return 'info'
      case 'pending':
      default:
        return 'warning'
    }
  },

  renderActions({ state }) {
    const start = action('start', this.props)
    const finish = action('finish', this.props)
    const accept = action('accept', this.props)
    const reject = action('reject', this.props)
    switch (state) {
      case 'started':
        return <Button bsStyle="warning" bsSize="xsmall" onClick={ finish }>Finish</Button>
      case 'finished':
        return (
          <span>
            <Button bsStyle="success" bsSize="xsmall" onClick={ accept }>Accept</Button>{' '}
            <Button bsStyle="danger" bsSize="xsmall" onClick={ reject }>Reject</Button>
          </span>
        )
      case 'accepted':
        return null
      case 'rejected':
      case 'ready':
      default:
        return <Button bsStyle="primary" bsSize="xsmall" onClick={ start }>Start</Button>
    }
  },

  renderExtra(story) {
    const { selectedTab } = this.state
    const tabs = this.tabs()
    const active = Object.keys(tabs).reduce((key, name, i) => name === selectedTab ? i : key, 0)
    const selectTab = key => { this.setState({ selectedTab: Object.keys(tabs)[key] }) }
    return !this.state.expand ? null : (
      <div>
        <br />
        <Nav bsStyle='tabs' activeKey={ active } onSelect={ selectTab }>
          { Object.keys(tabs).map((name, i) => <NavItem eventKey={ i }>{ name }</NavItem>) }
        </Nav>
        <div style={{ padding: '5px', 'background-color': '#fff' }}>
          { tabs[selectedTab](story) }
        </div>
      </div>
    )
  },

  render() {
    const item = this.props.item
    var { id, title, type, comments, state } = item
    const remove = action('remove', this.props)
    const update = action('update', this.props)
    const { isDragging } = this.getDragState('story')
    const opacity = isDragging ? 0 : 1
    type = type || 'story'
    return (
      <div id={ id } className={ `story ${state}` } style={{ opacity }} { ...this.dragSourceFor('story') } { ...this.dropTargetFor('story') }>

        <div className="pull-right">
          <Estimate story={ item } />
          <span className="badge">{ (comments || []).length }</span>{' '}
          { this.renderActions(item) }{' '}
          <ModalTrigger modal={ <StoryModal story={ item } onSuccess={ update } /> }>
            <Glyphicon glyph="edit" />
          </ModalTrigger>
          <ModalTrigger modal={ <ConfirmationModal message="Are you sure you want to remove this story?" onConfirmation={ remove } /> }>
            <Glyphicon glyph="remove" />
          </ModalTrigger>
        </div>

        <Glyphicon glyph={ this.state.expand ? 'chevron-down' : 'chevron-right' } onClick={ () => this.setState({ expand: !this.state.expand }) } />{' '}
        <span className={ `label label-${storyTypeStyle(type)}` }>{ type }</span>
        {' '}{ title }
        { this.renderExtra(item) }
      </div>
    )
  }

})

function action(name, { item }) {
  return function(event) {
    ProjectActions[`${name}Story`](item)
  }
}
