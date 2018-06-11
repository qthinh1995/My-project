import debug from 'debug'

const { BROWSER } = process.env

class SessionStore {

  constructor() {
    this.bindActions(this.alt.getActions('session'))
    this.session = null
  }

  onUpdate({ username }: { username: string }) {
    this.session = { username }
  }

  // onLogin({ username }: { username: string }) {
  //   console.log('from on logon -------------', username)
  //   if (username === 'wave0270') {
  //     console.log('+++++++++ onLogin: ', username)
  //     this.session = { username }
  //     // transition app to `/account`
  //     // or to the original asked page
  //     /* istanbul ignore if */
  //     if (BROWSER) {
  //       const { browserHistory } = require('react-router')
  //       const [ , nextPath = '/account' ] = window
  //         .location.search.match(/\?redirect=(.+)$/) || []

  //       const Cookies = require('cookies-js')
  //       Cookies.set('_auth', username)

  //       debug('dev')('redirect after login to %s', nextPath)
  //       browserHistory.replace(nextPath)
  //     }
  //   }
  // }

  onLoginSuccess(res = {}) {
    const { username, permission } = res
    if (username && permission) {
      this.session = { username, permission }
      // transition app to `/account`
      // or to the original asked page
      /* istanbul ignore if */
      if (BROWSER) {
        const { browserHistory } = require('react-router')
        const [ , nextPath = '/account' ] = window
          .location.search.match(/\?redirect=(.+)$/) || []

        const Cookies = require('cookies-js')
        Cookies.set('_auth', username)
        Cookies.set('_vn_role', permission)

        debug('dev')('redirect after login to %s', nextPath)
        browserHistory.replace(nextPath)
      }
    }
  }

  onLogout() {
    this.session = null

    /* istanbul ignore if */
    if (BROWSER) {
      const Cookies = require('cookies-js')
      const { browserHistory } = require('react-router')
      Cookies.expire('_auth')
      browserHistory.replace('/login')
    }
  }

}

export default SessionStore
