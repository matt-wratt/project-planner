import React from 'react'
import Timestamp from './timestamp'

export default class History extends React.Component {

  renderHistory(history) {
    return (
      <div>
        <small>
          <Timestamp timestamp={ history.timestamp } />
        </small>
        {' '}
        { history.message }
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.props.story.history.map(this.renderHistory.bind(this)) }
      </div>
    )
  }

}
