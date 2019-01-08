import React, { Component, PropTypes } from 'react'
// import Validate from '../validate'

export default class PopupForm extends Component {
    static propTypes = {
      onSubmit: PropTypes.func,
      onShowSignUpPopUp: PropTypes.func,
      children: PropTypes.array,
      classNameSignUp: PropTypes.string,
      classNameForm: PropTypes.string,
      onClosePopUp: PropTypes.func,
      classNameBackBtn: PropTypes.string
    }
    static contextTypes = {
       
    }

    state = {
      userName: '',
      password: '',
      isSubmitReady: true
    }

    componentDidMount() {
      const { classNameForm } = this.props
      const loginForm = document.querySelector(`.${classNameForm}`)
      loginForm.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          this.onSubmit()
        }
      })
    }

    onChangeText({ e, key }) {
      const { target: { value = '' } = {} } = e
      if (key === 'name') {
        // this.refs.validation.checkValidate({ value, maxLength: 19 })
        this.setState({ userName: value })
      } else if (key === 'pass') {
        this.setState({ password: value })
      }
    }

    onSubmit() {
        const { onSubmit } = this.props
        const hiddenAll = document.querySelector('.hidden-all')

        hiddenAll && hiddenAll.remove()
        onSubmit()
    }

    handleSubmitButton({ value } = {}) {
      this.setState({ isSubmitReady: value })
    }

    onShowSignUpPopUp() {
      const { onShowSignUpPopUp } = this.props
      if (onShowSignUpPopUp) {
        onShowSignUpPopUp()
      }
    }

    onClosePopUp(e) {
      const { target: { className = '' }} = e
      if (className.indexOf('sign-in-form') > -1 || className.indexOf('change-pw-form') > -1) {
        const { onClosePopUp } = this.props

        if (onClosePopUp) {
          onClosePopUp()
        }
      }
    }

  onBack() {
    const { onClosePopUp } = this.props

    if (onClosePopUp) {
      onClosePopUp()
    }
  }

    render() {
      const { classNameForm, classNameSignUp = '', classNameBackBtn } = this.props
      const { isSubmitReady } = this.state
 
      return (
        <div className={`popup-form ${classNameForm}`} onClick={(e) => this.onClosePopUp(e)} >
          <div className="area-form" >
            <div className="area-text" >
              {this.props.children}
              {/* <div className="zone" >
                <label >User Name</label>
                <input onChange={(e) => this.onChangeText({ e, key: 'name' })} value={userName} />
                <Validate ref="validation" handleSubmitButton={({ value }) => this.handleSubmitButton({ value })} />
              </div>
              <div className="zone" >
                <label >Password</label>
                <input onChange={(e) => this.onChangeText({ e, key: 'pass' })} value={password} />
              </div> */}
            </div>
            <div className="area-submit" >
              <div className={`more-action ${classNameSignUp}`} onClick={() => this.onShowSignUpPopUp()} >Sign up?</div>
              <div className={`more-action ${classNameBackBtn}`} onClick={() => this.onBack() } >Back</div>
              <button type="button" className={`btn btn-success ${isSubmitReady ? '' : 'disable-submit'} `} onClick={() => this.onSubmit()} >Submit</button>
            </div>
          </div>
        </div>
      )
    }
}
