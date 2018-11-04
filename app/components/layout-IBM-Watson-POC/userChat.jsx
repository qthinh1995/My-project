import React, { Component, PropTypes } from 'react'
// import connect from 'connect-alt'

// @connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))
let socket = {};

export default class IBMWatsonPOCHome extends Component {
    static propTypes = {
        socket: PropTypes.object,
        info: PropTypes.object,
        reference: PropTypes.string
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
        socket.on('send message to room', ({ userName, message, reference }) => {
            if (this.props.reference === reference) {
                self.refs[reference].innerHTML += `<div>${userName}: ${message}</div>`
            }
        })
        self.refs.messageInput.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (event.keyCode === 13) {
                self.refs.sendBtn.click();
            }
        });
    }

    sendMessage() {
        if (this.refs.messageInput.value) {
            const { info: { mode = '', roomName = '' }, reference} = this.props
            
            const data = {
                mode,
                reference,
                value: this.refs.messageInput.value
            }
            if (mode === 'in game') {
                data.roomName = roomName
            }
            //  else if (mode === 'private') {
            //     data.idUser = idUser
            // }
            socket.emit('send message to room', data);
            this.refs.messageInput.value = '';
        }
    }

    render() {
        const { reference } = this.props

        return (
            <div className="user-chatboard" style={{ height: '340px', width: '550px' }}>
                <div className="message-area" ref={reference} ></div>
                <div className="type-area">
                    <input ref="messageInput" />
                    <input ref="sendBtn"type="button" value="Send" onClick={() => { this.sendMessage() }} />
                </div>
            </div >
        )
    }
}
