/*
 * This javascript file contains the low level API's to connect to the Mongo DB.
 */
var mysqlapi = require('./mysqlAPI');
var mongoose = require('mongoose');
var logger = require('./logger');

/*
 * This function retrieves the documents for the respective workspace_id
 * that contains the information that matches workspace_type and category
 */
exports.retrieveDocuments2 = function(workspace_type, category, workspace_id, callback) {
    var retrievedCollection;
    var retrievedDocument;

    mysqlapi.retrieveCollection(workspace_type, category, function(err, resultsA) {
        if (err) {
            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
            callback(err, resultsA);
        }
        retrievedCollection = resultsA;

        mysqlapi.retrieveDocument(workspace_type, category, function(err, resultsB) {
            if (err) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                callback(err, resultsB);
            }
            retrievedDocument = resultsB;

            /* Check if retrievedCollection & retrievedDocument have valid results */
            if (retrievedCollection.length == 0 || retrievedDocument.length == 0) {
                callback("Collection or Document Doesnt exist!", null);
            }

            var collection_name = retrievedCollection[0].document_name;
            var document_name = retrievedDocument[0].document_name;

            mongoose.connection.db.collection(collection_name, function(err, collection) {
                if (err) {
                    logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                    callback(err, collection);
                }
                if (collection_name == document_name) {
                    collection.find({
                        "WORKSPACE_ID": workspace_id
                    }).toArray(callback);

                } else {
                    var field = document_name;
                    var categoryUpper = category.toUpperCase();
                    console.log(categoryUpper);
                    var mongoQuery = "{ WORKSPACE_ID : '" + workspace_id + "' },  { " + categoryUpper + " : 1 } ";
                    var filter = '{ "WORKSPACE_ID" : "' + workspace_id + '" }';
                    var options = '{ "' + categoryUpper + '" : 1 }';
                    console.log(mongoQuery);

                    collection.find(JSON.parse(filter), JSON.parse(options)).toArray(function(err, resultC) {
                        if (resultC.length == 0) {
                            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                            callback(err, null);
                        }
                        console.log(resultC);
                        var temp = resultC[0];
                        console.log(resultC[0]);
                        logger.log('debug', resultC[0]);
                        var result = temp[document_name.toUpperCase()];
                        logger.log('debug', '[MONGOAPI][retrieveDocuments()] Retrieved: ' + result);
                        callback(err, result);
                    });
                }
            });
        });
    });
}

/*
 * This function retrieves the documents for the respective workspace_id
 * that contains the information that matches workspace_type and category
 */
exports.retrieveDocuments = function(workspace_type, category, identifier_name, identifier_value, callback) {
    var retrievedCollection;
    var retrievedDocument;

    mysqlapi.retrieveCollection(workspace_type, category, function(err, resultsA) {
        if (err) {
            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
            callback(err, resultsA);
        }
        retrievedCollection = resultsA;

        mysqlapi.retrieveDocument(workspace_type, category, function(err, resultsB) {
            if (err) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                callback(err, resultsB);
            }
            retrievedDocument = resultsB;

            /* Check if retrievedCollection & retrievedDocument have valid results */
            if (typeof(retrievedCollection) == undefined || typeof(retrievedDocument) == undefined || retrievedCollection == null || retrievedCollection.length == 0 || retrievedDocument == null || retrievedDocument.length == 0) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: Collection or Document Doesnt exist!');
                callback("Collection or Document Doesnt exist!", null);
            } else {
                var collection_name = retrievedCollection[0].document_name; //Field name is hardcoded :(
                var document_name = retrievedDocument[0].document_name; //Field name is hardcoded :(

                mongoose.connection.db.collection(collection_name, function(err, collection) {
                    if (err) {
                        logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                        callback(err, collection);
                    }
                    if (collection_name == document_name) {
                        //Case 1: Require collection fields - Retrieve all documents
                        var filter = '{ "' + identifier_name + '" : "' + identifier_value + '" }';
                        collection.find(JSON.parse(filter)).toArray(callback);
                    } else {
                        var field = document_name;
                        var categoryUpper = category.toUpperCase();
                        var filter = '{ "' + identifier_name + '" : "' + identifier_value + '" }';
                        var options = '{ "' + categoryUpper + '" : 1 }';

                        try {
                            collection.find(JSON.parse(filter), JSON.parse(options)).toArray(function(err, resultC) {

                                if (resultC.length == 0) {
                                    logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                                    callback(err, null);
                                }

                                var temp = resultC[0];
                                var result = temp[document_name.toUpperCase()];
                                logger.log('debug', '[MONGOAPI][retrieveDocuments()] Retrieved: ' + result);
                                callback(err, result);
                            });
                        } catch (ex) {
                            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + ex);
                        }
                    }
                });
            }
        });
    });
}




