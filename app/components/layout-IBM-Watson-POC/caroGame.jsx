import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import { get, set, values, filter, cloneDeep, isEmpty, find } from 'lodash'
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
        userID: PropTypes.string,
        onHandleRoom: PropTypes.func
    }

    state = {
     
    }

    convertPosition({ arrPositionWin = []} = {}) {
        const fristPosition = arrPositionWin[0]
        const lastPosition = arrPositionWin[4]
        const lenghtOfSquare = document.querySelector('.caro-board .square').offsetHeight
        let width = 5 * 100 / 32 
        const left = (fristPosition.x + 0.5) / 32 * 100 + '%'
        const top = (fristPosition.y + 0.5) /20 * 100 + '%'
        let transform = 'rotate(0deg)'
        let marginLeft = -Math.floor(lenghtOfSquare/2)

        if (fristPosition.x !== lastPosition.x && fristPosition.y !== lastPosition.y) {
            marginLeft = marginLeft * Math.sqrt(2)
            width = width * Math.sqrt(2)
            if (fristPosition.x < lastPosition.x) {
                transform = 'rotate(45deg)'
            } else {
                transform = 'rotate(135deg)'
            }
        } else if (fristPosition.x === lastPosition.x) {
            transform = 'rotate(90deg)'
        }
        
        const transformOrigin = -marginLeft + 'px'
        marginLeft = marginLeft + 'px'
        width = width + '%'

        return { width, left, top, display: 'block', transform, transformOrigin, marginLeft }
    }

    onClickSquare({ x, y }) {
        const { roomStatus, nextType, thisUser: { player } } = this.state;
        if (roomStatus === 'Playing' && player === nextType) {
            let infoWinner = {}
            nebourArr.every((arrDir) => {
                infoWinner = this.checkWin({ originX: x, originY: y, x, y, arrDir });
                if (infoWinner.count === 4) {
                    return false;
                }
                return true
            });
            const isWinner = this.checkFinalWin({ infoWinner, player })
            let style = {}
            if (isWinner) {
                style = this.convertPosition({ arrPositionWin: infoWinner.arrPositionWin })
            }
            socket.emit('handle caro map', { x, y, player, isWinner, style })                   
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
                return a.y - b.y ? a.y - b.y : a.x - b.x
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
        this.getMoreInfo(this.state, this.props.roomState)
    }

    componentDidMount() {
        this.receive()        
    }

    getMoreInfo(currentState, roomState) {
        if (roomState.listUser) {
            const thisUser = find(currentState.listUser, (o) => {
                return o.id === this.state.userID;
            })
            currentState.thisUser = thisUser;
        }
    }

    merge(mergeObj, newValue) {
        Object.keys(newValue).forEach((propertyName) => {
            mergeObj[propertyName] = newValue[propertyName];
        }) 
    }

    receive() {
        socket.on('get room current state', (roomState) => {
            const { playerWinner } = roomState
            const { thisUser: { isHost } } = this.state

            if (playerWinner && isHost) {
                const { onHandleRoom } = this.props
                onHandleRoom(true)
            }
            const currentState = cloneDeep(this.state);
            this.merge(currentState, roomState);
            this.getMoreInfo(currentState, roomState)
            this.setState(currentState)
        })
    }

    componentWillUnmount() {
        socket.off('get room current state')
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
    
    selectType(type) {
        socket.emit('change type', { type })
    }

    removeUser({ id } = {}) {
        console.log(id)
        socket.emit('remove user', id)
    }

   renderButtonStart() {
        const { thisUser, availableType: { isTypeX, isTypeY } } = this.state;
        if (thisUser.player) {
            if (!thisUser.isHost) {
                return (
                    <input type="button" className="btn btn-info btn-ready" value="Ready" onClick={() => socket.emit('ready')}/>
                )
            }

            const oponentIndex = thisUser.player === 'O' ? isTypeX : isTypeY;
            const {listUser} = this.state;
            const isActive = oponentIndex === -1 ? false : listUser[oponentIndex].ready;
            return (
                <input type="button" className="btn btn-info btn-ready" value="Start" disabled={!isActive} onClick={() => socket.emit('start')}/>
            )
        }
        return (
            <div className="center" >
                <div>Total time</div>
                <div className="time-counter">
                    10:50
                </div>
            </div>
        );
    }

    renderGameMessage() {
        const { roomStatus, playerWinner, thisUser: { player } } = this.state;
        const typePlayer = player === 'X' ? 'x-player' : 'o-player'
        const wrapColor = playerWinner ? 'display' : '' 

        if (roomStatus === 'Waiting' || playerWinner) {
            return (
                <div className={`wrapper ${wrapColor} ${typePlayer}`}> 
                    <div className="game-message">{playerWinner ? `${playerWinner} win` : 'Waiting'}</div>
                </div>
            )
        }
        return '';
    }

    render() {
        const { caroMap, playerWinner, listUser, thisUser, availableType: { isTypeX, isTypeY }, style, nextType, thisUser: { player }, roomStatus } = this.state;
        let userClassNAme = player === 'O' ? 'O-player' : '';
        userClassNAme = player  === 'X' ? 'X-player' : userClassNAme;

        return (
            <div className="caro-match">      
                <div className="custom-list">
                    <h3 className="custom-list-tittle">Users in room</h3>
                    {listUser && listUser.map((user, index) => {
                        return (
                            <div className={`list-block ${user.id === thisUser.id ? 'this-user' : ''}`} key={index}>
                                <div className="name">{user.userName}</div>
                                {user.player &&
                                    <span className="user-rule">
                                        {user.player}
                                    </span>
                                }
                                {!user.player &&
                                    <span className="user-guest">
                                        Guest
                                    </span>
                                }

                                {user.isHost &&
                                    <i className="fa fa-key"></i>
                                }
                                {/* {!user.isHost && thisUser.isHost &&
                                <div className="area-control" >
                                    <i className="fa fa-ellipsis-v there-dot" ></i>
                                    <div className="menu-control" >
                                        <div className="option" onClick={() => this.removeUser({ id: user.id })} >
                                            remove guest
                                        </div>
                                        <div className="option" >
                                            ib riêng nhẹ
                                        </div>
                                    </div>
                                </div>
                                } */}
                            </div>
                        )
                    })}
                </div>
                <div className="right-board">
                    <div className={`caro-board ${userClassNAme} ${nextType === player && roomStatus !== 'Waiting' && !playerWinner ? '' : 'hidden-hover'} `}>
                        { this.renderGameMessage() }
                        <div className='border-win' style={style} />
                        {caroMap && caroMap.map((row, y) => {
                            return (
                                <div className="row-caro" key={y} >
                                    {row.map((square, x) => {
                                        const value = get(square, 'value')
                                        let color = value === 'O' ? 'square-blue' : 'empty-square';
                                        color =  value === 'X' ? 'square-red' : color;
                                        return (
                                            <div
                                                className={`square ${color} `}
                                                key={`${x}-${y}`}
                                                onClick={playerWinner || (value && !playerWinner) ? '' : () => { this.onClickSquare({ x, y }) }}>
                                                {value}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    <div className="user-board">
                        <div className={`user-area ${isTypeX > -1 ? 'choose-typeX' : ''}`} onClick={isTypeX > -1 ? '' : () => this.selectType('X')} >
                            <div className="center" >
                                <div>{isTypeX > -1 ? listUser[isTypeX].userName : ''}</div>
                                <div className="label">
                                    X
                                </div>
                                <div className="notch"/>
                            </div>
                        </div>
                        <div className="user-area time-area">
                            {this.renderButtonStart()}
                        </div>
                        <div className={`user-area ${isTypeY > -1 ? 'choose-typeY' : ''}`} onClick={isTypeY > -1 ? '' : () => this.selectType('O')} >
                            <div className="center" >
                                <div>{isTypeY > - 1 ? listUser[isTypeY].userName : ''}</div>
                                <div className="label">
                                    O
                                </div>
                                <div className="notch"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}
