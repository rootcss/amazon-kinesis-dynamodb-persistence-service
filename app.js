#!/usr/bin/env node

var debug = require('debug')('kinesis_dynamodb_app:server');
var http = require('http');

if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

var express           = require('express');
var path              = require('path');
var favicon           = require('serve-favicon');
var logger            = require('morgan');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
  
// Loading routes
var routes            = require('./routes/index');
var dynamo            = require('./routes/dynamo');
var livestream        = require('./routes/livestream');

// Loading services
var dynamodb          = require('./services/dynamodb.js');
var dynamo_models     = require('./services/dynamodb_models.js');
var kinesis_fetcher   = require('./services/kinesis_fetcher');

// Loading configurations
var config            = require('config');
global.log            = require('./config/logger.js');

var app = express();

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
global.server = http.createServer(app);
if (typeof(PhusionPassenger) !== 'undefined') {
    server.listen('passenger');
} else {
    server.listen(port);
}

server.on('error', onError);
server.on('listening', onListening);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/dynamo', dynamo);
app.use('/livestream', livestream);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// stuff related to the kinesis fetcher and dynamodb
var streamConfig = {
  instanceId: 'instance-1',
  redisUrl: process.env.REDIS_URL,
  streams: [{
      name: config.get('Kinesis.streamName'),
      partitions: 1
  }, {
      name: config.get('Kinesis.testStreamName'),
      partitions: 1
  }]
};

var ddb = new dynamodb(null, null, dynamo_models.TimelineEvents);
var kf = new kinesis_fetcher(streamConfig, ddb);
kf.streamEvents();


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
