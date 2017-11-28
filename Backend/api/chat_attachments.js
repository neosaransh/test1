module.exports = {
    path: '/chat/attachments/:id',
    auth: false, // TODO: this allows anyone to access anyone else's file, THIS IS VERY BAD AND NEEDS TO BE FIXED ASAP
    handlers: {
        get: (req, res) => {
            let hash = req.params.id;

            let query = new Parse.Query('ChatFile');

            query.equalTo('key', hash);

            query.first().done((object) => {
                let img = new Buffer(object.get('file'), 'base64');

                res.writeHead(200, {
                    'Content-Type': object.get('key'),
                    'Content-Length': img.length
                });

                res.end(img);
            }).fail((error) => {
                logger.error(error);
                res.error({msg: error.message});
            });

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
