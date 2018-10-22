import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroGame from './CaroGame'
import socketIOClient from 'socket.io-client'
import Login from 'components/layout-IBM-Watson-POC/login'
import { isEmpty } from 'lodash'

// const row = 20;
// const col = 40;
let socket = {}
const caroMap = Array(20)
for (let i = 0; i < caroMap.length; i++) {
    caroMap[i] = Array(40).fill(null)
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
        arrHosts: [],
        roomState: {},
        roomName: '',
        type: '',
        isLogin: false,
        isCreate: false,
        userID: ''
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
            this.setState({ roomState })
        })

        socket.on('submit user name', userName => {
            const roomName = userName + "'s room";
            this.setState({ isLogin: true, userName, roomName })
            socket.on('get hosts', currentHosts => {
                this.setState({ arrHosts: currentHosts })
            })
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
        this.setState({ isCreate: true })
    }

    johnRoom(item) {
        socket.emit('john room', { roomName: item })
    }

    onChangeRenderLogin({ userName }) {
        setTimeout(() => {
            if (userName) {
                socket.emit('submit user name', userName)
            } else {
                alert('User name is required');
            }
        }, 2000)
    }

    renderListRoom() {
        const { userName, arrHosts } = this.state;
        return (
            <div>
                <h2 className={'area-name'} >
                    {`Hello ${userName}`}
                </h2>
                <div className="room-panel">
                    <div className="list-room">
                        <h3>List room</h3>
                        {arrHosts && arrHosts.map((item, i) => {
                            return (
                                <div key={i} onClick={() => this.johnRoom(item.idRoom)} > {item.roomName} </div>
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
        const { gameMode, roomState, isLogin, isCreate, userID } = this.state;
        return (
            <div className="caro-game" >
                { !isLogin && <Login onChangeRenderLogin={(value) => this.onChangeRenderLogin(value)} /> }
                { isCreate &&
                    <button type="button" className="btn btn-info leave-button">Leave room</button>
                }
                { !isCreate &&
                    <button
                        type="button" className="btn btn-info create-button" onClick={() => this.createRoom()}>Create room
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
                    <CaroGame roomState={roomState} socket={socket} userID={userID} />
                }
            </div >
        )
    }
}
