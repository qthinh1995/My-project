import React, { Component, PropTypes } from 'react'

const MESS_ERROR = [ 'This field is a required', "ID don't allow a special character or white space" ]
let messErrorBK = ''
export default class Validate extends Component {
    static propTypes = {
      onChangeRenderLogin: PropTypes.func,
      handleSubmitButton: PropTypes.func
    }
    static contextTypes = {
       
    }

    state = {
      messError: ''
    }

    componentDidMount() {
    }

    checkValidate({ typeForm, typeInput, value } = {}) {
      if (typeForm === 'signup' || typeForm === 'changePw') {
        let messError = ''
        if (!value) {
          messError = MESS_ERROR[0]
        } else if (typeInput === 'userName' && typeForm === 'signup') {
          const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
          if (format.test(value)) {
            messError = MESS_ERROR[1]
          } else if (messErrorBK) {
            messError = messErrorBK
          }
        }
        this.setState({ messError })
        return messError
      }
      return false
    }

    removeErrorMessage() {
      this.setState({ messError: '' })
    }

    validateAvailableID({ messError }) {
      messErrorBK = messError
      this.setState({ messError })
    }

    removeMessErrorBK() {
      messErrorBK = ''
    }

    render() { 
      const { messError } = this.state
      return (
        <div className="validate" >
        { messError && 
          <div> {messError} </div>
        }
        </div>
      )
    }
}
