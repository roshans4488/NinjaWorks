var express = require('express');
var mysqlapi = require('./mysqlAPI');
var logger = require('./logger');
var router = express.Router();

router.post('/getUserWorkspaceHeaders', function(req, res, next) {
    res.json(mysqlapi.retrieveWorkspaceHeaders());
});

router.post('/getUserWorkspaces', function(req, res, next) {
    if (req.body.user_email_id == null || req.body.user_email_id == '') {
        logger.log('crit', '[Metadata][getUserWorkspaces()] Error: Required input fields missing');
        res.send({
            type: false,
            data: "Required input fields are missing"
        });
    } else {
        mysqlapi.retrieveWorkspaceData(req.body.user_email_id, function(err, results) {
            if (err) {
                logger.log('crit', '[Metadata][getUserWorkspaces()] Error: ' + err);
                res.send({
                    type: false,
                    data: "Error:" + err
                });
            } else {
                logger.log('debug', '[Metadata][getUserWorkspaces()] Success: ' + results);
                res.send(results);
            }
        });
    }
});

module.exports = router;