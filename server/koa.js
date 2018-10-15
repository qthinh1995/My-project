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
let arrHost = []

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

// arrHosts.forEach(item => {
//   const nsp = io.of(item)
//   nsp.on('connection', (socket) => {
//     socket.on('john room', () => {
//       nsp.sockets.emit('john room')
//     })
//   })
// })

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('submit user name', (userName) => {
    socket.userName = userName
    socket.emit('submit user name', userName)
    socket.emit('get hosts', arrHost)
    console.log('new User: ', userName)
  });

  socket.on('john room', ({ roomName }) => {
    socket.join(roomName)
    const length = get(socket, `adapter.rooms[${roomName}].length`)
    if (length === 1) {
      socket.emit('receive ftype', 'X')
    } else if (length === 2) {
      socket.emit('receive ftype', 'O')
    } else {
      socket.emit('receive ftype', 'view')
    }

    console.log('vao duoc phong roi', socket.adapter.rooms[roomName].length)
  });

  socket.on('handle caro map', ({ x, y, roomName, type, isWinner }) => {
    const { arrayMap } = currentHosts[roomName]
    const nextType = isWinner? type: changeAllowType(type)
    console.log('isWinner', isWinner)
    set(arrayMap, `[${y}][${x}].value`, type);
    io.sockets.in(roomName).emit('handle caro map', { caroMap: arrayMap, nextType, isWinner })
  })

  socket.on('create room', ({ roomName, arrayMap }) => {
    currentHosts[roomName] = { arrayMap }
    arrHost = getArrayHost({ currentHosts })
    io.sockets.emit('get hosts', arrHost)
  })

  socket.on('get hosts', () => {
    io.sockets.emit('get hosts', arrHost)
  })

  // socket.on('click square', (value) => {
  //   value.isClickX = !value.isClickX;
  //   currentState = value;

  //   io.sockets.emit('click square', value)
  // });

  // if (!isEmpty(currentState)) {
  //   socket.on('get current state', () => {
  //     io.sockets.emit('get current state', currentState)
  //   })
  // }
});

server.listen(999, () => {
  console.log('Hello')
});

// mount react-router
app.use(router)


// Tell parent process koa-server is started
if (process.send) process.send('online')
debug('koa')(`Application started on port ${config.port}`)
