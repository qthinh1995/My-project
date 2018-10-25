const utils = {
  getArrayHost({ currentHosts = {} } = {}) {
    return Object.keys(currentHosts)
  },

  changeAllowType(type) {
    return type === 'X' ? 'O' : 'X'
  },

  checkAvailableType({ listUser = [] } = {}) {
    const availableType = { isTypeX: -1, isTypeY: -1 }
    listUser.every((item, index) => {
      if (item.player === 'X') {
        availableType.isTypeX = index
      } else if (item.player === 'Y') {
        availableType.isTypeY = index
      }
      if (availableType.isTypeX && availableType.isTypeY) {
        return false
      }
      return true
    })

    return (availableType)
  },

  getIndexOfArray({ listUser, id } = {}) {
    let index = -1
    listUser.every((item, i) => {
      if (item.id === id) {
        index = i
        return false
      }
      return true
    })
    return index
  }
}

module.exports = utils
