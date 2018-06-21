import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
// import CaroSquare from './CaroSquare'
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
        isClickX: PropTypes.bool,
        hasWinner: PropTypes.string
    }

    state = {
        hasWinner: false,
        caroMap: arrayMap,
        isClickX: this.props.isClickX
    }

    onClickSquare({ x, y }) {
        const { caroMap, isClickX } = this.state
        if (!caroMap[y][x]) {
            caroMap[y][x] = isClickX ? 'X' : 'O'
		}
		
		const hasWinner = this.checkWin2({ x, y });
        this.setState({ caroMap, isClickX: !isClickX, hasWinner })
    }

	// point: { direction: 'h' (horizontal) / 'v' (vertical) / 'dl' (diagonal left) / 'dr' (diagonal right)}
	checkWin2({ x, y, point = [] }) {
        const { caroMap } = this.state;
		const lastPosition = caroMap[y][x];
		
		if (point.h === 5 || point.v === 5 
			|| point.dl === 5 || point.dr === 5) {
			return lastPosition;
		}

		if (get(caroMap, `[${y}][${x + 1}]`) === lastPosition) {
			this.checkWin2({ 
				x: x + 1, 
				y, 
				point: point.h + 1
			});
		}

		return false;
	}

	checkNebour({ x, y, ftype = 'X', dir }) {
		const { caroMap } = this.state;
		
		if (dir === 'hl' || dir === 'dl') { x = x - 1; }
		if (dir === 'hr' || dir === 'dr') { x = x + 1; }
		if (dir === 'vl' || dir === 'dl') { y = y - 1; }
		if (dir === 'vr' || dir === 'dr') { y = y + 1; }

		if (caroMap[y][x] !== ftype) {
			return {x, y, dir}
		}

		this.checkNebour({ x, y, ftype, dir });

		return {};
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
        const { caroMap, hasWinner } = this.state;
        return (
            <div className="caro-board">
                {hasWinner && <h2>The winner is {hasWinner}</h2>}
                {caroMap.map((row, y) => {
                    return (
                        <div className="row" key={y} >
                            {row.map((square, x) => {
                                return (
									<div 
										className="square"
										key={ `${x}-${y}` } 
										onClick={ square ? '' : () => this.onClickSquare({x, y})}>
											{ square }
									</div>
                                )
                            })}
                        </div>
                    )
                })}
            </div >
        )
    }
}
