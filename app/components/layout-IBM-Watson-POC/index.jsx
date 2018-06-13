import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroGame from './CaroGame'


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
        caroMap: Array(9).fill(Array(9).fill(null))
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

    render() {
        console.log('----------render')
        const {caroMap} = this.state;
        return (
            <div>
                <h1>
                    Caro Game
                </h1>
                <div className="input-group mb-3">
                    <CaroGame caroMap = {caroMap} />
                </div>
            </div >
        )
    }
}
