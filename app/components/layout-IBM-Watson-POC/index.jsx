import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import axios from 'axios'
import CaroGame from './CaroGame'
import socketIOClient from 'socket.io-client'
import PopupForm from 'components/layout-IBM-Watson-POC/popup-form'
import Notification from 'components/layout-IBM-Watson-POC/notification'
import { isEmpty, merge } from 'lodash'
import Chat from './Chat'
import Input from 'components/layout-IBM-Watson-POC/input'

let socket = {}
const caroMap = Array(20)
for (let i = 0; i < caroMap.length; i++) {
    caroMap[i] = Array(32).fill(null)
}
const refsInput= {
    login: [ 'input1', 'input2' ],
    signup: [ 'input3', 'input4', 'input5' ],
    changePw: [ 'input6',  'input7', 'input8' ]
}

@connect(({ requests: { inProgress }, session: { session } }) => ({ inProgress, session }))

export default class IBMWatsonPOCHome extends Component {
    static propTypes = {
        inProgress: PropTypes.bool,
        session: PropTypes.object
    }

    static contextTypes = {
        locales: PropTypes.array.isRequired,
        flux: PropTypes.object.isRequired,
        i18n: PropTypes.func.isRequired
    }


    state = {
        isClickX: true,
        hasWinner: false,
        gameMode: 'multy',
        userName: '',
        currentHosts: [],
        roomState: {},
        roomName: '',
        type: '',
        isLogin: false,
        isInRoom: false,
        userID: '',
        isReset: false,
        showChangePwPopUp: false,
        showSignUpPopUp: false,
        password: ''
    }

    dataUser = {
        typeForm: 'login'
    }

    dataInput = {
        id: {
            typeInput: 'userName',
            placeholder: 'User Name',
            isPassword: false,
            autoFocus: true
        },
        password: {
            typeInput: 'password',
            placeholder: 'Password',
            isPassword: true,
            autoFocus: false
        },
        confirmPass: {
            typeInput: 'confirmPass',
            placeholder: 'Confirm Pass',
            isPassword: true,
            autoFocus: false
        },
        currentPass: {
            typeInput: 'currentPass',
            placeholder: 'Current Password',
            isPassword: true,
            autoFocus: true
        },
        newPass: {
            typeInput: 'newPass',
            placeholder: 'New Password',
            isPassword: true,
            autoFocus: false
        },
        ConfirmNewPass: {
            typeInput: 'confirmNewPass',
            placeholder: 'Confirm New Password',
            isPassword: true,
            autoFocus: false
        }
    }

