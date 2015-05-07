/*
 * This javascript file contains the low level API's to connect to the MYSQL DB.
 */
var mysql = require('./mysql');
var logger = require('./logger');

/*
 * Initializing the MySQL database information
 */
var MYSQL_WORKSPACE_TABLE = "ninja_workspaces";
var MYSQL_WORKSPACE_DOCUMENTS_TABLE = "ninja_workspace_documents";
var MYSQL_WORKSPACE_FIELDS_TABLE = "ninja_workspace_fields";
var MYSQL_WORKSPACE_PERMISSIONS_TABLE = "ninja_workspace_permissions"
var MYSQL_FIELD_DOCUMENT_NAME = "document_name";
var MYSQL_FIELD_PARENT_DOCUMENT_NAME = "parent_document";
var MYSQL_FIELD_WORKSPACE_TYPE = "workspace_type";
var MYSQL_FIELD_CATEGORY = "category";
/* Not all fields are currently stored this way */

/* Retrieve metadata from MySQL */

exports.retrieveMetadataFields2 = function(workspace_type, category) {
    //var query= 'SELECT document_name, parent_document FROM ninja_workspace_documents '+
    //'WHERE workspace_type = "'+workspace_type+'" AND category = "'+category+'"';

    var query = 'select document_name from ninja_workspace_documents ' +
        'where workspace_type= "' + workspace_type + '" and category="' + category + '"' +
        ' and (parent_document="" or parent_document is null) ' +
        'union all ' +
        'select document_name from ninja_workspace_documents o ' +
        'where exists (select 1 from ninja_workspace_documents i ' +
        'where i.workspace_type= "' + workspace_type + '" and i.category="' + category + '" ' +
        'and i.parent_document<>"" and i.parent_document is not null ' +
        'and o.workspace_type=i.workspace_type and o.document_name=i.parent_document)';
    mysql.connectDB(function(err, results) {
        if (err) {
            throw err;
        } else {
            console.log("results");
            console.log(results);
            return results;
        }
    }, query);

}

/*
 * This function retrieves the name of the collection that contains
 * the category of information for the workspace_type
 */

exports.retrieveCollection = function(workspace_type, category, callback) {
    var query = 'SELECT COALESCE(' + MYSQL_FIELD_PARENT_DOCUMENT_NAME + ',' + MYSQL_FIELD_DOCUMENT_NAME + ') as ' + MYSQL_FIELD_DOCUMENT_NAME +
                ' FROM ' + MYSQL_WORKSPACE_DOCUMENTS_TABLE + ' WHERE ' + MYSQL_FIELD_WORKSPACE_TYPE + '="' + workspace_type + '" AND ' + 
                '' + MYSQL_FIELD_CATEGORY + '="' + category + '";';
                
    logger.log('[MYSQLAPI][retrieveCollection()] Query: '+query);
    mysql.connectDB(function(err, results) {
        if (err) {
            logger.log('crit','[MYSQLAPI][retrieveCollection()] Error: '+err);
            callback(err, results);
        } else {
            logger.log('debug','[MYSQLAPI][retrieveCollection()] Retrieved: '+results);
            callback(err, results);
        }
    }, query);
}

/*
 * This function retrieves the name of the document that contains
 * the category of information for the workspace_type. 
 * Case 1: The document is a collection
 * Case 2: The document is an embedded document in a collection
 */
exports.retrieveDocument = function(workspace_type, category, callback) {
    var query = 'SELECT ' + MYSQL_FIELD_DOCUMENT_NAME + ' FROM ' + MYSQL_WORKSPACE_DOCUMENTS_TABLE + ' WHERE ' +
                '' + MYSQL_FIELD_WORKSPACE_TYPE + '="' + workspace_type + '" AND ' + MYSQL_FIELD_CATEGORY + '="' + category + '";';
                
    logger.log('[MYSQLAPI][retrieveDocument()] Query: '+query);
    mysql.connectDB(function(err, results) {
        if (err) {
            logger.log('crit','[MYSQLAPI][retrieveDocument()] Error: '+err);
            callback(err, results);
        } else {
            logger.log('debug','[MYSQLAPI][retrieveDocument()] Retrieved: '+results);
            callback(err, results);
        }
    }, query);
}

/*
 * This function checks if the document_name is a parent document / Collection
 * case 1: TRUE if it is a parent document
 * Case 2: FALSe if it is a child document
 */

exports.retrieveIsDocumentParent = function(workspace_type, category, document_name, callback) {
    var query = 'SELECT EXISTS ( ' +
                'SELECT 1  FROM ' + MYSQL_WORKSPACE_DOCUMENTS_TABLE + ' WHERE ' +
                '' + MYSQL_FIELD_WORKSPACE_TYPE + '="' + workspace_type + '" AND ' + MYSQL_FIELD_CATEGORY + '="' + category + '" AND ' + 
                '' + MYSQL_FIELD_PARENT_DOCUMENT_NAME + '="' + document_name + '"' +
                ' ) As valueExists;';

    logger.log('[MYSQLAPI][retrieveIsDocumentParent()] Query: '+query);
    mysql.connectDB(function(err, results) {
        if (err) {
            logger.log('crit','[MYSQLAPI][retrieveIsDocumentParent()] Error: '+err);
            callback(err, results);
        } else {
            logger.log('debug','[MYSQLAPI][retrieveIsDocumentParent()] Retrieved: '+results);
            callback(err, results);
        }
    }, query);
}

/*
 * This function retrieves only the metadata field names of the document/collection that contains
 * the category of information for the workspace_type
 */

