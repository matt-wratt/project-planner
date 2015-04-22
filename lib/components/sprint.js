import React from 'react'
import ProjectItem from './project-item'
import Timestamp from './timestamp'

export default class Sprint extends React.Component {

  render() {
    const { timestamp, stories } = this.props
    return (
      <div>
        <Timestamp className="story title block" timestamp={ timestamp } dateOnly />
        { stories.map(story => <ProjectItem item={ story } key={ story.id } />) }
      </div>
    )
  }

}
