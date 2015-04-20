import React from 'react'

export default class Timestamp extends React.Component {

  timestamp() {
    return new Date(this.props.timestamp)
  }

  date() {
    const date = this.timestamp()
    return [
      date.getDate(),
      date.getMonth(),
      date.getFullYear().toString().substr(2)
    ].map(pad).join('/')
  }

  time() {
    const date = this.timestamp()
    return [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ].map(pad).join(':')
  }

  render() {
    const { dateOnly, timeOnly } = this.props
    return (
      <span>
        { timeOnly ? null : this.date() }
        { timeOnly || dateOnly ? null : ' ' }
        { dateOnly ? null : this.time() }
      </span>
    )
  }

}

function pad(num) {
  return num.toString().replace(/^(\d)$/, '0$1')
}
