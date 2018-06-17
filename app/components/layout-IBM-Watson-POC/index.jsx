import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroGame from './CaroGame'

// const row = 20;
// const col = 40;

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
        gameMode: ''
    }

    componentWillMount() {
        console.log('----------componentWillMount home')
        const { flux } = this.context
        // console.log(flux.stores.helmet.state)
        flux.getActions('helmet').update({ title: 'home page title', description: 'home page description' })
        flux.getActions('users').index()
    }

    componentDidMount() {

    }

    toggleDarkTheme(e) {
        if (e.checked) {
            document.body.classList.add('dark-theme')
        } else {
            document.body.classList.remove('dark-theme')
        }
    }

    selectGameMode(value) {
        this.setState({gameMode: value})
    }

    render() {
        console.log('----------render')
        const { gameMode, isClickX } = this.state;
        return (
            <div>
                <h1>Caro Game</h1>
                <label><input type="checkbox" name="vehicle" onChange={(e) => this.toggleDarkTheme(e.target)}/>Dark Theme</label>
                {!gameMode && <div>
                    <h3>Select game mode</h3>
                    <button onClick={() => this.selectGameMode('multy')}>Multy player</button>
                    <button onClick={() => this.selectGameMode('single')}>Player vs computer</button>
                </div>
                }
                {gameMode && <CaroGame isClickX={isClickX} gameMode={gameMode}/>}
            </div >
        )
    }
}
