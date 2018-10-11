const utils = {
  johnRoom(socket) {
    socket.on('john room', ({ roomName }) => {
      socket.join(roomName)
      console.log('vao duoc phong roi', socket.adepter.rooms)
    })
  },

  handleCaroMap(socket) {
    socket.on('handle caro map', ({ value, roomName }) => {
      console.log(roomName)
      socket.broadcast.to(roomName).emit('handle caro map', alue)
    })
  }
}

module.exports = utils
