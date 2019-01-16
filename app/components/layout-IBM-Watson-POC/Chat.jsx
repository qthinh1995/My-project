import React, { Component, PropTypes } from 'react'
import UserChat from './userChat'
import { isEmpty, cloneDeep } from 'lodash'

// import connect from 'connect-alt'

// @connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))
let socket = {};
let mousePosition = {};
let chatBoardState = {};
let resizeDirection = {};

export default class Chat extends Component {
    static propTypes = {
        socket: PropTypes.object,
        roomName: PropTypes.string,
        idUser: PropTypes.string
    }
    static contextTypes = {

    }


    state = {
        room: 'global room',
        isInRoom: false,
        info: {
            mode: 'global',
            reference: 'messageArea1'
        }
    }

    // componentWillReceiveProps(nextProps) { 
    //     const { isInRoom } = this.props
    //     const { newIsInRoom} = nextProps
    //     if (isInRoom !== newIsInRoom) {
    //         this.setState({ isInRoom: newIsInRoom})
    //     }
    // }

    componentWillMount() {
        socket = this.props.socket;
    }

    componentDidMount() {
        const self = this;
        window.addEventListener('mouseup', () => {
            if (mousePosition) {
                self.onStopDragChatBoard()
            }
        })
    }

    onChooseRoom(type = '') {
        let { info } = this.state

        if (type === 'global') {
            info = {
                mode: type,
                reference: 'messageArea1'
            }
        } else if (type === 'in game') {
            info = {
                mode: type,
                reference: 'messageArea2'
            }
        }
        //  else if (type === 'private') {
        //     const { idUser = ''} = this.props

        //     info = {
        //         mode: type,
        //         idUser
        //     }
        // }

        this.setState({ info })
    }

    onInRoom({ value = false } = {}) {
        this.setState({ isInRoom: value })
    }
    
    getPosition(chatBoard) {
        const rect = chatBoard.getBoundingClientRect();
        const {height, width, top, left} = rect;

        chatBoardState = { left: left - 2, top: top - 2, height, width }
    }

    findTheNearest(child, center = { x: '50%', y: '50%'}) {
        const rect = child.getBoundingClientRect();
		const { width, height } = rect;
		let { top, left } = rect;
		top = top -2;
		left = left -2;
     
        const childCenter = { x: left + width/2, y: top + height/2, xDirection: 'left', yDirection: 'top'};
        const viewCenter = {x: center.x.indexOf('px') > -1 ? center.x : window.innerWidth * Number.parseInt(center.x, 10)/100, y: center.y.indexOf('px') > -1 ? center.y : window.innerHeight * Number.parseInt(center.y, 10)/100 }

		if (childCenter.x > viewCenter.x) {
			childCenter.x = window.innerWidth - 4 - childCenter.x;
			childCenter.xDirection = 'right';
		}
		if (childCenter.y > viewCenter.y) {
			childCenter.y = window.innerHeight - 4 - childCenter.y;
			childCenter.yDirection = 'bottom';
		}

		const isChoseDirectionX = (viewCenter.x - childCenter.x) > (viewCenter.y - childCenter.y) * ((window.innerWidth - width) / (window.innerHeight - height));

		const newChildCenter = cloneDeep(childCenter);

		isChoseDirectionX ? newChildCenter.x = width/2 : newChildCenter.y = height/2;
		const decrease = isChoseDirectionX? (viewCenter.x - newChildCenter.x) / (viewCenter.x - childCenter.x) : (viewCenter.y - newChildCenter.y) / (viewCenter.y - childCenter.y); 
		isChoseDirectionX ? newChildCenter.y = window.innerHeight / 2 - (viewCenter.y - newChildCenter.y) * decrease :  newChildCenter.x = window.innerWidth / 2 - (viewCenter.x - newChildCenter.x) * decrease;
		
		const removeArr= [ 'top', 'right', 'bottom', 'left' ];
        removeArr.forEach((item) => {
            child.style.removeProperty(item);
        })
		child.style[childCenter.xDirection] = childCenter.x - width /2 + 'px';
		child.style[childCenter.yDirection] = childCenter.y - height/2 + 'px';
		
        setTimeout(() => {
			child.style.transitionDuration = '0.5s';
			child.style.transitionTimingFunction = 'cubic-bezier(0.38, 0.92, 0.47, 1.11)';
			child.style[isChoseDirectionX ? newChildCenter.xDirection : newChildCenter.yDirection] = isChoseDirectionX ? newChildCenter.x - width/2 + 'px': newChildCenter.y - height/2 + 'px';
			child.style[!isChoseDirectionX ? newChildCenter.xDirection : newChildCenter.yDirection] = !isChoseDirectionX ? newChildCenter.x - width/2 + 'px': newChildCenter.y - height/2 + 'px';
        }, 10)
       

        setTimeout(() => {
            child.style.removeProperty('transition-duration');
        }, 1000)
    }
	
    startDragChatBoard(e) {
        mousePosition = { x: e.screenX, y: e.screenY };
        const chatBoard = e.target;

        this.getPosition(chatBoard);

        const {left, top} = chatBoardState;
        
        chatBoard.style.top = top + 'px';
        chatBoard.style.left = left + 'px';
        chatBoard.style.removeProperty('bottom');
        chatBoard.style.removeProperty('right');
        chatBoard.style.cursor = 'all-scroll';

        window.addEventListener('mousemove', this.onDragChatBoard)
    }

