class SessionActions {

  constructor() {
    this.generateActions('loginSuccess', 'logout', 'update')
  }

  login({ username, password}) {
    // You need to return a fn in actions
    // to get alt instance as second parameter to access
    // `alt-resolver` and the ApiClient
    return (dispatch, alt) =>
      // We use `alt-resolver` from the boilerplate
      // to indicate the server we need to resolve
      // this data before server side rendering
      alt.resolve(async () => {
        try {
          alt.getActions('requests').start()
          const response = await alt.request({ url: `/sql/login/${username}/${password}` })
          this.loginSuccess(response)
        } catch (error) {
          this.loginSuccess(error)
        }
        alt.getActions('requests').stop()
      })
  }

}

export default SessionActions
