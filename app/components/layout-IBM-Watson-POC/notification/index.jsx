import React, { Component } from 'react'

export default class Notification extends Component {

    state = {
      className: 'notification not-display'
    }

    showNotification({ type = 'error', message = '', duration = 2500 }) {
      const className = `notification animation-show ${type}`
      this.setState({ message, className, type })
      setTimeout(() => {
        this.onCloseNoti()
      }, duration)
    }

    onCloseNoti() {
      const { type } = this.state
      this.setState({ className: `notification ${type}` })
    }

    render() { 
      const { message, className } = this.state
      return (
        <div className={className} >
          <div className="message-error" > {message} </div>
        </div>
      )
    }
}
