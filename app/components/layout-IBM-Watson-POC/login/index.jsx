import React, { Component, PropTypes } from 'react'
import Validate from '../validate'

export default class Login extends Component {
    static propTypes = {
      onChangeRenderLogin: PropTypes.func
    }
    static contextTypes = {
       
    }

    state = {
      userName: '',
      passWord: '',
      loginClassName: 'login-form',
      isSubmitReady: false
    }

    componentDidMount() {
      const loginForm = document.querySelector('.login-form')
      loginForm.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          this.onSubmit()
        }
      })
    }

    onChangeText({ e, key }) {
      const { target: { value = '' } = {} } = e
      if (key === 'name') {
        this.refs.validation.checkValidate({ value, maxLength: 19 })
        this.setState({ userName: value })
      } else if (key === 'pass') {
        this.setState({ passWord: value })
      }
    }

    onSubmit() {
      const { userName, loginClassName, isSubmitReady} = this.state

      if (isSubmitReady) {
        const hiddenAll = document.querySelector('.hidden-all')
        const { onChangeRenderLogin } = this.props

        hiddenAll.remove()
        this.setState({ loginClassName: loginClassName.concat(' login-disappear')})
        setTimeout(() => {
        this.setState({ loginClassName: loginClassName.concat(' invisible')})          
        }, 900)
        onChangeRenderLogin({ userName })
      } else if (!userName) {
        alert('User name is required');
      }
    }

    handleSubmitButton({ value } = {}) {
      this.setState({ isSubmitReady: value })
    }

    render() {
      const { userName, passWord, loginClassName, isSubmitReady } = this.state
 
      return (
        <div className={loginClassName} >
          <div className="area-login" >
            <div className="area-text" >
              <div className="zone" >
                <label >User Name</label>
                <input onChange={(e) => this.onChangeText({ e, key: 'name' })} value={userName} />
                <Validate ref="validation" handleSubmitButton={({ value }) => this.handleSubmitButton({ value })} />
              </div>
              <div className="zone" >
                <label >Password</label>
                <input onChange={(e) => this.onChangeText({ e, key: 'pass' })} disabled={true} value={passWord} />
              </div>
            </div>
            <div className="area-submit" >
              <button type="button" className={`btn btn-success ${isSubmitReady ? '' : 'disable-submit'} `} onClick={() => this.onSubmit()} >Submit</button>
            </div>
          </div>
        </div>
      )
    }
}
