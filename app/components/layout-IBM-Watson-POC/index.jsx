import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroGame from './CaroGame'
import socketIOClient from 'socket.io-client'

// const row = 20;
// const col = 40;
let socket = {}
const arrayMap = Array(20)
for (let i = 0; i < arrayMap.length; i++) {
    arrayMap[i] = Array(40).fill(null)
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
        isSubmit: false,
        arrHosts: [],
        hostName: '',
        roomName: '',
        type: ''
    }

    componentWillMount() {
        const { flux } = this.context
        flux.getActions('helmet').update({ title: 'home page title', description: 'home page description' })
        flux.getActions('users').index()
        socket = socketIOClient(this.getURL())
    }

    getURL() {
        return location.href
    }

    componentDidMount() {
        this.socketOn()
    }

    socketOn() {
        socket.on('john room', (hostName) => {
            this.setState({ hostName })
        })

        socket.on('receive ftype', typeReceive => {
            this.setState({ type: typeReceive })
        })

        socket.on('submit user name', userName => {
            const roomName = userName + "'s room";
            this.setState({ isSubmit: true, userName, roomName })
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

    onSubmitName() {
        const { userName } = this.state;
        if (userName) {
            socket.emit('submit user name', userName)
        } else {
            alert('User name is required');
        }
    }

    createRoom() {
        const { roomName } = this.state
        if (roomName) {
            socket.emit('john room', { roomName, arrayMap, isCreate: true })
        }
    }

    johnRoom(item) {
        socket.emit('john room', { roomName: item })
    }

    renderListRoom() {
        const { userName, roomName, arrHosts } = this.state;
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
                                <div key={i} onClick={() => this.johnRoom(item)} > {item} </div>
                            )
                        })}
                    </div>
                    <div className="create-room">
                        <input className="input-name" onChange={(e) => this.onChangeRoomName(e)} value={roomName} />
                        <input type="button" value="Create Room" onClick={() => this.createRoom()} />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { gameMode, isClickX, userName, isSubmit, hostName, type, arrHosts } = this.state;
        const areaName = 'area-name'
        console.log(hostName, type, arrHosts)
        return (
            <div>
                <h1>Caro Game</h1>
                <label><input type="checkbox" name="vehicle" onChange={(e) => this.toggleDarkTheme(e.target)} />Dark Theme</label>
                {!isSubmit &&
                    <div className={areaName} >
                        Your user name:
                        <input className="input-name" onChange={(e) => this.onChangeName(e)} value={userName} />
                        <input type="button" value="OK" onClick={() => this.onSubmitName()} />
                    </div>
                }

                {isSubmit && !hostName && this.renderListRoom()}

                {!gameMode && <div>
                    <h3>Select game mode</h3>
                    <button onClick={() => this.selectGameMode('multy')}>Multiple players</button>
                    <button onClick={() => this.selectGameMode('single')}>Player vs computer</button>
                </div>
                }
                {hostName && <div>{`room ${hostName}`}</div>}
                {type && hostName && gameMode &&
                    <CaroGame isClickX={isClickX} gameMode={gameMode} hostName={hostName} socket={socket} arrayMap={arrayMap} type={type} />}
            </div >
        )
    }
}
