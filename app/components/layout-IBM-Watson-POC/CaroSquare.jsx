//import React, { Component } from 'react'
import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroSquare extends Component {
    static propTypes = {
        square: PropTypes.int
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
        const {square} = this.props;
        console.log('----------render')

        return (
            <div className="square">
               {square}
            </div >
        )
    }
}
