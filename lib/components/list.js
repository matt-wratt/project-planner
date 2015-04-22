import React from 'react'

export default class List extends React.Component {

  render() {
    var children = this.props.children
    children = children instanceof Array ? children : [children]
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          { this.props.extra ? this.props.extra : null }
          { this.props.name }
        </div>
        <div className="panel-body no-padding">
          { children }
        </div>
      </div>
    )
  }

}
