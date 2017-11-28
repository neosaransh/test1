let util = require('util');
let crypto = require('crypto');

module.exports = {
    path: '/chat/images/upload',
    auth: false,
    handlers: {
        put: (req, res) => {
            let hash = crypto.createHash('sha256');
            let outputFileName = hash.update(req.body).digest('hex');
            let type = req.headers['content-type'];

            let query = new Parse.Query('ChatFile');

            query.equalTo('key', outputFileName);

            query.count().done((number) => {
                if (number === 0) {
                    let object = new Parse.Object('ChatFile');
                    object.set('key', outputFileName);
                    object.set('contentType', type);
                    object.set('file', new Buffer(req.body).toString('base64'));
                    object.save().done((object) => {
                        logger.info('Successfully saved image ' + outputFileName);
                        res.json({'name': outputFileName});
                    }).fail((err) => {
                        logger.error(err);
                res.error({msg: err.message});
                    });
                } else {
                    logger.info('File %s already exists', outputFileName);
                }
            });
        }
    }
};
