/*
 * This javascript file contains the connection to the MYSQL database.
 * It also contains a generic function to execute queries on the database.
 */
var mysql = require('mysql');
var logger = require('./logger');

/*
 * This function create and returns a connection to the MYSQL database.
 * Pending: Connction pooling code needs to be used instead.
 */
function getConnection() {
    var connection = mysql.createConnection({
        host: /*hostname*/,
        user: /*username*/,
        password: /*password*/,
        database: /*database*/
    });
    return connection;
}

/*
 * This function executes a query and returns the resuls or error.
 */
function connectDB(callback, sqlQuery) {

    var connection;
    
    try {
        connection = getConnection();
    } catch (err) {
    	logger.log('crit','[MYSQL] Connection Error: '+err);
        callback(err, null);
    }
    
    connection.query(sqlQuery, function(err, rows, fields) {
        if (err) {
            logger.log('crit',"ERROR: " + err.message);
            callback(err, null);
        } else { // return err or result
        	logger.log('debug','[MYSQL] Query executed: '+sqlQuery);
            logger.log('debug',"[MYSQL] DB Rows:" + rows);
            logger.log('debug',"[MYSQL] DB fields:" + fields);
            callback(err, rows);
        }
    });
    logger.log('debug',"[MYSQL] Connection closed..");
    connection.end();
}


//export function
exports.connectDB = connectDB;
