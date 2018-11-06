import React, { Component, PropTypes } from 'react'

export default class Validate extends Component {
    static propTypes = {
      onChangeRenderLogin: PropTypes.func,
      handleSubmitButton: PropTypes.func
    }
    static contextTypes = {
       
    }

    state = {
    }

    componentDidMount() {
    }

    checkValidate({ value = '', maxLength } = {}) {
      const { handleSubmitButton } = this.props
      if (value.length > maxLength) {
        handleSubmitButton({ value: false })
        this.setState({ isShowValidate: true, maxLength })
      } else {
        handleSubmitButton({ value: true })
        this.setState({ isShowValidate: false })
      }
    }

    render() { 
      const { maxLength, isShowValidate } = this.state
      return (
        <div className="validate" >
        { isShowValidate && 
          <div> not allow exceed {maxLength} char </div>
        }
        </div>
      )
    }
}