exports.updateArrayElements = function(workspace_type, category, identifier_name, identifier_value, subField, subFieldId, update_field, new_value, callback) {
    var retrievedCollection;
    var retrievedDocument;

    mysqlapi.retrieveCollection(workspace_type, category, function(err, resultsA) {
        if (err) {
            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
            callback(err, resultsA);
        }
        retrievedCollection = resultsA;

        mysqlapi.retrieveDocument(workspace_type, category, function(err, resultsB) {
            if (err) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                callback(err, resultsB);
            }
            retrievedDocument = resultsB;

            /* Check if retrievedCollection & retrievedDocument have valid results */
            if (typeof(retrievedCollection) == undefined || typeof(retrievedDocument) == undefined || retrievedCollection == null || retrievedCollection.length == 0 || retrievedDocument == null || retrievedDocument.length == 0) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: Collection or Document Doesnt exist!');
                callback("Collection or Document Doesnt exist!", null);
            } else {
                var collection_name = retrievedCollection[0].document_name; //Field name is hardcoded :(
                var document_name = retrievedDocument[0].document_name; //Field name is hardcoded :(

                mongoose.connection.db.collection(collection_name, function(err, collection) {
                    if (err) {
                        logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                        callback(err, collection);
                    }

                    console.log(collection_name);
                    console.log(document_name);
                    if (collection_name == document_name) {
                        //Case 1: Require collection fields - Retrieve all documents

                        var filter = '{ "' + identifier_name + '" : "' + identifier_value + '" }';
                        collection.find(JSON.parse(filter)).toArray(function(err, resultC) {

                            var set = '{ "' + update_field + '" : ' + JSON.stringify(new_value) + '}';
                            console.log(set);
                            collection.update(JSON.parse(filter), {
                                $push: JSON.parse(set)
                            }, function(err, result) {
                                callback(err, result);

                            });
                        });

                    } else {
                        var field = document_name;
                        var categoryUpper = category.toUpperCase();
                        var filter = '{ "' + identifier_name + '" : "' + identifier_value + '"' + ',"' + categoryUpper + "." + subField + '" : "' + subFieldId + '"' + ' }';
                        var options = '{ "' + categoryUpper + '" : 1 }';

                        console.log(filter);
                        collection.find(JSON.parse(filter), JSON.parse(options)).toArray(function(err, resultC) {
                            var set = '{ "' + categoryUpper + '.$.' + update_field + '" : "' + JSON.stringify(JSON.parse(new_value)) + '" }';
                            collection.update(JSON.parse(filter), {
                                $push: JSON.parse(set)
                            }, function(err, result) {
                                callback(err, result);

                            });
                        });
                    }
                });
            }
        });
    });
}



/*
 * This function updates the documents for the respective workspace_id
 * that contains the information that matches workspace_type and category
 */
