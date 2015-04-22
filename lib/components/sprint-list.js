import React from 'react'
import Sprint from './sprint'

export default class SprintList extends React.Component {
  
  constructor(props) {
    super(props)
    this.updateSize = this.updateSize.bind(this)
    this.state = { height: 0 }
  }

  updateSize() {
    const node = this.refs.column.getDOMNode()
    const height = window.innerHeight - calcOffsetTop(node)
    this.setState({ height })
  }

  componentDidMount() {
    this.updateSize()
    window.addEventListener('resize', this.updateSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize)
  }

  render() {
    const { name, sprints } = this.props
    const { height } = this.state
    const overflow = 'scroll'
    return (
      <div className="col-xs-4 no-padding">
        <h4>{ name }</h4>
        <div ref="column" style={{ height, overflow }}>
          { keys(sprints, (timestamp, stories) => (
            <Sprint timestamp={ timestamp } stories={ stories } />
          )) }
        </div>
      </div>
    )
  }

}

function keys(obj, fn) {
  return Object.keys(obj).sort().map(key => fn(key, obj[key]))
}

function calcOffsetTop(node) {
  const { offsetParent, offsetTop } = node
  return offsetTop + (offsetParent ? calcOffsetTop(offsetParent) : 0)
}
