import React, { Component, PropTypes } from 'react'
// import connect from 'connect-alt'

// @connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))
let socket = {};

export default class IBMWatsonPOCHome extends Component {
    static propTypes = {
        socket: PropTypes.object
    }
    static contextTypes = {

    }


    state = {

    }

    componentWillMount() {
        socket = this.props.socket;
    }

    componentDidMount() {
        const self = this;
        socket.on('send message to room', ({ userName, message }) => {
            self.refs.messageArea.innerHTML += `<div>${userName}: ${message}</div>`
        })
    }

    sendMessage() {
        if (this.refs.messageInput.value) {
            socket.emit('send message to room', this.refs.messageInput.value);
            this.refs.messageInput.value = '';
        }
    }

    render() {
        return (
            <div className="user-chatboard" style={{ height: '340px', width: '550px' }}>
                <div className="message-area" ref="messageArea"></div>
                <div className="type-area">
                    <input ref="messageInput" />
                    <input type="button" value="Send" onClick={() => { this.sendMessage() }} />
                </div>
            </div >
        )
    }
}
