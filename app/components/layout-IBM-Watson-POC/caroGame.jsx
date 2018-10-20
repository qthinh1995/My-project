import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import UserChat from './userChat'
import { get, set, values, filter, cloneDeep, isEmpty, merge, find } from 'lodash'
// import socketIOClient from 'socket.io-client';


const nearbyPoints = []
const futureNearbyPoints = {}
// const squareChecked = []
const nebourArr = [ [ 'dlt', 'drb' ], [ 'ht', 'hb' ], [ 'drt', 'dlb' ], [ 'vr', 'vl' ] ];
let i = 0
// const endpoint = 'http://localhost:999'
let socket = {};

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))
export default class CaroGame extends Component {
    static propTypes = {
        socket: PropTypes.object,
        roomState: PropTypes.object,
        userID: PropTypes.string
    }

    state = {
     
    }

    onClickSquare({ x, y }) {
        const { nextType, thisUser: {player} } = this.state;
        // const ftype = isClickX ? 'X' : 'O';
        if (player === nextType) {
            let infoWinner = {}
            nebourArr.every((arrDir) => {
                infoWinner = this.checkWin({ originX: x, originY: y, x, y, arrDir });
                if (infoWinner.count === 4) {
                    return false;
                }
                return true
            });
            const isWinner = this.checkFinalWin({ infoWinner, player })
            socket.emit('handle caro map', { x, y, player, isWinner })                   
        }
    }

    checkWin({ originX, originY, x, y, count = 0, arrDir = [], dir = arrDir[0], arrPositionWin = [] } = {}) {
        const { caroMap, nextType } = this.state;
        if ([ 'dlt', 'vl', 'dlb' ].indexOf(dir) > -1) { x--; }
        if ([ 'drt', 'vr', 'drb' ].indexOf(dir) > -1) { x++; }
        if ([ 'dlt', 'ht', 'drt' ].indexOf(dir) > -1) { y--; }
        if ([ 'dlb', 'hb', 'drb' ].indexOf(dir) > -1) { y++; }

		if (get(caroMap, `[${y}][${x}].value`) === nextType) {
            arrPositionWin.push({ x, y })
            count++
            if (count === 4) {
                arrPositionWin.push({ x: originX, y: originY })
                return { count, arrPositionWin }
            } else {
                return this.checkWin({ originX, originY, x, y, count, arrDir, dir, arrPositionWin })
            }
        } else if (!isEmpty(arrDir)) {
            dir = arrDir[1]
            return this.checkWin({ originX, originY, x: originX, y: originY, count, dir, arrPositionWin })
        }

        return { count, arrPositionWin }
    }

    checkFinalWin({ infoWinner }) {
        const { caroMap, nextType } = this.state;        
        const { count, arrPositionWin } = infoWinner

        if (count === 4) {
            arrPositionWin.sort((a, b) => {
                return a.x - b.x ? a.x - b.x : a.y - b.y
            })
            const constOfChangeX = Math.abs(arrPositionWin[0].x - arrPositionWin[1].x)
            const constOfChangeY = Math.abs(arrPositionWin[0].y - arrPositionWin[1].y)
            const firstValue = { x: arrPositionWin[0].x - constOfChangeX, y: arrPositionWin[0].y - constOfChangeY }
            const lastValue = { x: arrPositionWin[4].x + constOfChangeX, y: arrPositionWin[4].y + constOfChangeY }
            const type = nextType === 'X' ? 'O' : 'X'
            return !(get(caroMap, `[${firstValue.y}][${firstValue.x}].value`) === type &&
                get(caroMap, `[${lastValue.y}][${lastValue.x}].value`) === type)
        }
        return false
    }

    componentWillMount() {
        socket = this.props.socket;
        this.state = this.props.roomState;
        this.state.userID = this.props.userID;

        const thisUser = find(this.props.roomState.listUser, (o) => {
            return o.id === this.state.userID;
        })
        this.state.thisUser = thisUser;
        this.receive();
    }

    getRoomStateFromSv() {
        socket.emit('get room current state')
    }

    receive() {
        socket.on('get room current state', (roomState) => {
            const currentState = cloneDeep(this.state)
            merge(currentState, roomState)

            const thisUser = find(currentState.listUser, (o) => {
                return o.id === this.state.userID;
            })
            currentState.thisUser = thisUser;
            this.setState(currentState)
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

    render() {
        const { caroMap, isWinner, nextType, listUser } = this.state;
        return (
            <div className="caro-match">
                    <div className="list-user">
                        <h3>Users in room</h3>
                        { listUser && listUser.map((user, index) => {
                            return (
                                <div key={index}>{user.userName}</div>
                            )
                        })}
                    </div>
                }
                <div className="caro-board row">
                    {/* {!isWinner && <h2>It's turn: {nextType}</h2>} */}
                    {!isWinner &&
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
                    {isWinner && <h2>The winner is {nextType}</h2>}
                    {/* <button onClick={() => this.simulator()}> Click </button> */}
                    {caroMap && caroMap.map((row, y) => {
                        return (
                            <div className="row" key={y} >
                            {row.map((square, x) => {
                                const isNear = !!get(square, 'isNear')
                                const value = get(square, 'value')
                                return (
									<div 
										className={`square ${isNear ? 'near-square' : ''} `}
										key={ `${x}-${y}` } 
										onClick={ isWinner || (value && !isWinner)? '' : () => {  this.onClickSquare({x, y}) }}>
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
