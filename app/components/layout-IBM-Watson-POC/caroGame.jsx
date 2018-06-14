import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroSquare from './CaroSquare'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroGame extends Component {
    static propTypes = {
        caroMap: PropTypes.array,
        onClickSquare: PropTypes.func
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
        const { caroMap, onClickSquare } = this.props;
        return (
            <div className="caro-board">
                {caroMap.map((row, y) => {
                    return (
                        <div className="row" key={y} >
                            {row.map((square, x) => {
                                return (
                                    <CaroSquare square={square} onClickSquare={() => onClickSquare({ x, y })} key={x} />
                                )
                            })}
                        </div>
                    )
                })}
            </div >
        )
    }
}
