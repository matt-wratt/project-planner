import React from 'react'

const events = [
  'chargingchange',
  'chargingtimechange',
  'dischargingtimechange',
  'levelchange'
]

const levels = Array.apply(Array, Array(5)).map((_, i) => 1 / 4 * i)

const levelIndex = level => levels.reduce((x, y, i) => y <= level ? i : x)

export default class BatteryStatus extends React.Component {

  constructor(props) {
    super(props)
    this.state = { status: ['active', 'active', 'active'] }
    this.updateStatus = this.updateStatus.bind(this)
  }

  componentWillMount() {
    navigator.getBattery().then(manager => {
      this.manager = manager
      events.forEach(event => this.manager.addEventListener(event, this.updateStatus))
      this.updateStatus({ target: manager })
    })
  }

  componentWillUnmount() {
    events.forEach(event => this.manager.removeEventListener(event, this.updateStatus))
    delete this.manager
  }

  updateStatus({ target }) {
    const charge = levelIndex(target.level)
    const status = this.state.status.map((_, i) => i > charge ? 'active' : 'inactive')
    this.setState({ status: status })
  }

  render() {
    const bars = this.state.status
    return (
      <div className="battery">
        { bars.map(status => <div className={ `battery-bar ${status}` } />) }
      </div>
    )
  }

}