    onDragChatBoard(e) {
        if (!isEmpty(mousePosition)) {
            const newPosition = { x: e.screenX, y: e.screenY };
            const chatBoard = document.querySelector('#chatBoard');
            let {left, top} = chatBoardState;

            top = top + newPosition.y - mousePosition.y;
            left = left + newPosition.x - mousePosition.x;

            chatBoard.style.top = top + 'px';
            chatBoard.style.left = left + 'px';
        }
    }

    onStopDragChatBoard() {
        const chatBoard = document.querySelector('#chatBoard');
        this.findTheNearest(chatBoard);
        
        chatBoard.querySelector('.message-area').style.removeProperty('cursor');

        mousePosition = {};
        window.removeEventListener('mousemove', this.onDragChatBoard)
        window.removeEventListener('mousemove', this.onResizeChatBoard)
    }

    startResizeChatBoard(e, direction) {
        resizeDirection = direction;
        e.preventDefault();
        e.stopPropagation();
        mousePosition = { x: e.screenX, y: e.screenY };
        const chatBoard = e.target.parentElement;

        this.getPosition(chatBoard);
        const {left, top} = chatBoardState;

        chatBoard.style.top = top + 'px';
        chatBoard.style.left = left + 'px';
        chatBoard.style.removeProperty('bottom');
        chatBoard.style.removeProperty('right');
        window.addEventListener('mousemove', this.onResizeChatBoard)
    }

    onResizeChatBoard(e) {
        if (!isEmpty(mousePosition) && resizeDirection) {
            const newPosition = { x: e.screenX, y: e.screenY };
            const chatBoard = document.querySelector('#chatBoard');
            let { height, width, top, left } = chatBoardState;
            const {minHeight, maxHeight, minWidth, maxWidth } = chatBoard.style;
            
            height = resizeDirection.top ? height - newPosition.y + mousePosition.y : height + newPosition.y - mousePosition.y;
            width = resizeDirection.left ? width - newPosition.x + mousePosition.x : width + newPosition.x - mousePosition.x;

            if (height > Number.parseInt(minHeight, 10) && height < Number.parseInt(maxHeight, 10)) {
                top = resizeDirection.top ? top + newPosition.y - mousePosition.y : top;
                chatBoard.style.height = height + 'px';
                chatBoard.style.top = top + 'px';
            }
            if (width > Number.parseInt(minWidth, 10) && width < Number.parseInt(maxWidth, 10)) {
                left = resizeDirection.left ? left + newPosition.x - mousePosition.x : left;
                chatBoard.style.width = width + 'px';
                chatBoard.style.left = left + 'px';
            }
        }
    }

    render() {
        const { info: { mode }, info, isInRoom } = this.state
        const globalRoom = mode === 'global'
        const gameRoom = mode === 'in game'
        // const privateRoom = mode === 'private'

        return (
          <div className="chat-area" id="chatBoard" onMouseDown={(e) => this.startDragChatBoard(e)} style={{ maxHeight: '30%', minHeight: '300px', height: '340px', minWidth: '300px', maxWidth: '400px', width: '300px', bottom: 0}}>
			<div className="resize-icon top-left" onMouseDown={(e) => this.startResizeChatBoard(e, {top: true, left: true})}></div>
			<div className="resize-icon top-right" onMouseDown={(e) => this.startResizeChatBoard(e, {top: true, right: true})}></div>
            <div className="resize-icon bottom-left" onMouseDown={(e) => this.startResizeChatBoard(e, {bottom: true, left: true})}></div>
            <div className="resize-icon bottom-right" onMouseDown={(e) => this.startResizeChatBoard(e, {bottom: true, right: true})}></div>

            <div className="resize-icon top" onMouseDown={(e) => this.startResizeChatBoard(e, {top: true})}></div>
            <div className="resize-icon bottom" onMouseDown={(e) => this.startResizeChatBoard(e, {bottom: true})}></div>
            <div className="resize-icon left" onMouseDown={(e) => this.startResizeChatBoard(e, {left: true})}></div>
            <div className="resize-icon right" onMouseDown={(e) => this.startResizeChatBoard(e, {right: true})}></div>
            <UserChat className={`disappear ${globalRoom ? 'visiable' : ''} `} socket={socket} info={info} reference='messageArea1' />          
            <UserChat className={`disappear ${gameRoom ? 'visiable' : ''} `} socket={socket} info={info} reference='messageArea2' />
            <div>
                <div className={`section-room ${globalRoom ? 'is-selected' : ''} `} onClick={() => this.onChooseRoom('global')} >
                    global room
                </div>
                { isInRoom && 
                    <div className={`section-room ${gameRoom ? 'is-selected' : ''} `} onClick={() => this.onChooseRoom('in game')} >
                        in game
                    </div>
                }
            </div>
            {/* <div className={`disappear ${privateRoom ? 'visiable' : ''} `} >
                <UserChat socket={socket} info={info} />
            </div> */}
            {/* <input className="button-room" type="button" value="private room" onClick={() => this.onChooseRoom('private')} /> */}
          </div>
        )
    }
}
