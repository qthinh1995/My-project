//import React, { Component } from 'react'
import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroSquare extends Component {
    static propTypes = {
        square: PropTypes.string,
        onClickSquare: PropTypes.func,
        caroMap: PropTypes.array,
        y: PropTypes.number,
        x: PropTypes.number,
        isClickX: PropTypes.boolean
    }
    static contextTypes = {

    }

    state = {
        square: null,
        isClickX: true
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    onClickSquare() {
        const { caroMap, y, x, onClickSquare, isClickX } = this.props
        if (!caroMap[y][x]) {
            const square = isClickX ? 'X' : 'O'
            onClickSquare(square)
            this.setState({ square })
        }
    }

    render() {
        const { square } = this.state;

        console.log('----------render')

        return (
            <div className="square" onClick={() => this.onClickSquare()} >
               {square}
            </div >
        )
    }
}
