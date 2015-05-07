var express = require('express');
var mongoapi = require('./mongoAPI');
var router = express.Router();
var logger = require('./logger');
var mysqlapi = require('./mysqlAPI');

router.post('/getUserData', function(req, res, next) {
    if (req.body.identifier_name == null || req.body.identifier_name == '' || req.body.identifier_value == null || req.body.identifier_value == '' || req.body.workspace_type == null || req.body.workspace_type == '' || req.body.category == null || req.body.category == '') {
        logger.log('crit', '[NinjaServices][getUserData()] Error: Required input fields missing');
        res.send({
            type: false,
            data: "Required input fields are missing"
        });
    } else {

        mongoapi.retrieveDocuments(req.body.workspace_type, req.body.category, req.body.identifier_name, req.body.identifier_value, function(err, results) {
            if (err) {
                logger.log('crit', '[NinjaServices][getUserData()] Error: ' + err);
                res.send({
                    type: false,
                    data: "Error:" + err
                });
            } else {
                logger.log('debug', '[NinjaServices][getUserData()] Success: ' + results);
                res.send({
                    type: true,
                    data: results
                });
            }

        });
    }
});

router.post('/generateUniqueId', function(req, res, next) {
    if (req.body.identifier_name == null || req.body.identifier_name == '' || req.body.parent_identifier == null || req.body.parent_identifier == '' || req.body.parent_identifier_value == null || req.body.parent_identifier_value == '' || req.body.workspace_type == null || req.body.workspace_type == '' || req.body.category == null || req.body.category == '') {
        logger.log('crit', '[NinjaServices][generateUniqueId()] Error: Required input fields missing');
        res.send({
            type: false,
            data: "Required input fields are missing"
        });
    } else {

        mongoapi.generateUniqueID(req.body.workspace_type, req.body.category, req.body.identifier_name, req.body.parent_identifier, req.body.parent_identifier_value, function(err, results) {
            if (err) {
                logger.log('crit', '[NinjaServices][generateUniqueId()] Error: ' + err);
                res.send({
                    type: false,
                    data: "Error:" + err
                });
            } else {
                logger.log('debug', '[NinjaServices][generateUniqueId()] Success: ' + results);
                res.send({
                    type: true,
                    data: results
                });
            }

        });
    }
});

router.post('/updateUserData', function(req, res, next) {
    if (req.body.identifier_name == null || req.body.identifier_name == '' || req.body.identifier_value == null || req.body.identifier_value == '' || req.body.workspace_type == null || req.body.workspace_type == '' || req.body.category == null || req.body.category == '' || req.body.update_field == null || req.body.update_field == '' || req.body.new_value == null || req.body.new_value == '') {
        logger.log('crit', '[NinjaServices][updateUserData()] Error: Required input fields missing');
        res.send({
            type: false,
            data: "Required input fields are missing"
        });
    } else {

        if (req.body.update_field == "RESOURCES")
            mongoapi.updateArrayElements(req.body.workspace_type, req.body.category, req.body.identifier_name, req.body.identifier_value, req.body.subField, req.body.subFieldId, req.body.update_field, req.body.new_value, function(err, results) {
                if (err) {
                    logger.log('crit', '[NinjaServices][updateUserData()] Error: ' + err);
                    res.send({
                        type: false,
                        data: "Error:" + err
                    });
                } else {
                    logger.log('debug', '[NinjaServices][updateUserData()] Success: ' + results);
                    res.send({
                        type: true,
                        data: results
                    });
                }

            });
        else
            mongoapi.updateDocuments(req.body.workspace_type, req.body.category, req.body.identifier_name, req.body.identifier_value, req.body.subField, req.body.subFieldId, req.body.update_field, req.body.new_value, function(err, results) {
                if (err) {
                    logger.log('crit', '[NinjaServices][updateUserData()] Error: ' + err);
                    res.send({
                        type: false,
                        data: "Error:" + err
                    });
                } else {
                    logger.log('debug', '[NinjaServices][updateUserData()] Success: ' + results);
                    res.send({
                        type: true,
                        data: results
                    });
                }

            });
    }
});


router.post('/createUserData', function(req, res, next) {
    if (req.body.workspace_type == null || req.body.workspace_type == '' || req.body.category == null || req.body.category == '' || req.body.data == null || req.body.data == '' || JSON.stringify(req.body) === '{}') {

        logger.log('crit', '[NinjaServices][createUserData()] Error: Required input fields missing');
        res.send({
            type: false,
            data: "Required input fields are missing"
        });
    } else {
        mongoapi.createDocuments(req.body.workspace_type, req.body.category, req.body.data, function(err, results) {
            if (err) {
                logger.log('crit', '[NinjaServices][createUserData()] Error: ' + err);
                res.send({
                    type: false,
                    data: "Error:" + err
                });
            } else {
                logger.log('debug', '[NinjaServices][createUserData()] Success: ' + results);
                res.send({
                    type: true,
                    data: results
                });
            }

        });
    }
});


router.post('/deleteUserData', function(req, res, next) {
    if (req.body.workspace_type == null || req.body.workspace_type == '' || req.body.category == null || req.body.category == '' || req.body.identifier_name == null || req.body.identifier_name == '' || req.body.identifier_value == null || req.body.identifier_value == '') {
        logger.log('crit', '[NinjaServices][deleteUserData()] Error: Required input fields missing');
        res.send({
            type: false,
            data: "Required input fields are missing"
        });
    } else {

        mongoapi.deleteDocuments(req.body.workspace_type, req.body.category, req.body.identifier_name, req.body.identifier_value, function(err, results) {
            if (err) {
                logger.log('crit', '[NinjaServices][deleteUserData()] Error: ' + err);
                res.send({
                    type: false,
                    data: "Error:" + err
                });
            } else {
                logger.log('debug', '[NinjaServices][deleteUserData()] Success: ' + results);
                res.send({
                    type: true,
                    data: results
                });
            }

        });
    }
});

router.post('/retrieveMetadata', function(req, res, next) {
    if (req.body.workspace_type == null || req.body.workspace_type == '' || req.body.workspace_id == null || req.body.workspace_id == '' || req.body.category == null || req.body.category == '') {
        logger.log('crit', '[NinjaServices][retrieveMetadata()] Error: Required input fields missing');
        res.send({
            type: false,
            data: "Required input fields are missing"
        });
    } else {

        mysqlapi.retrieveMetadataFieldInformation(req.body.workspace_type, req.body.category, req.body.workspace_id, function(err, results) {
            if (err) {
                logger.log('crit', '[NinjaServices][deleteUserData()] Error: ' + err);
                res.send({
                    type: false,
                    data: "Error:" + err
                });
            } else {
                logger.log('debug', '[NinjaServices][retrieveMetadata()] Success: ' + results);
                res.send({
                    type: true,
                    data: results
                });
            }

        });
    }
});


module.exports = router;