import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroGame from './CaroGame'
import socketIOClient from 'socket.io-client'
import Login from 'components/layout-IBM-Watson-POC/login'
import { isEmpty } from 'lodash'
import Chat from './Chat'


let socket = {}
const caroMap = Array(20)
for (let i = 0; i < caroMap.length; i++) {
    caroMap[i] = Array(32).fill(null)
}

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class IBMWatsonPOCHome extends Component {
    static propTypes = {
        inProgress: PropTypes.bool,
        session: PropTypes.object
    }
    static contextTypes = {
        locales: PropTypes.array.isRequired,
        flux: PropTypes.object.isRequired,
        i18n: PropTypes.func.isRequired
    }


    state = {
        isClickX: true,
        hasWinner: false,
        gameMode: 'multy',
        userName: '',
        currentHosts: [],
        roomState: {},
        roomName: '',
        type: '',
        isLogin: false,
        isInRoom: false,
        userID: '',
        isReset: false
    }

    componentWillMount() {
        const { flux } = this.context
        flux.getActions('helmet')
        flux.getActions('users').index()
    }

    getURL() {
        return location.href
    }

    componentDidMount() {
        socket = socketIOClient(this.getURL())
        this.socketOn()
    }

    socketOn() {
        socket.on('get user id', (userID) => {
            console.log('userID', userID)
            this.setState({ userID })
        })

        socket.on('john room', (roomState) => {
            this.setState({ roomState, isInRoom: true })
            this.refs.chat.onInRoom({ value: true })
        })

        socket.on('submit user name', userName => {
            const roomName = userName + "'s room";
            setTimeout(() => {
                this.setState({ isLogin: true, userName, roomName })
            }, 1000)
            socket.on('get hosts', currentHosts => {
                this.setState({ currentHosts })
            })
        })

        socket.on('leave room', () => {
            this.setState({ roomState: {}, isInRoom: false })
            this.refs.chat.onInRoom({ value: false })
        })
    }

    toggleDarkTheme(e) {
        if (e.checked) {
            document.body.classList.add('dark-theme')
            return;
        }

        document.body.classList.remove('dark-theme')
    }

    selectGameMode(value) {
        this.setState({ gameMode: value })
    }

    onChangeName(e) {
        this.setState({ userName: e.target.value })
    }
    onChangeRoomName(e) {
        this.setState({ roomName: e.target.value })
    }

    createRoom() {
        const { roomName } = this.state
        if (roomName) {
            socket.emit('john room', { roomName, caroMap, isCreate: true })
        }
    }

    johnRoom(item) {
        socket.emit('john room', { roomName: item })
    }

    onChangeRenderLogin({ userName }) {
        socket.emit('submit user name', userName)
    }

    onLeaveRoom() {
        socket.emit('leave room')
    }

    onHandleRoom(value) {
        this.setState({ isReset: value})
    }

    resetRoom() {
        this.onHandleRoom(false)
        socket.emit('reset room')
    }

    renderListRoom() {
        const { userName, currentHosts } = this.state;
        return (
            <div>
                <h2 className={'area-name'} >
                    {`Hello ${userName}`}
                </h2>
                <div className="room-panel">
                    <div className="custom-list selectable">
                        <h3 className="custom-list-tittle">List room</h3>
                        {currentHosts && currentHosts.map((item, i) => {
                            return (
                                <div className="list-block" key={i} onClick={() => this.johnRoom(item.idRoom)} > <span className="name">{item.roomName}</span>  </div>
                            )
                        })}
                    </div>
                    {/* <div className="create-room">
                        <input className="input-name" onChange={(e) => this.onChangeRoomName(e)} value={roomName} />
                        <input type="button" value="Create Room" onClick={() => this.createRoom()} />
                    </div> */}
                </div>
            </div>
        )
    }

    render() {
        const { gameMode, roomState, isLogin, isInRoom, userID, isReset } = this.state;

        return (
            <div className="caro-game" >
                { !isLogin && <Login onChangeRenderLogin={(value) => this.onChangeRenderLogin(value)} /> }
                { isInRoom && !isReset &&
                    <button type="button" className="btn btn-info leave-button" onClick={() => this.onLeaveRoom()} >Leave room</button>
                }
                { !isInRoom &&
                    <button
                        type="button" className="btn btn-info create-button" onClick={() => this.createRoom()}>Create room
                    </button>
                } 
                { isInRoom && isReset &&
                    <button
                        type="button" className="btn btn-info reset-button" onClick={() => this.resetRoom()}>Reset room
                    </button>
                }               
                <label><input type="checkbox" name="vehicle" onChange={(e) => this.toggleDarkTheme(e.target)} />Dark Theme</label>
                {isLogin && isEmpty(roomState) && this.renderListRoom()}
                {!gameMode && <div>
                    <h3>Select game mode</h3>
                    <button onClick={() => this.selectGameMode('multy')}>Multiple players</button>
                    <button onClick={() => this.selectGameMode('single')}>Player vs computer</button>
                </div>
                }
                { !isEmpty(roomState) &&
                    <CaroGame roomState={roomState} socket={socket} userID={userID} onHandleRoom={(value) => this.onHandleRoom(value)} />
                }
                { isLogin && <Chat socket={socket} ref="chat" /> }
            </div >
        )
    }
}
