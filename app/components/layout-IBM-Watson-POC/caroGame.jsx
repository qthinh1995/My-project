import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import UserChat from './userChat'
import { get, set, values, filter, cloneDeep } from 'lodash'
// import socketIOClient from 'socket.io-client';


const nearbyPoints = []
const futureNearbyPoints = {}
// const squareChecked = []
const nebourArr = [ 'dlt', 'ht', 'vl', 'dlb', 'drt', 'vr', 'drb', 'hb' ];
let i = 0
// const endpoint = 'http://localhost:999'
let socket = {};

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))
export default class CaroGame extends Component {
    static propTypes = {
        caroMap: PropTypes.array,
        onClickSquare: PropTypes.func,
        isClickX: PropTypes.bool,
        hasWinner: PropTypes.string,
        hostName: PropTypes.string,
        socket: PropTypes.object,
        gameMode: PropTypes.string,
        arrayMap: PropTypes.array,
        type: PropTypes.string
    }

    state = {
        isWinner: false,
        caroMap: this.props.arrayMap,
        gameMode: this.props.gameMode,
        endpoint: '',
        allowType: 'X'
    }

    onClickSquare({ x, y }) {
        const { allowType, caroMap } = this.state;
        const { hostName, type } = this.props
        // const ftype = isClickX ? 'X' : 'O';
        if (type === allowType) {
            let infoWinner = {}
            nebourArr.every((dir) => {
                infoWinner = this.checkWin({ x, y, caroMap, lastPosition: type, dir });
                if (infoWinner.count === 4) {
                    return false;
                }
                return true
            });
            const isWinner = this.checkFinalWin({ caroMap, infoWinner, type })
            socket.emit('handle caro map', { x, y, roomName: hostName, type, isWinner })                   
            // set(caroMap, `[${y}][${x}].value`, ftype);
            // squareChecked.push({ x, y, value: ftype })
        }
        
        
        // const border = this.getNebours();
        // this.checkWin2({ border })

        // nearbyPoints = this.positionNearly({ value, x, y, caroMap })
        // this.setState({ caroMap, isClickX: !isClickX })
    }

    checkFinalWin({ caroMap, infoWinner, type }) {
        const { count, arrPositionWin } = infoWinner
        if (count === 4) {
            const constOfChangeX = Math.abs(arrPositionWin[0].x - arrPositionWin[1].x)
            const constOfChangeY = Math.abs(arrPositionWin[0].y - arrPositionWin[1].y)
            const firstValue = { x: arrPositionWin[0].x - constOfChangeX, y: arrPositionWin[0].y - constOfChangeY }
            const lastValue = { x: arrPositionWin[4].x + constOfChangeX, y: arrPositionWin[0].y + constOfChangeY }
            return get(caroMap, `[${firstValue.y}][${firstValue.x}].value`) !== type || get(caroMap, `[${lastValue.y}][${lastValue.x}].value`) !== type
        }
        return false
    }

    componentDidMount() {
        // const { caroMap, isClickX } = this.state;
        // socket.emit('get current state')
        socket = this.props.socket;
        this.receive()                
    }

    receive() {
        socket.on('handle caro map', ({ caroMap = {}, nextType = '', isWinner } = {}) => {
            this.setState({ caroMap, allowType: nextType, isWinner })
        })
        socket.on('get current state', ({ caroMap, isClickX }) => {
            this.setState({ caroMap, isClickX })
        })
    }

