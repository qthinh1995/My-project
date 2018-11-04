import React, { Component, PropTypes } from 'react'
import { isEmpty } from 'lodash'

// import connect from 'connect-alt'

// @connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))
let socket = {};
let mousePosition={};
let self = {}

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
        self = this;
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

    startDragChatBoard() {
        console.log('mouse down')
        window.addEventListener('mousemove', this.onDragChatBoard)
    }

    onDragChatBoard(e) {
        if (!isEmpty(mousePosition)) {
            const newPosition = { x: e.screenX, y: e.screenY };
            const chatBoard = document.querySelector('#chatBoard');
            let bottom = parseInt(chatBoard.style.bottom, 10);
            let left = parseInt(chatBoard.style.left, 10);

            bottom = bottom - newPosition.y + mousePosition.y;
            left = left + newPosition.x - mousePosition.x;

            chatBoard.style.bottom = bottom + 'px';
            chatBoard.style.left = left + 'px';
        }
        mousePosition = { x: e.screenX, y: e.screenY };
    }

    onStopDragChatBoard() {
        console.log('mouse up')
        mousePosition = {};
        window.removeEventListener('mousemove', this.onDragChatBoard)
    }

    startResizeChatBoard() {
        console.log('mouse down')
        window.addEventListener('mousemove', this.onResizeChatBoard)
    }

    onResizeChatBoard(e) {
        if (!isEmpty(mousePosition)) {
            const newPosition = { x: e.screenX, y: e.screenY };
            const chatBoard = document.querySelector('#chatBoard');
            let height = parseInt(chatBoard.style.height, 10);
            let width = parseInt(chatBoard.style.width, 10);

            height = height - newPosition.y + mousePosition.y;
            width = width + newPosition.x - mousePosition.x;

            chatBoard.style.height = height + 'px';
            chatBoard.style.width = width + 'px';
        }
        mousePosition = { x: e.screenX, y: e.screenY };
    }

    onStopResizeChatBoard() {
        console.log('mouse up')
        mousePosition = {};
        window.removeEventListener('mousemove', this.onResizeChatBoard)
    }
    render() {
        const { reference } = this.props

        return (
            <div id="chatBoard" className="user-chatboard" style={{ height: '340px', width: '550px', position: 'fixed', bottom: '0', left: '0' }}>
                <div className="drag-icon" onMouseUp={() => { this.onStopDragChatBoard() }} onMouseDown={(e) => this.startDragChatBoard(e)}></div>
                <div className="resize-icon" onMouseUp={() => { this.onStopResizeChatBoard() }} onMouseDown={(e) => this.startResizeChatBoard(e)}></div>
                <div className="message-area" ref={reference} ></div>
                <div className="type-area">
                    <input ref="messageInput" />
                    <input ref="sendBtn"type="button" value="Send" onClick={() => { this.sendMessage() }} />
                </div>
            </div >
        )
    }
}
