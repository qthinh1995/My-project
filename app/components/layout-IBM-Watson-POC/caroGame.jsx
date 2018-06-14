import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroSquare from './CaroSquare'

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroGame extends Component {
    static propTypes = {
        caroMap: PropTypes.array,
        onClickSquare: PropTypes.func,
        isClickX: PropTypes.boolean
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
        const { caroMap, onClickSquare, isClickX } = this.props;
        return (
            <div className="caro-board">
                {caroMap.map((row, y) => {
                    return (
                        <div className="row" key={y} >
                            {row.map((square, x) => {
                                return (
                                    <CaroSquare square={square} caroMap={caroMap} x={x} y={y} isClickX={isClickX} onClickSquare={(icon) => onClickSquare({ x, y, icon })} key={x} />
                                )
                            })}
                        </div>
                    )
                })}
            </div >
        )
    }
}