    addNotification() {
        this.notificationDOMRef.current.addNotification({
          title: 'Awesomeness',
          message: 'Awesome Notifications!',
          type: 'success',
          insert: 'top',
          container: 'top-right',
          animationIn: [ 'animated', 'fadeIn' ],
          animationOut: [ 'animated', 'fadeOut' ],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
      }

    componentWillMount() {
        const { flux } = this.context
        flux.getActions('helmet')
        flux.getActions('users').index()
    }

    getURL() {
        return location.href
    }

    componentDidMount() {
        socket = socketIOClient(this.getURL())
        this.socketOn()
    }

    socketOn() {
        socket.on('get user id', (userID) => {
            console.log('userID', userID)
            this.setState({ userID })
        })

        socket.on('john room', (roomState) => {
            this.setState({ roomState, isInRoom: true })
            this.refs.chat.onInRoom({ value: true })
        })

        socket.on('submit user name', userName => {
            const roomName = userName + "'s room";
            setTimeout(() => {
                this.setState({ isLogin: true, userName, roomName })
            }, 1000)
            socket.on('get hosts', currentHosts => {
                this.setState({ currentHosts })
            })
        })

        socket.on('leave room', () => {
            this.setState({ roomState: {}, isInRoom: false })
            this.refs.chat.onInRoom({ value: false })
        })
    }

    toggleDarkTheme(e) {
        if (e.checked) {
            document.body.classList.add('dark-theme')
            return;
        }

        document.body.classList.remove('dark-theme')
    }

    selectGameMode(value) {
        this.setState({ gameMode: value })
    }

    onChangeName(e) {
        this.setState({ userName: e.target.value })
    }
    onChangeRoomName(e) {
        this.setState({ roomName: e.target.value })
    }

    createRoom() {
        const { roomName } = this.state
        if (roomName) {
            socket.emit('john room', { roomName, caroMap, isCreate: true })
        }
    }

    johnRoom(item) {
        socket.emit('john room', { roomName: item })
    }

    onSubmit() {
        const { typeForm } = this.dataUser
        if (typeForm === 'signup') {
            this.signup()
        } else if (typeForm === 'login') {
            this.login()
        } else if (typeForm === 'changePw') {
            this.updatePassword()
        }
    }

    async login() {
        const { userName, password } = this.dataUser

        if (!userName || !password) {
            this.refs.notification.showNotification({ type: 'error', message: 'The ID or password you entered is incorrect' })
        } else {
            const res = await axios.post('/api/login', {
                userName,
                password
            })

            const { data: { status, data }} = res
            if (status === 200) {
                socket.emit('submit user name', userName)
                this.setState({ password })
            } else {
                this.refs.notification.showNotification({ type: 'error', message: data.error.message })
            }
        }
    }

    async signup() {
        const { userName, password, confirmPass, typeForm } = this.dataUser
        const dataCheack = [ 
            { ref: refsInput[typeForm][0], typeInput: 'userName', value: userName },
            { ref: refsInput[typeForm][1], typeInput: 'password', value: password },
            { ref: refsInput[typeForm][2], typeInput: 'confirmPass', value: confirmPass } ]
        let isError = false
        const self = this

        dataCheack.forEach(item => {
            const { ref, typeInput, value } = item
            const result = self.refs[ref].checkValidate({ typeForm, typeInput, value })
            if (result) {
                isError = result
            }
        })
        if (!isError) {
            if (password === confirmPass) {
                const res = await axios.post('/api/signup', {
                    userName,
                    password
                })
                const { data: { status }} = res
                if (status === 200) {
                    this.onClosePopUp()
                    this.refs.notification.showNotification({ type: 'success', message: 'The account has been successfully created' })                    
                } else {
                    this.refs.notification.showNotification({ type: 'error', message: 'Something were wrong' })
                }
            } else {
                this.refs.notification.showNotification({ type: 'error', message: 'Password confirm not match with password' })
            }
        } else {
            this.refs.notification.showNotification({ type: 'warning', message: 'Please fill it correctly as required' })
        }
    }

    async updatePassword() {
        const { userName, password, currentPass, newPass, confirmNewPass, typeForm } = this.dataUser
        const dataCheack = [ 
            { ref: refsInput[typeForm][0], typeInput: 'currentPass', value: currentPass },
            { ref: refsInput[typeForm][1], typeInput: 'newPass', value: newPass },
            { ref: refsInput[typeForm][2], typeInput: 'confirmNewPass', value: confirmNewPass } ]
        let isError = false
        const self = this

        dataCheack.forEach(item => {
            const { ref, typeInput, value } = item
            const result = self.refs[ref].checkValidate({ typeForm, typeInput, value })
            if (result) {
                isError = result
            }
        })
        if (!isError) {
            if (password === currentPass) {
                if (password === newPass) {
                    this.refs.notification.showNotification({ type: 'error', message: 'The new password can not match the current password' })
                } else if (newPass !== confirmNewPass) {
                    this.refs.notification.showNotification({ type: 'error', message: 'Password confirm not match with new password' })
                } else {
                    const res = await axios.put('/api/changepw', {
                        userName,
                        password: newPass
                    })
                    const { data: { status }} = res
                    if (status === 200) {
                        this.onClosePopUp()
                        this.refs.notification.showNotification({ type: 'success', message: 'The Password has change successfully' })                    
                    } else {
                        this.refs.notification.showNotification({ type: 'error', message: 'Something were wrong' })
                    }
                }
            } else {
                this.refs.notification.showNotification({ type: 'error', message: 'The current password is incorrect' })
            }
        } else {
            this.refs.notification.showNotification({ type: 'warning', message: 'Please fill it correctly as required' })
        }
    }

    onLeaveRoom() {
        socket.emit('leave room')
    }

    onHandleRoom(value) {
        this.setState({ isReset: value})
    }

    resetRoom() {
        this.onHandleRoom(false)
        socket.emit('reset room')
    }
    
    onShowSignUpPopUp() {
        this.dataUser.typeForm = 'signup'
        this.setState({ showSignUpPopUp: true })
    }

    onClosePopUp() {
        this.dataUser.typeForm = 'login'
        this.setState({ showSignUpPopUp: false, showChangePwPopUp: false })
    }

    onShowChangePwPopUp() {
        this.dataUser.typeForm = 'changePw'
        this.setState({ showChangePwPopUp: true })
    }

    storeDataUser(data) {
        merge(this.dataUser, data)
    }

    async checkAvaiableID() {
        const { userName } = this.dataUser
        const res = await axios.post('/api/checkid', {
            userName
        })
        const { data: { status, data }} = res
        if (status === 404) {
            this.refs[refsInput.signup[0]].validateAvailableID({ messError: data.error.message })
        } else if (status === 200) {
            this.refs[refsInput.signup[0]].removeMessErrorBK()
        }
    }

    renderListRoom() {
        const { userName, currentHosts } = this.state;
        return (
            <div>
                <h2 className={'area-name'} >
                    {`Hello ${userName}`}
                </h2>
                <div className="room-panel">
                    <div className="custom-list selectable">
                        <h3 className="custom-list-tittle">List room</h3>
                        {currentHosts && currentHosts.map((item, i) => {
                            return (
                                <div className="list-block" key={i} onClick={() => this.johnRoom(item.idRoom)} > <span className="name">{item.roomName}</span>  </div>
                            )
                        })}
                    </div>
                    {/* <div className="create-room">
                        <input className="input-name" onChange={(e) => this.onChangeRoomName(e)} value={roomName} />
                        <input type="button" value="Create Room" onClick={() => this.createRoom()} />
                    </div> */}
                </div>
            </div>
        )
    }

    render() {
        const { gameMode, roomState, isLogin, isInRoom, userID, isReset, showSignUpPopUp, showChangePwPopUp } = this.state;

        return (
            <div className="caro-game" >
                { !isLogin &&
                    <PopupForm
                        ref="popupForm"
                        classNameForm='login-form'
                        classNameSignUp='display-sign-up'
                        onSubmit={() => this.onSubmit()}
                        onShowSignUpPopUp={() => this.onShowSignUpPopUp() } > 
                        <Input ref={refsInput.login[0]} typeForm='login' dataInput={this.dataInput.id} storeDataUser={(value) => this.storeDataUser(value)} />
                        <Input ref={refsInput.login[1]} typeForm='login' dataInput={this.dataInput.password} storeDataUser={(value) => this.storeDataUser(value)} />
                    </PopupForm>
                }
                { showSignUpPopUp &&
                    <PopupForm
                        classNameForm='sign-in-form'
                        classNameBackBtn='display-back-btn'
                        onSubmit={() => this.onSubmit()}
                        onClosePopUp={() => this.onClosePopUp() } >
                        <Input ref={refsInput.signup[0]} typeForm='signup' dataInput={this.dataInput.id} storeDataUser={(value) => this.storeDataUser(value)} checkAvaiableID={() => this.checkAvaiableID()} />
                        <Input ref={refsInput.signup[1]} typeForm='signup' dataInput={this.dataInput.password} storeDataUser={(value) => this.storeDataUser(value)} />
                        <Input ref={refsInput.signup[2]} typeForm='signup' dataInput={this.dataInput.confirmPass} storeDataUser={(value) => this.storeDataUser(value)} />
                    </PopupForm>
                }
                { showChangePwPopUp &&
                    <PopupForm
                        classNameForm='change-pw-form'
                        classNameBackBtn='display-back-btn'
                        onSubmit={() => this.onSubmit()}
                        onClosePopUp={() => this.onClosePopUp() } >
                        <Input ref={refsInput.changePw[0]} typeForm='changePw' dataInput={this.dataInput.currentPass} storeDataUser={(value) => this.storeDataUser(value)} />
                        <Input ref={refsInput.changePw[1]} typeForm='changePw' dataInput={this.dataInput.newPass} storeDataUser={(value) => this.storeDataUser(value)} />
                        <Input ref={refsInput.changePw[2]} typeForm='changePw' dataInput={this.dataInput.ConfirmNewPass} storeDataUser={(value) => this.storeDataUser(value)} />
                    </PopupForm>
                }
                {isInRoom && !isReset &&
                    <button type="button" className="btn btn-info leave-button" onClick={() => this.onLeaveRoom()} >Leave room</button>
                }
                { !isInRoom &&
                    <button
                        type="button" className="btn btn-info create-button" onClick={() => this.createRoom()}>Create room
                    </button>
                } 
                { isInRoom && isReset &&
                    <button
                        type="button" className="btn btn-info reset-button" onClick={() => this.resetRoom()}>Reset room
                    </button>
                }         
                <i className="fa fa-user">
                    <div className="zone" >
                        <div className="handle-user" >
                            <div className="area change-pw" onClick={() => this.onShowChangePwPopUp()} >Change Password </div>
                            <div className="area log-out">Log out</div>
                        </div>
                    </div>
                </i>      
                {/* <label><input type="checkbox" name="vehicle" onChange={(e) => this.toggleDarkTheme(e.target)} />Dark Theme</label> */}
                {isLogin && isEmpty(roomState) && this.renderListRoom()}
                {!gameMode && <div>
                    <h3>Select game mode</h3>
                    <button onClick={() => this.selectGameMode('multy')}>Multiple players</button>
                    <button onClick={() => this.selectGameMode('single')}>Player vs computer</button>
                </div>
                }
                { !isEmpty(roomState) &&
                    <CaroGame roomState={roomState} socket={socket} userID={userID} onHandleRoom={(value) => this.onHandleRoom(value)} />
                }
                { isLogin && <Chat socket={socket} ref="chat" /> }
                <Notification ref='notification' />
            </div >
        )
    }
}
