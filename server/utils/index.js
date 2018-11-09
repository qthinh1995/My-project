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
  },

  defaultRooom({ row = 20, col = 32, onStart = false, socket } = {}) {
    const caroMap = Array(row)
    for (let i = 0; i < caroMap.length; i++) {
      caroMap[i] = Array(col).fill(null)
    }
    if (onStart && socket) {
      return {
        availableType: { isTypeX: 0, isTypeY: -1 }, caroMap, nextType: 'X', playerWinner: '', roomStatus: 'Waiting', style: {},
        listUser: [ { id: socket.id, userName: socket.userName, player: 'X', isHost: true, ready: true } ]
      };
    }

    return { caroMap, nextType: 'X', playerWinner: '', roomStatus: 'Waiting' };
  },

  merge(mergeObj, newValue) {
    Object.keys(newValue).forEach((propertyName) => {
        mergeObj[propertyName] = newValue[propertyName];
    }) 
  }
}

module.exports = utils
