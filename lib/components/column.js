import React from 'react'

const gridSize = 12

export default class Column extends React.Component {

  renderChild(size, child) {
    return (
      <div className={ `col-xs-${size}` }>
        { child }
      </div>
    )
  }

  render() {
    let children = this.props.children
    children = children instanceof Array ? children : [children]
    let perChild = Math.floor(gridSize / children.length)
    return (
      <div className="row">
        { children.map(this.renderChild.bind(this, perChild)) }
      </div>
    )
  }

}
