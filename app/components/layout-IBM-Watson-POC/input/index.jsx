import React, { Component, PropTypes } from 'react'
import Validate from '../validate'

export default class Input extends Component {
    static propTypes = {
      keyName: PropTypes.string,
      placeholder: PropTypes.string,
      typeForm: PropTypes.string,
      typeInput: PropTypes.string,
      storeDataUser: PropTypes.func,
      isPassword: PropTypes.func,
      dataInput: PropTypes.object,
      checkAvaiableID: PropTypes.func
    }
    static contextTypes = {
       
    }

    state = {
      value: ''
    }

    onChangeText({ e }) {
      const { dataInput: { typeInput }, storeDataUser } = this.props
      const { target: { value = '' } = {} } = e
      const data = {}

      this.refs.validation.removeErrorMessage()
      data[typeInput] = value
      storeDataUser(data)
      this.setState({ value })      
    }

    checkValidate({ typeForm, typeInput, value }) {
      return this.refs.validation.checkValidate({ typeForm, typeInput, value })
    }

    checkAvailableID() {
      const { dataInput: { typeInput }, typeForm } = this.props
      if (typeForm === 'signup' && typeInput === 'userName') {
        const { checkAvaiableID } = this.props
        checkAvaiableID && checkAvaiableID()
      }
    }

    validateAvailableID({ messError }) {
      this.refs.validation.validateAvailableID({ messError })
    }

    removeMessErrorBK() {
      this.refs.validation.removeMessErrorBK()
    }

    render() {
      const { dataInput: { placeholder, isPassword, autoFocus } } = this.props
      const { value } = this.state
      const type = isPassword ? 'password' : 'text' 
 
      return (
        <div className="zone" >
          <input
            onChange={(e) => this.onChangeText({ e })}
            onBlur={() => this.checkAvailableID()}
            value={value}
            placeholder={placeholder}
            type={type}
            autoFocus={autoFocus} />
          <Validate ref="validation" />
        </div>
      )
    }
}
