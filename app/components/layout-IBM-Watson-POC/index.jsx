import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
// import { cloneDeep } from 'lodash'
import CaroGame from './CaroGame'

// const row = 20;
// const col = 40;
const arrayMap = Array(20)
for (let i = 0; i < arrayMap.length; i++) {
    arrayMap[i] =  Array(40).fill(null)
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
        isClickX: true
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
        this.setState({ caroMap, isClickX: !isClickX })
        // this.checkWin(x, y);
    }

    render() {
        console.log('----------render')
        const { caroMap, isClickX} = this.state;
        return (
            <div>
                <h1>
                    Caro Game
                </h1>
                <div className="input-group mb-3">
                    <CaroGame caroMap = {caroMap} isClickX={isClickX} onClickSquare={({ x, y, icon }) => this.onClickSquare({ x, y, icon })} />
                </div>
            </div >
        )
    }
}
