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
import { getArrayHost, changeAllowType } from './utils'
import { get, set, values, filter, cloneDeep } from 'lodash'


console.log('config--------------: ', config)
/** Manual module */
const app = new Koa()
const env = process.env.NODE_ENV || 'development'
const server = http.createServer(app.callback())
const io = require('socket.io')(server);
// let currentState = {};
const currentHosts = {}
const infoHost = []

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
  console.log('a user connected');
  socket.on('disconnect', () => {

  });

  socket.on('submit user name', (userName) => {
    socket.userName = userName
    socket.emit('submit user name', userName)
    socket.emit('get hosts', infoHost)
    console.log('new User: ', userName)
  });

  socket.on('john room', ({ roomName, caroMap, isCreate = false }) => {
    console.log('create ', roomName)
    socket.roomName = roomName
    if (isCreate) {
      console.log(socket.id)
      socket.roomName = socket.id
      currentHosts[socket.id] = { 
        caroMap, nextType: 'X', isWinner: '', roomStatus: 'Waiting', 
        listUser: [ { id: socket.id, userName: socket.userName, player: 'X', isHost: true } ] 
      };
      infoHost.push({ idRoom: socket.id, roomName })
      io.sockets.emit('get hosts', infoHost)
    } else {
      currentHosts[roomName].listUser.push({ id: socket.id, userName: socket.userName })
    }

    socket.join(roomName)
    socket.emit('john room', currentHosts[socket.id])
    socket.broadcast.to(socket.roomName).emit('get room current state', currentHosts[socket.id])
  });

  socket.on('handle caro map', ({ x, y, player, isWinner }) => {
    console.log('emit ', socket.roomName)
    console.log(io.sockets.adapter.rooms)
    const { caroMap } = currentHosts[socket.roomName]
    const nextType = isWinner ? player : changeAllowType(player)
    set(caroMap, `[${y}][${x}].value`, player);
    console.log('handle caro', socket.roomName)
    io.sockets.in(socket.roomName).emit('get room current state', { caroMap, nextType, isWinner })
  })


  socket.on('get hosts', () => {
    io.sockets.emit('get hosts', infoHost)
  })

  socket.on('get room current state', () => {
    socket.emit('get room current state', currentHosts[socket.roomName])
  })

  socket.on('send message to room', (message) => {
    console.log('receive message', message)
    io.sockets.in(socket.roomName).emit('send message to room', { userName: socket.userName, message })
  })
});

server.listen(999, () => {
  console.log('Hello')
});

// mount react-router
app.use(router)


// Tell parent process koa-server is started
if (process.send) process.send('online')
debug('koa')(`Application started on port ${config.port}`)
