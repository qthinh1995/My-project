import React, { Component, PropTypes } from 'react'
import UserChat from './userChat'

// import connect from 'connect-alt'

// @connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))
let socket = {};

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
        info: {
            mode: 'global',
            reference: 'messageArea1'
        }
    }

    componentWillMount() {
        socket = this.props.socket;
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

    render() {
        const { info: { mode }, info } = this.state
        const globalRoom = mode === 'global'
        const gameRoom = mode === 'in game'
        // const privateRoom = mode === 'private'

        return (
          <div className="chat-area" >
            <div className={`disappear ${globalRoom ? 'visiable' : ''} `} >
                <UserChat socket={socket} info={info} reference='messageArea1' />
            </div>
            <div className={`disappear ${gameRoom ? 'visiable' : ''} `} >
                <UserChat socket={socket} info={info} reference='messageArea2' />
            </div>
            {/* <div className={`disappear ${privateRoom ? 'visiable' : ''} `} >
                <UserChat socket={socket} info={info} />
            </div> */}
            <input className="button-room" type="button" value="global room" onClick={() => this.onChooseRoom('global')} />
            <input className="button-room" type="button" value="in game room" onClick={() => this.onChooseRoom('in game')} />
            {/* <input className="button-room" type="button" value="private room" onClick={() => this.onChooseRoom('private')} /> */}
          </div>
        )
    }
}
