import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import CaroSquare from './CaroSquare'
import { get } from 'lodash'

const arrayMap = Array(20)
for (let i = 0; i < arrayMap.length; i++) {
    arrayMap[i] = Array(40).fill(null)
}

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class CaroGame extends Component {
    static propTypes = {
        caroMap: PropTypes.array,
        onClickSquare: PropTypes.func,
        isClickX: PropTypes.boolean,
        hasWinner: PropTypes.string
    }
    // static contextTypes = {

    // }

    state = {
        hasWinner: false,
        caroMap: arrayMap,
        isClickX: this.props.isClickX
    }

    // componentWillMount() {

    // }

    // componentDidMount() {

    // }

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
            if (get(caroMap, `[${y}][${x + u}]`) === lastPosition) {
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
            if (get(caroMap, `[${y + u}][${x}]`) === lastPosition) {
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
            if (get(caroMap, `[${y + u}][${x + u}]`) === lastPosition) {
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
            if (get(caroMap, `[${y - u}][${x + u}]`) === lastPosition) {
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

    render() {
        console.log('----------render')
        const { caroMap, isClickX, hasWinner } = this.state;
        return (
            <div className="caro-board">
                {hasWinner && <h2>The winner is {hasWinner}</h2>}
                {caroMap.map((row, y) => {
                    return (
                        <div className="row" key={y} >
                            {row.map((square, x) => {
                                return (
                                    <CaroSquare square={square} caroMap={caroMap} x={x} y={y} isClickX={isClickX} onClickSquare={hasWinner? '' : (icon) => this.onClickSquare({ x, y, icon })} key={x} />
                                )
                            })}
                        </div>
                    )
                })}
            </div >
        )
    }
}
