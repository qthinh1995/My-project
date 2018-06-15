import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
// import { cloneDeep } from 'lodash'
import CaroGame from './CaroGame'

// const row = 20;
// const col = 40;
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
        caroMap: arrayMap,
        isClickX: true,
        hasWinner: false
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

    onClickSquare({ x, y, icon }) {
        const { caroMap, isClickX } = this.state
        caroMap[y][x] = icon
        const hasWinner = this.checkWin(x, y);
        this.setState({ caroMap, isClickX: !isClickX, hasWinner })
        // this.checkWin(x, y);
    }

    checkWin(x, y) {
        const { caroMap } = this.state;
        const lastPosition = caroMap[y][x];
        let count = 0;
        for (let u = -4; u < 5; u++) {
            if (caroMap[y][x + u] === lastPosition) {
                count++;
            } else {
                count = 0;
            }
            if (count === 5) {
                return lastPosition;
            }
        }

        count = 0;
        for (let u = -4; u < 5; u++) {
            if (caroMap[y + u][x] === lastPosition) {
                count++;
            } else {
                count = 0;
            }
            if (count === 5) {
                return lastPosition;
            }
        }

        count = 0;
        for (let u = -4; u < 5; u++) {
            if (caroMap[y + u][x + u] === lastPosition) {
                count++;
            } else {
                count = 0;
            }
            if (count === 5) {
                return lastPosition;
            }
        }
       
        count = 0;
        for (let u = -4; u < 5; u++) {
            if (caroMap[y - u][x + u] === lastPosition) {
                count++;
            } else {
                count = 0;
            }
            if (count === 5) {
                return lastPosition;
            }
        }
        
        return false;
    }
    toggleDarkTheme(e) {
        if (e.checked) {
            document.body.classList.add('dark-theme')
        } else {
            document.body.classList.remove('dark-theme')
        }
    }

    render() {
        console.log('----------render')
        const { caroMap, isClickX, hasWinner } = this.state;
        return (
            <div>
                <h1>
                    Caro Game
                </h1>
                <input type="checkbox" name="vehicle" value="Bike" onChange={(e) => this.toggleDarkTheme(e.target)}/>Dark Theme
                <div className="input-group mb-3">
                    <CaroGame hasWinner={hasWinner} caroMap={caroMap} isClickX={isClickX} onClickSquare={({ x, y, icon }) => this.onClickSquare({ x, y, icon })} />
                </div>
            </div >
        )
    }
}
