import React, { Component, PropTypes } from 'react'

export default class Login extends Component {
    static propTypes = {
      onChangeRenderLogin: PropTypes.func
    }
    static contextTypes = {
       
    }

    state = {
      userName: '',
      passWord: '',
      loginClassName: 'login-form'
    }

    onChangeText({ e, key }) {
      if (key === 'name') {
        this.setState({ userName: e.target.value })
      } else if (key === 'pass') {
        this.setState({ passWord: e.target.value })
      }
    }

    onSubmit() {
      const { onChangeRenderLogin } = this.props
      const { userName, loginClassName} = this.state

      this.setState({ loginClassName: loginClassName.concat(' login-disappear')})
      onChangeRenderLogin({ userName })
    }

    render() {
      const { userName, passWord, loginClassName } = this.state
 
      return (
        <div className={loginClassName} >
          <div className="area-login" >
            <div className="area-text" >
              <div className="zone" >
                <label >User Name</label>
                <input onChange={(e) => this.onChangeText({ e, key: 'name' })} value={userName} />
              </div>
              <div className="zone" >
                <label >Password</label>
                <input onChange={(e) => this.onChangeText({ e, key: 'pass' })} disabled={true} value={passWord} />
              </div>
            </div>
            <div className="area-submit" >
              <button type="button" className="btn btn-success" onClick={() => this.onSubmit()} >Submit</button>
            </div>
          </div>
        </div>
      )
    }
}
