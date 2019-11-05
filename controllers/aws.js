
const express = require('express')
const Util = require('../common/util')
const router = express.Router();
const AWS = require('aws-sdk');
const uuid = require('uuid');
const formidable = require('formidable');

AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
    }
});

// var credentials = new AWS.SharedIniFileCredentials({profile: 'work-account'});
// AWS.config.credentials = credentials;

/**
 * Them bucket s3
 * CreatedBy PDKIEN 05/11/2019
 */
router.post('/s3/bucket', function (req, res, next) {
    let body = req.body, bucketName = body.bucketName;
    let bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).createBucket({ Bucket: bucketName }).promise();
    bucketPromise.then(function (data) {
        res.send(data)
    }).catch(function (err) {
        Util.handlePageError(res, err);
    });

});
/**
 * Lay toan bo bucket
 * CreatedBy PDKIEN 05/11/2019
 */
router.get('/s3/bucket/all', function (req, res, next) {
    let bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).listBuckets().promise();
    bucketPromise.then(function (data) {
        res.send(data);
    }).catch(function (err) {
        Util.handlePageError(res, err);
    });
});

/**
 * Them file vao s3
 * CreatedBy PDKIEN 05/11/2019
 */
router.put('/s3/bucket', function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        res.write('File uploaded');
        res.end();
    });

    let body = req.body, bucketName = body.bucketName, keyName = body.keyName;
    let objectParams = { Bucket: bucketName, Key: keyName, Body: 'Hello World!' };
    let bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
    bucketPromise.then(function (data) {
        res.send(data);
    }).catch(function (err) {
        Util.handlePageError(res, err);
    });
});

module.exports = router;