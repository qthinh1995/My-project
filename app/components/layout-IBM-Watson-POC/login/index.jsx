import React, { Component } from 'react'

export default class Login extends Component {
    static propTypes = {
      
    }
    static contextTypes = {
       
    }


    state = {
      userName: '',
      passWord: ''
    }

    onChangeText({ e, key }) {
      if (key === 'name') {
        this.setState({ userName: e.target.value })
      } else if (key === 'pass') {
        this.setState({ passWord: e.target.value })
      }
    }

    render() {
      const { userName, passWord } = this.state
 
      return (
        <div className="login-form" >
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
              <button type="button" className="btn btn-success">Submit</button>
            </div>
          </div>
        </div>
      )
    }
}
