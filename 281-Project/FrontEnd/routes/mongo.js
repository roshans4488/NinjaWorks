/*
 * This javascript file contains the connection to the Mongo database.
 * It also contains a generic function to execute queries on the database - This is yet to be done
 */
var mongoose = require('mongoose');
var logger = require('./logger');

/* Connecting to Mongo DB */
var connection=mongoose.connect(/*connectionUrl*/);

/* Connection Listeners */
var db = mongoose.connection;
db.on('error', dbError);
db.once('open', dbListening);

/*
 * This function is executed when the connection is established
 */
function dbListening() {
  logger.log('info','[MONGO] Successfully connected to MongoDB');
}

/*
 * This function is executed when connection cannot be established
 */

function dbError() {
    logger.log('crit','[MONGO] Cannot connect to MongoDB!');
}
