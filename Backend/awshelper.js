/**
 * NOTE: this is not the best way to upload to AWS. It would be better to handle uploads on the client side, but for
 * now, it is simpler to use this. It also avoids exposing private access keys on the web client side (not an issue
 * for apps).
 */

let AWS = require('aws-sdk');
let crypto = require('crypto');
let mime = require('mime-types');
let util = require('util');
let path = require('path');

let regionName = 'ca-central-1';
let bucketName = 'medimo-test-ca';

// these are test/debug credentials, should be changed for production
let s3 = new AWS.S3({
    region: regionName,
    accessKeyId: 'AKIAIEJ2N4OL5A4ZSLMQ',
    secretAccessKey: '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'
});

module.exports = {
    upload: (data, contentType, callback) => {
        let hash = crypto.createHash('sha256');

        logger.info('Uploading chat image (%s, %d bytes)', contentType, data.length);

        let outputFileName = hash.update(data).digest('hex'); // + '.' + mime.extension(contentType);

        // TODO: native AWS upload/download, no middleman (if possible)
        // TODO: this needs to be changed so authentication is required at some point
        // this may mean we need to implement a download() function that retrieves it using the above credentials,
        // although there are probably other (native?) ways
        let params = {
            ACL: 'public-read',
            Body: data,
            Bucket: bucketName,
            ContentType: contentType,
            Key: 'chat/attachments/' + outputFileName
        };

        s3.upload(params, function(err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, {
                    'url': data.Location,
                    'path': data.Key,
                    'name': path.basename(data.Key)
                });
            }
        });
    },
    getContentUrl: () => {
        // AWS S3 URL format
        return util.format('https://%s.s3.%s.amazonaws.com', bucketName, regionName);
    }
};