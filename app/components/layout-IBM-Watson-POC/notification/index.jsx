import React, { Component } from 'react'

export default class Notification extends Component {

    state = {
      className: 'notification not-display'
    }

    showNotification({ type = 'error', message = '', duration = 3000 }) {
      const className = `notification ${type}`
      this.setState({ message, className})
      setTimeout(() => {
        this.onCloseNoti()
      }, duration)
    }

    onCloseNoti() {
      this.setState({ className: 'notification not-display' })
    }

    render() { 
      const { message, className } = this.state
      return (
        <div className={className} >
          <i className="fa fa-times close-btn" aria-hidden="true" onClick={() => this.onCloseNoti()} ></i>
          <div className="message-error" > {message} </div>
        </div>
      )
    }
}
