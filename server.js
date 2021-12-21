const createError = require('http-errors')
// https://www.npmjs.com/package/http-errors
const express = require('express')
const path = require('path')
const logger = require('morgan')
const configurations = require('./configurations');

const app = express()

// redis and session configs
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()
redisClient.on('error', function (err) {
  console.error(err)
})
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
)

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, './client')))

// app.use(function(req, res, next) {// update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use('/', function (req, res, next) {
  app.locals = {
    userEmail: req.session.user ? req.session.user.email : 'no-one@mail.com',
    userAvatarUrl: req.session.user ? req.session.user.avatarUrl : '/images/blank-profile-picture.png',
    isLogin: req.session.isLogin
  }
  next()
})
var routes = require('./routes')
app.use('/', routes)
var oauth = require('./routes/oauth')
app.use('/', oauth)
var users = require('./users/users.controller.js')
// app.use('/api', users)
app.use('/users', users)
var auth = require('./auth/auth.controller.js')
// app.use('/api', users)
app.use('/auth', auth)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  var status = err.status || 500
  res.status(status).send({ error: err.message })
})

var http = require('http')
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(configurations().app_port || '8080')
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// app.on('error', onError);

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}
