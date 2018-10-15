const utils = {
  getArrayHost({ currentHosts = {} } = {}) {
    return Object.keys(currentHosts)
  },

  changeAllowType(type) {
    return type === 'X' ? 'O' : 'X'
  }
}

module.exports = utils
