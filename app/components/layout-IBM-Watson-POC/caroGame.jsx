import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroSquare from './CaroSquare'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroGame extends Component {
    static propTypes = {
        caroMap: PropTypes.array
    }
    // static contextTypes = {

    // }

    // state = {

    // }

    // componentWillMount() {

    // }

    // componentDidMount() {

    // }

    render() {
        console.log('----------render')
        const { caroMap } = this.props;
        return (
            <div className="caro-board">
                {caroMap.map((row) => {
                    return (
                        <div className="row">
                            {row.map((square) => {
                                return (
                                    <CaroSquare square={square} />
                                )
                            })}
                        </div>
                    )
                })}
            </div >
        )
    }
}
