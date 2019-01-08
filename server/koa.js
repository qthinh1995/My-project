import path from 'path'
import debug from 'debug'

// import newrelic from 'newrelic'

import Koa from 'koa'
import mount from 'koa-mount'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import favicon from 'koa-favicon'
import staticCache from 'koa-static-cache'
import responseTime from 'koa-response-time'
import Router from 'koa-router'
import convert from 'koa-convert'
import logtofile from 'log-to-file'

import router from './router'
import config from '../internals/config/private'
import { apiPrefix } from '../internals/config/public'
import http from 'http'
// import { isEmpty } from 'lodash'
import { getArrayHost, changeAllowType, getIndexOfArray, defaultRooom, merge } from './utils'
import { get, set, values, filter, cloneDeep, isEmpty } from 'lodash'
import crypto from 'crypto'
// const session = require('koa-session');
// import db from './api/testsequelize/models'


console.log('config--------------: ', config)
/** Manual module */
const app = new Koa()
const env = process.env.NODE_ENV || 'development'
const server = http.createServer(app.callback())
const io = require('socket.io')(server);
// let currentState = {};
const currentHosts = {}
const infoHost = []

// const CONFIG = {
//   key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
//   /** (number || 'session') maxAge in ms (default is 1 days) */
//   /** 'session' will result in a cookie that expires when session/browser is closed */
//   /** Warning: If a session cookie is stolen, this cookie will never expire */
//   maxAge: 86400000,
//   autoCommit: true, /** (boolean) automatically commit headers (default true) */
//   overwrite: true, /** (boolean) can overwrite or not (default true) */
//   httpOnly: true, /** (boolean) httpOnly or not (default true) */
//   signed: true, /** (boolean) signed or not (default true) */
//   rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
//   renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
// };
// app.use(session(CONFIG, app));

// add header `X-Response-Time`
app.use(convert(responseTime()))
app.use(convert(logger()))
// app.use(serve('/server/public'));

// various security headers
app.use(helmet())
const cacheOpts = { maxAge: 86400000, gzip: true }

//make ctx.request.body for poat API:
app.use(convert(require('koa-bodyparser')({
  onerror: (err, ctx) => { ctx.throw('Invalid payload', 422); }
})));

app.use(convert(favicon(path.join(__dirname, '../app/images/favicon.ico'))))
app.use(convert(mount('/public/styles', staticCache(path.join(__dirname, '../app/styles'), cacheOpts))))

if (env === 'production') {
  // set debug env to `koa` only
  // must be set programmaticaly for windows
  debug.enable('koa')
  // load production middleware
  app.use(convert(require('koa-conditional-get')()))
  app.use(convert(require('koa-etag')()))
  app.use(require('koa-compress')())
  // use to load global js & css
  app.use(mount('/assets', staticCache(path.join(__dirname, '../dist'), cacheOpts)))
}

// Proxy asset folder to webpack development server in development mode
if (env === 'development') {
  // set debug env, must be programmaticaly for windows
  debug.enable('dev,koa')

  // log when process is blocked
  require('blocked')((ms) => debug('koa')(`blocked for ${ms}ms`))

  const webpackConfig = require('./../internals/webpack/dev.config')
  const proxy = require('koa-proxy')({
    host: `http://0.0.0.0:${webpackConfig.server.port}`,
    map: (filePath) => `assets/${filePath}`
  })
  // app.use(mount('/assets', proxy))
}

// mount the Api router
const apiRouter = new Router({ prefix: apiPrefix })
require('./api/routes')(apiRouter)
app.use(apiRouter.routes())


setInterval(() => {
  logtofile(new Date())
}, 1000 * 60 * 60)

