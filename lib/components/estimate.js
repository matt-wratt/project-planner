import React from 'react'
import ProjectActions from '../actions/project'

export default class Estimate extends React.Component {

  estimate(amount) {
    const story = this.props.story
    if (this.isEstimated()) {
      delete story.estimate
    } else {
      story.estimate = amount
    }
    ProjectActions.updateStory(story)
  }

  isEstimated() {
    const { estimate } = this.props.story
    return estimate !== undefined
  }

  renderEstimate(amount) {
    return (
      <span className="estimate" onClick={ this.estimate.bind(this, amount) }>
        { Array.apply(window, Array(8)).map((_, i) => {
          return (
            <span className={ `estimate-bar ${8 - i <= amount ? 'dark' : 'light'}` } />
          )
        }) }
      </span>
    )
  }

  renderUnestimated() {
    return Array.apply(window, Array(6)).map((_, i) => {
      return this.renderEstimate([0, 1, 2, 3, 5, 8][i])
    })
  }

  render() {
    const { estimate } = this.props.story
    return (
      <span>
        { this.isEstimated() ? this.renderEstimate(estimate) : this.renderUnestimated() }
      </span>
    )
  }

}