exports.updateDocuments = function(workspace_type, category, identifier_name, identifier_value, subField, subFieldId, update_field, new_value, callback) {
    var retrievedCollection;
    var retrievedDocument;

    mysqlapi.retrieveCollection(workspace_type, category, function(err, resultsA) {
        if (err) {
            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
            callback(err, resultsA);
        }
        retrievedCollection = resultsA;

        mysqlapi.retrieveDocument(workspace_type, category, function(err, resultsB) {
            if (err) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                callback(err, resultsB);
            }
            retrievedDocument = resultsB;

            /* Check if retrievedCollection & retrievedDocument have valid results */
            if (typeof(retrievedCollection) == undefined || typeof(retrievedDocument) == undefined || retrievedCollection == null || retrievedCollection.length == 0 || retrievedDocument == null || retrievedDocument.length == 0) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: Collection or Document Doesnt exist!');
                callback("Collection or Document Doesnt exist!", null);
            } else {
                var collection_name = retrievedCollection[0].document_name; //Field name is hardcoded :(
                var document_name = retrievedDocument[0].document_name; //Field name is hardcoded :(

                mongoose.connection.db.collection(collection_name, function(err, collection) {
                    if (err) {
                        logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                        callback(err, collection);
                    }

                    console.log(collection_name);
                    console.log(document_name);
                    if (collection_name == document_name) {
                        //Case 1: Require collection fields - Retrieve all documents

                        var filter = '{ "' + identifier_name + '" : "' + identifier_value + '" }';
                        collection.find(JSON.parse(filter)).toArray(function(err, resultC) {
                            var set = '{ "' + update_field + '" : ' + JSON.stringify(new_value) + '}';
                            console.log(set);
                            collection.update(JSON.parse(filter), {
                                $set: JSON.parse(set)
                            }, function(err, result) {
                                callback(err, result);

                            });
                        });

                    } else {
                        var field = document_name;
                        var categoryUpper = category.toUpperCase();
                        var filter = '{ "' + identifier_name + '" : "' + identifier_value + '"' + ',"' + categoryUpper + "." + subField + '" : "' + subFieldId + '"' + ' }';
                        var options = '{ "' + categoryUpper + '" : 1 }';
                        collection.find(JSON.parse(filter), JSON.parse(options)).toArray(function(err, resultC) {
                            var set = '{ "' + categoryUpper + '.$.' + update_field + '" : "' + new_value + '" }';
                            console.log(set);
                            collection.update(JSON.parse(filter), {
                                $set: JSON.parse(set)
                            }, function(err, result) {
                                callback(err, result);

                            });
                        });
                    }
                });
            }
        });
    });
}


/*
 * This function creates the documents for the respective workspace_id
 * that contains the information that matches workspace_type and category
 */

exports.createDocuments = function(workspace_type, category, data, callback) {
    var retrievedCollection;
    var retrievedDocument;

    mysqlapi.retrieveCollection(workspace_type, category, function(err, resultsA) {
        if (err) {
            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
            callback(err, resultsA);
        }
        retrievedCollection = resultsA;

        mysqlapi.retrieveDocument(workspace_type, category, function(err, resultsB) {
            if (err) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                callback(err, resultsB);
            }
            retrievedDocument = resultsB;

            /* Check if retrievedCollection & retrievedDocument have valid results */
            if (typeof(retrievedCollection) == undefined || typeof(retrievedDocument) == undefined || retrievedCollection == null || retrievedCollection.length == 0 || retrievedDocument == null || retrievedDocument.length == 0) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: Collection or Document Doesnt exist!');
                callback("Collection or Document Doesnt exist!", null);
            } else {
                var collection_name = retrievedCollection[0].document_name; //Field name is hardcoded :(
                var document_name = retrievedDocument[0].document_name; //Field name is hardcoded :(

                mongoose.connection.db.collection(collection_name, function(err, collection) {
                    if (err) {
                        logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                        callback(err, collection);
                    }
                    if (collection_name == document_name) {
                        console.log(data);
                        console.log(collection_name);
                        collection.insert(data);
                        callback(err, data);
                    }
                });
            }
        });
    });
}




/*
 * This function deletes the documents for the respective workspace_id
 * that contains the information that matches workspace_type and category
 */