io.on('connection', (socket) => {
  socket.emit('get user id', cloneDeep(socket.id));
  
  function leaveRoom() {
    if (!isEmpty(currentHosts[socket.roomName])) {
      const { listUser = [], availableType = {} } = currentHosts[socket.roomName]
      if (listUser.length === 1) {
        delete currentHosts[socket.roomName]
        infoHost.every((item, i) => {
          if (item.idRoom === socket.roomName) {
            infoHost.splice(i, 1)
            return false
          }
          return true
        })
        io.sockets.emit('get hosts', infoHost)
      } else {
        const index = getIndexOfArray({ listUser, id: socket.id })
        let isUserPlaying = false;
        if (index > -1) {
          const { player } = listUser[index]
          if (index === 0 && listUser.length > 1) {
            listUser[1].isHost = true
          }
  
          if (player === 'X') {
            availableType.isTypeX = -1
            isUserPlaying = true;
          } else if (player === 'O') {
            availableType.isTypeY = -1
            isUserPlaying = true;
          }
  
          listUser.splice(index, 1)
        }
  
        currentHosts[socket.roomName].listUser = listUser
        currentHosts[socket.roomName].availableType = availableType
  
        if (isUserPlaying) {
          const room = defaultRooom();
          merge(currentHosts[socket.roomName], room)
        }
      }
      socket.broadcast.to(socket.roomName).emit('get room current state', currentHosts[socket.roomName])
      socket.emit('leave room')
      socket.leave(socket.roomName)
    }
    delete socket.roomName;
  }

  socket.on('disconnect', () => {
    leaveRoom()
  });

  socket.on('leave room', () => {
    leaveRoom()
  })

  socket.on('submit user name', (userName) => {
    socket.userName = userName
    socket.emit('submit user name', userName)
    socket.emit('get hosts', infoHost)
  });

  socket.on('john room', ({ roomName, isCreate = false }) => {
    socket.roomName = roomName
    if (isCreate) {
      const date = new Date()
      socket.roomName = crypto.createHash('md5').update(date.getTime().toString()).digest('hex')
      currentHosts[socket.roomName] = defaultRooom({onStart: true, socket})
      infoHost.push({ idRoom: socket.roomName, roomName })
      io.sockets.emit('get hosts', infoHost)
    } else {
      currentHosts[socket.roomName].listUser.push({ id: socket.id, userName: socket.userName })
    }

    socket.join(socket.roomName)
    socket.emit('john room', currentHosts[socket.roomName])
    socket.broadcast.to(socket.roomName).emit('get room current state', currentHosts[socket.roomName])
  });

  socket.on('ready', () => {
    const { listUser } = currentHosts[socket.roomName]
    const index = getIndexOfArray({ listUser, id: socket.id })
    listUser[index].ready = true;
    io.sockets.in(socket.roomName).emit('get room current state', {listUser})
  })
  socket.on('start', () => {
    currentHosts[socket.roomName].roomStatus = 'Playing';
    io.sockets.in(socket.roomName).emit('get room current state', {roomStatus: 'Playing'})
  })

  socket.on('handle caro map', ({ x, y, player, isWinner, style }) => {
    const { caroMap } = currentHosts[socket.roomName]
    let { playerWinner } = currentHosts[socket.roomName]
    const nextType = changeAllowType(player)
    set(caroMap, `[${y}][${x}].value`, player);
    currentHosts[socket.roomName].nextType = nextType
    currentHosts[socket.roomName].caroMap = caroMap
    playerWinner = isWinner ? socket.userName : playerWinner
    currentHosts[socket.roomName].playerWinner = playerWinner
    io.sockets.in(socket.roomName).emit('get room current state', { caroMap, nextType, playerWinner, style })
  })

  socket.on('change type', ({ type }) => {
    const { listUser, availableType } = currentHosts[socket.roomName]
    const index = getIndexOfArray({ listUser, id: socket.id })
    const item = listUser[index]
    if (item.player === 'X') {
      availableType.isTypeX = -1
    } else if (item.player === 'O') {
      availableType.isTypeY = -1
    }

    if (type === 'X') {
      availableType.isTypeX = index
    } else if (type === 'O') {
      availableType.isTypeY = index
    }

    listUser[index].player = type
    currentHosts[socket.roomName].listUser = listUser
    currentHosts[socket.roomName].availableType = availableType
    io.sockets.in(socket.roomName).emit('get room current state', { availableType, listUser })
  })

  socket.on('get hosts', () => {
    io.sockets.emit('get hosts', infoHost)
  })

  socket.on('send message to room', (data) => {
    const { mode, value, reference } = data
    if (mode === 'global') {
      io.sockets.emit('send message to room', { userName: socket.userName, message: value, reference })
    } else if (mode === 'in game') {
      io.sockets.in(socket.roomName).emit('send message to room', { userName: socket.userName, message: value, reference })
    } 
    // else if (mode === 'private') {
    //   const { idUser } = data
    //   io.sockets.in(idUser).emit('leave room')
    // }
  })

  socket.on('reset room', () => {
    const room = defaultRooom();
    merge(currentHosts[socket.roomName], room)
    io.sockets.in(socket.roomName).emit('get room current state', currentHosts[socket.roomName])
  })

  socket.on('remove user', (id) => {
    const { listUser } = currentHosts[socket.roomName]
    const index = getIndexOfArray({ listUser, id })
    delete socket.adapter.rooms[socket.roomName].sockets[id]
    if (index > -1) {
      listUser.splice(index, 1)
    }

    io.sockets.in(socket.roomName).emit('get room current state', { listUser })
    io.sockets.in(id).emit('leave room')
  })
});

server.listen(999, () => {
});

// apiRouter.post('/users', (req, res) => {
//   db.user.create({
//     userName: 'tuan123dk',
//     passWord: 'nttuan1995'
//   })
//   .then(users => res.json(users))
// })

// mount react-router
app.use(router)


// Tell parent process koa-server is started
if (process.send) process.send('online')
debug('koa')(`Application started on port ${config.port}`)