exports.retrieveMetadataFields = function(workspace_type,category,callback) {
    var query = 'Select f.field_name FROM ' + MYSQL_WORKSPACE_DOCUMENTS_TABLE + ' d, ' + MYSQL_WORKSPACE_FIELDS_TABLE + ' f ' +
                'WHERE d.' + MYSQL_FIELD_WORKSPACE_TYPE + ' = "' + workspace_type + '" AND d.' + MYSQL_FIELD_CATEGORY + ' = "' + 
                '' +category + '" AND f.document_id = d.document_id;';
    
    logger.log('[MYSQLAPI][retrieveMetadataFields()] Query: '+query);
    mysql.connectDB(function(err, results) {
        if (err) {
            logger.log('crit','[MYSQLAPI][retrieveMetadataFields()] Error: '+err);
            callback(err, results);
        } else {
            logger.log('debug','[MYSQLAPI][retrieveMetadataFields()] Retrieved: '+results);
            callback(err, results);
        }
    }, query);
}

/*
 * This function retrieves all the metadata information of the collection that contains
 * the category of information for the workspace_type
 */

exports.retrieveMetadataFieldInformation = function(workspace_type, category, workspace_id, callback) {
    /*var query = 'Select f.field_name, f.field_type, f.field_label, f.field_display_form, f.field_display_table, f.field_form_required, f.field_display_table_editable, f.field_order FROM ' + MYSQL_WORKSPACE_DOCUMENTS_TABLE + ' d ' + 
                'join ' + MYSQL_WORKSPACE_FIELDS_TABLE + ' f on f.document_id = d.document_id WHERE d.' + MYSQL_FIELD_WORKSPACE_TYPE + ' = "' + workspace_type + 
                '" AND d.' + MYSQL_FIELD_CATEGORY + ' = "' + category + '" order by f.field_order;';*/
    var query = 'select * from ('+                
                '(select f.field_name, f.field_type, f.field_label, f.field_display_form, f.field_display_table, f.field_form_required, f.field_display_table_editable, f.field_order from '+MYSQL_WORKSPACE_FIELDS_TABLE + ' f join'+
                ' ' + MYSQL_WORKSPACE_DOCUMENTS_TABLE + ' d on d.document_id = f.document_id where d.workspace_type = "'+workspace_type+'" and d.category ="'+category+'" order by f.field_order) '+
                'union '+
                '(select f.field_name, f.field_type, f.field_label, f.field_display_form, f.field_display_table, f.field_form_required, f.field_display_table_editable, f.field_order from ninja_workspace_fields_extension f join'+
                ' ' + MYSQL_WORKSPACE_DOCUMENTS_TABLE + ' d on d.document_id = f.document_id where d.workspace_type = "'+workspace_type+'" and d.category ="'+category+'" and f.workspace_id="'+workspace_id+'" order by f.field_order)'+
                ') as h order by h.field_order';

    logger.log('[MYSQLAPI][retrieveMetadataFieldInformation()] Query: '+query);
    mysql.connectDB(function(err, results) {
        if (err) {
            logger.log('crit','[MYSQLAPI][retrieveMetadataFieldInformation()] Error: '+err);
            callback(err, results);
        } else {
            logger.log('debug','[MYSQLAPI][retrieveMetadataFieldInformation()] Retrieved: '+results);
            callback(err, results);
        }
    }, query);
}

/*
 * This function returns the metadata information for the workspace table.
 * Currently static and needs to be changed.
 */

exports.retrieveWorkspaceHeaders = function(callback) {
    var results = "[ {field_name: 'WORKSPACE_ID', field_type: 'STRING', field_label: 'WORKSPACE ID', field_required: 'Mandatory', field_display: 'true'}," +
        "  {field_name: 'WORKSPACE_Permissions', field_type: 'STRING', field_label: 'WORKSPACE Permissions', field_required: 'Mandatory', field_display: 'true' }," +
        "  {field_name: 'WORKSPACE_NAME', field_type: 'STRING', field_label: 'WORKSPACE Name', field_required: 'Mandatory', field_display: 'true' }," +
        "  {field_name: 'WORKSPACE_TYPE', field_type: 'STRING', field_label: 'WORKSPACE TYPE', field_required: 'Mandatory', field_display: 'true' }," +
        "  {field_name: 'WORKSPACE_DESCRIPTION', field_type: 'STRING', field_label: 'WORKSPACE DESCRIPTION', field_required: 'Mandatory', field_display: 'true' }]";
        logger.log('debug','[MYSQLAPI][retrieveWorkspaceHeaders()] Retrieved: '+results);
        callback(null,results);
}

/*
 * This function retrieves the workspace information for the respective user 
 * by checking user_email_id field
 */

exports.retrieveWorkspaceData = function(user_email_id, callback) {
    var query = 'SELECT nwp.workspace_id, nwp.workspace_permissions, nw.workspace_name, nw.workspace_type, nw.workspace_Description ' +
                'FROM ' + MYSQL_WORKSPACE_PERMISSIONS_TABLE + ' nwp JOIN ' + MYSQL_WORKSPACE_TABLE + ' nw ON nwp.workspace_id = nw.workspace_id ' +
                'WHERE nwp.user_email_id = "' + user_email_id + '"';
                
    logger.log('[MYSQLAPI][retrieveWorkspaceData()] Query: '+query);
    mysql.connectDB(function(err, results) {
        if (err) {
            logger.log('crit','[MYSQLAPI][retrieveWorkspaceData()] Error: '+err);
            callback(err, results);
        } else {
            logger.log('debug','[MYSQLAPI][retrieveWorkspaceData()] Retrieved: '+results);
            callback(err, results);
        }
    }, query);
}