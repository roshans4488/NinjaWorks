/*
 * Custom logger using the winston logger module.
 */
 
var app = require(process.cwd() + '/app');
var winston = require('winston');
//var _ = require('lodash');
 
// Set up logger
var customColors = {
  trace: 'white',
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red'
};
 
var logger = new(winston.Logger)({
  colors: customColors,
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    crit: 4,
    fatal: 5
  },
  transports: [
  new(winston.transports.Console)({
    //level: app.settings.logLevel,
    level: "trace",
    colorize: true,
    timestamp: true
  })
  // new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});
 
winston.addColors(customColors);
 
// Extend logger object to properly log 'Error' types
var origLog = logger.log;
 
logger.log = function (level, msg) {
  var objType = Object.prototype.toString.call(msg);
  if (objType === '[object Error]') {
    origLog.call(logger, level, msg.toString());
  } else {
    origLog.call(logger, level, msg);
  }
};
/* LOGGER EXAMPLES
    app.logger.trace('testing');
    app.logger.debug('testing');
    app.logger.info('testing');
    app.logger.warn('testing');
    app.logger.crit('testing');
    app.logger.fatal('testing');
    */
 
module.exports = logger;