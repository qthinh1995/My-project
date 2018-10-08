import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroGame from './CaroGame'
import socketIOClient from 'socket.io-client'

// const row = 20;
// const col = 40;
const endpoint = 'http://localhost:999'
const socket = socketIOClient(endpoint)

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
        gameMode: 'single',
        userName: '',
        isSubmit: false,
        arrHosts: [],
        hostName: ''
    }

    componentWillMount() {
        const { flux } = this.context
        flux.getActions('helmet').update({ title: 'home page title', description: 'home page description' })
        flux.getActions('users').index()
    }

    componentDidMount() {
        socket.emit('get hosts')
        this.receiveHosts()
    }

    receiveHosts() {
        socket.on('create room', arrHosts => {
            this.setState({ arrHosts })
        })
        socket.on('get hosts', currentHosts => {
            this.setState({ arrHosts: currentHosts })
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

    onSubmitName() {
        this.setState({ isSubmit: true })
    }

    createRoom() {
        const { userName, arrHosts } = this.state
        if (userName) {
            arrHosts.push(userName)
            socket.emit('create room', arrHosts)
            this.johnRoom(userName)
        }
    }

    johnRoom(item) {
        socket.emit('john room', { roomName: item })
        this.setState({ hostName: item})        
    }

    render() {
        const { gameMode, isClickX, userName, isSubmit, arrHosts, hostName } = this.state;
        const areaName = 'area-name'
        return (
            <div>
                <h1>Caro Game</h1>
                <label><input type="checkbox" name="vehicle" onChange={(e) => this.toggleDarkTheme(e.target)}/>Dark Theme</label>
                { !isSubmit && 
                    <div className={areaName} >
                        <input className="input-name" onChange={(e) => this.onChangeName(e)} value={userName} />
                        <input type="button" value="OK" onClick={() => this.onSubmitName()} />
                    </div>
                }
                { isSubmit &&
                    <div className={areaName} >
                        {userName}
                    </div>
                }
                <input type="button" value="Create Room" onClick={() => this.createRoom()} />
                { arrHosts.map((item, i) => {
                    return (
                        <span key= {i} onClick={() => this.johnRoom(item)} > {item} </span>
                    )
                })}
                {!gameMode && <div>
                    <h3>Select game mode</h3>
                    <button onClick={() => this.selectGameMode('multy')}>Multiple players</button>
                    <button onClick={() => this.selectGameMode('single')}>Player vs computer</button>
                </div>
                }
                { hostName && gameMode && <CaroGame isClickX={isClickX} gameMode={gameMode} hostName={hostName} />}
            </div >
        )
    }
}