exports.deleteDocuments = function(workspace_type, category, identifier_name, identifier_value, callback) {
    var retrievedCollection;
    var retrievedDocument;

    mysqlapi.retrieveCollection(workspace_type, category, function(err, resultsA) {
        if (err) {
            logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
            callback(err, resultsA);
        }
        retrievedCollection = resultsA;

        mysqlapi.retrieveDocument(workspace_type, category, function(err, resultsB) {
            if (err) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                callback(err, resultsB);
            }
            retrievedDocument = resultsB;

            /* Check if retrievedCollection & retrievedDocument have valid results */
            if (typeof(retrievedCollection) == undefined || typeof(retrievedDocument) == undefined || retrievedCollection == null || retrievedCollection.length == 0 || retrievedDocument == null || retrievedDocument.length == 0) {
                logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: Collection or Document Doesnt exist!');
                callback("Collection or Document Doesnt exist!", null);
            } else {
                var collection_name = retrievedCollection[0].document_name; //Field name is hardcoded :(
                var document_name = retrievedDocument[0].document_name; //Field name is hardcoded :(

                mongoose.connection.db.collection(collection_name, function(err, collection) {
                    if (err) {
                        logger.log('crit', '[MONGOAPI][retrieveDocuments()] Error: ' + err);
                        callback(err, collection);
                    }
                    if (collection_name == document_name) {
                        //Case 1: Require collection fields - Retrieve all documents
                        var filter = '{ "' + identifier_name + '" : "' + identifier_value + '" }';
                        collection.remove(JSON.parse(filter));
                        callback();

                    }
                });
            }
        });
    });
}

//Generates unique ID 
exports.generateUniqueID = function(workspace_type, category, identifier_name, parent_identifier, parent_identifier_value, callback) {
    var retrievedCollection;
    var retrievedDocument;

    mysqlapi.retrieveCollection(workspace_type, category, function(err, resultsA) {
        if (err) {
            logger.log('crit', '[MONGOAPI][generateUniqueID()] Error: ' + err);
            callback(err, resultsA);
        } else {
            retrievedCollection = resultsA;
            mysqlapi.retrieveDocument(workspace_type, category, function(err, resultsB) {
                if (err) {
                    logger.log('crit', '[MONGOAPI][generateUniqueID()] Error: ' + err);
                    callback(err, resultsB);
                } else {
                    retrievedDocument = resultsB;
                    /* Check if retrievedCollection & retrievedDocument have valid results */
                    if (retrievedCollection.length == 0 || retrievedDocument.length == 0) {
                        callback("Collection or Document Doesnt exist!", null);
                    } else {
                        var collection_name = retrievedCollection[0].document_name; //Field name is hardcoded :(
                        var document_name = retrievedDocument[0].document_name; //Field name is hardcoded :(

                        mongoose.connection.db.collection(collection_name, function(err, collection) {
                            if (err) {
                                logger.log('crit', '[MONGOAPI][generateUniqueID()2] Error: ' + err);
                                callback(err, null);
                            } else {
                                if (collection_name == document_name) {

                                    console.log("Collection = document");
                                    var condition1 = '{ "$match": { "' + parent_identifier + '" : "' + parent_identifier_value + '"}}';
                                    var condition2 = '{ "$group" : { "_id" : 0, "' + identifier_name + '" : { "$max" : "$' + identifier_name + '"}}}';
                                    console.log(condition1);
                                    console.log(condition2);
                                    console.log(JSON.stringify(JSON.parse(condition1)));
                                    console.log(JSON.stringify(JSON.parse(condition2)));
                                    collection.aggregate([JSON.parse(condition1), JSON.parse(condition2)]).toArray(callback);

                                } else {
                                    var field = document_name;
                                    var categoryUpper = category.toUpperCase();
                                    console.log(categoryUpper);
                                    var condition1 = '{ "$match": { "' + parent_identifier + '" : "' + parent_identifier_value + '"}}';
                                    var condition3 = '{ "$unwind" : "$' + categoryUpper + '" }';
                                    var condition2 = '{ "$group" : { "_id" : 0, "' + identifier_name + '" : { "$max" : "$' + categoryUpper + '.' + identifier_name + '"}}}';
                                    
                                    console.log(condition1);
                                    console.log(condition2);
                                    console.log(JSON.stringify(JSON.parse(condition1)));
                                    console.log(JSON.stringify(JSON.parse(condition2)));
                                    collection.aggregate([JSON.parse(condition1), JSON.parse(condition3), JSON.parse(condition2)]).toArray(callback);
                                }
                            }
                        }); //End of mongoose.db.collection
                    }
                }
            }); //End of retrieveDocument
        }
    }); //End of retrieveCollection
}