    componentDidUpdate() {

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
    
    positionNearly({ value = [], x = '', y= '', caroMap }) {
        set(caroMap, `[${y}][${x}].isNear`, false);
        let arrNearPoints = cloneDeep(nearbyPoints)
        // remove location has been click
        arrNearPoints = filter(arrNearPoints, o => {
            return !(o.x === x && o.y ===y)
        })
        value.forEach(item => {
            if (!get(caroMap, `[${item.y}][${item.x}].isNear`) && !get(caroMap, `[${item.y}][${item.x}].value`)) {
                set(caroMap, `[${item.y}][${item.x}].isNear`, true);
                arrNearPoints.push({ x: item.x, y: item.y })
            }
        })
        return arrNearPoints
    }

    simulator() {
        const { isClickX } = this.state;
        const caroMap = cloneDeep(this.state.caroMap)
        const ftype = isClickX ? 'X' : 'O';
        // nearbyPoints.forEach(item => {
        //     const border = {};
        //     nebourArr.forEach(dir => {
        //         border[dir] = this.checkNebour({ x: item.x, y: item.y, ftype, dir });
        //     });

        //     const value = values(border)

        //     this.positionNearly({ value, x: item.x, y: item.y, caroMap })
        // })
        const item = nearbyPoints[i]
        const border = {};
        nebourArr.forEach(dir => {
            border[dir] = this.checkNebour({ x: item.x, y: item.y, ftype, dir });
        });

        const value = values(border)

        futureNearbyPoints[i] = this.positionNearly({ value, x: item.x, y: item.y, caroMap })
        i++;
        console.log(futureNearbyPoints)
    }

    // simulatorAI() {
    //     nearbyPoints.forEach(item => {

    //     })
    // }

    getNebours(x, y) {
        const { isClickX } = this.state;
        const border = {};
        const ftype = isClickX ? 'X' : 'O';        
        nebourArr.forEach(dir => {
            border[dir] = this.checkNebour({ x, y, ftype, dir });
        });
        return values(border)
    }

	checkNebour({ x, y, ftype = 'X', dir }) {
		const { caroMap } = this.state;
        
        if ([ 'dlt', 'vl', 'dlb' ].indexOf(dir) > -1) { x--; }
        if ([ 'drt', 'vr', 'drb' ].indexOf(dir) > -1) { x++; }
        if ([ 'dlt', 'ht', 'drt' ].indexOf(dir) > -1) { y--; }
        if ([ 'dlb', 'hb', 'drb' ].indexOf(dir) > -1) { y++; }

        if (x < 0 || y < 0) { return { x, y } }

		if (get(caroMap, `[${y}][${x}].value`) === ftype) {
			return this.checkNebour({ x, y, ftype, dir });
        }
        
		return { x, y };
	}

    checkWin({ x, y, caroMap, lastPosition, count = 0, dir, arrPositionWin = [] } = {}) {
        arrPositionWin.push({ x, y })
        if ([ 'dlt', 'vl', 'dlb' ].indexOf(dir) > -1) { x--; }
        if ([ 'drt', 'vr', 'drb' ].indexOf(dir) > -1) { x++; }
        if ([ 'dlt', 'ht', 'drt' ].indexOf(dir) > -1) { y--; }
        if ([ 'dlb', 'hb', 'drb' ].indexOf(dir) > -1) { y++; }

        if (x < 0 || y < 0) {
            return { count, arrPositionWin }
        }

		if (get(caroMap, `[${y}][${x}].value`) === lastPosition) {
            count++
            if (count === 4) {
                arrPositionWin.push({ x, y })
                return { count, arrPositionWin }
            } else {
                return this.checkWin({ x, y, caroMap, lastPosition, count, dir, arrPositionWin })
            }
        }

        return { count, arrPositionWin }
    }

    render() {
        const { caroMap, isWinner, allowType } = this.state;
        const { gameMode } = this.props
        return (
            <div className="caro-match">
                {gameMode === 'multy' &&
                    <div className="list-user">
                        <h3>Users in room</h3>
                        <div>user 1</div>
                        <div>user 2</div>
                    </div>
                }
                <div className="caro-board row">
                    {/* {!isWinner && <h2>It's turn: {allowType}</h2>} */}
                    {!isWinner && gameMode === 'multy' &&
                        <div className="user-board row">
                        <div className="col-sm-4">
                            <h3>User 1</h3>
                            <div className="label">
                                X
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <h3>Total time</h3>
                            <div className="time-counter">
                                 10:50
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <h3>User 2</h3>
                            <div className="label">
                                O
                            </div>
                        </div>
                        </div>
                    }
                    {isWinner && <h2>The winner is {allowType}</h2>}
                    {/* <button onClick={() => this.simulator()}> Click </button> */}
                    {caroMap.map((row, y) => {
                        return (
                            <div className="row" key={y} >
                            {row.map((square, x) => {
                                const isNear = !!get(square, 'isNear')
                                const value = get(square, 'value')
                                return (
									<div 
										className={`square ${isNear ? 'near-square' : ''} `}
										key={ `${x}-${y}` } 
										onClick={ isWinner || (value && !isWinner)? '' : () => { gameMode === 'multy' ? this.onClickSquare({x, y}) : this.onClickSquareSingle({x, y}) }}>
											{ value }
									</div>
                                )
                            })}
                        </div>
                        )
                    })}
                </div>
                <UserChat/>
            </div>
        )
    }
}
