import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
// import CaroSquare from './CaroSquare'
import { get } from 'lodash'

const arrayMap = Array(20)
for (let i = 0; i < arrayMap.length; i++) {
    arrayMap[i] = Array(40).fill(null)
}
const nebourArr = [ 'dlt', 'ht', 'vl', 'dlb', 'drt', 'vr', 'drb', 'hb' ];

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
        const { caroMap, isClickX } = this.state;
        const ftype = isClickX ? 'X' : 'O';
        if (!caroMap[y][x]) {
            caroMap[y][x] = ftype;
		}
		
        const hasWinner = this.checkWin({ x, y });
        const border = {};
        nebourArr.forEach(dir => {
            border[dir] = this.checkNebour({ x, y, ftype, dir });
        });
        this.checkWin2({ border })
        this.setState({ caroMap, isClickX: !isClickX, hasWinner })
    }

	// point: { direction: 'h' (horizontal) / 'v' (vertical) / 'dl' (diagonal left) / 'dr' (diagonal right)}
	checkWin2({ border = {} }) {
        const score = {
            h: get(border, 'hb.y') - get(border, 'ht.y') - 1,
            v: get(border, 'vr.x') - get(border, 'vl.x') - 1,
            dl: get(border, 'drb.x') - get(border, 'dlt.x') - 1,
            dr: get(border, 'drt.x') - get(border, 'dlb.x') - 1
        }

        console.log('score:', score, border);
	}

	checkNebour({ x, y, ftype = 'X', dir }) {
		const { caroMap } = this.state;
		
        if ([ 'dlt', 'vl', 'dlb' ].indexOf(dir) > -1) { x--; }
        if ([ 'drt', 'vr', 'drb' ].indexOf(dir) > -1) { x++; }
        if ([ 'dlt', 'ht', 'drt' ].indexOf(dir) > -1) { y--; }
        if ([ 'dlb', 'hb', 'drb' ].indexOf(dir) > -1) { y++; }

        if (x < 0 || y < 0) { return { x, y } }

		if (caroMap[y][x] === ftype) {
			return this.checkNebour({ x, y, ftype, dir });
		}

		return { x, y };
	}

	checkWin({ x, y }) {
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
        const { caroMap, hasWinner, isClickX } = this.state;
        return (
            <div className="caro-board">
                {!hasWinner &&<h2>It's turn: {isClickX ? 'X' : 'O'}</h2>}
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
