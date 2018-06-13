import React, { Component } from 'react'
// import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroSquare extends Component {
    static propTypes = {

    }
    static contextTypes = {

    }

    state = {

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        console.log('----------render')

        return (
            <div className="square">
               
            </div >
        )
    }
}
