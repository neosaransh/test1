module.exports = {
    path: '/screen-answers',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            var screen = req.query.screen;
            if (!screen) {
                return res.error({msg: 'Screen not specified!'}, 400);
            }
            var client = req.query.client;
            if (!client) {
                return res.error({msg: 'Client not specified!'}, 400);
            }
            req.parseQuery('ScreenQuestion').equalToPointer('screen', 'Screen', screen).find({
                success: questions => {
                    var gen;
                    gen = (function* () {
                        var result = {};
                        logger.debug(questions.length);
                        for (var question of questions) {
                            req.parseQuery('ScreenAnswer').equalTo('question', question).addDescending('createdAt').first({
                                success: (_q => answer => {
                                    if (answer) {
                                        result[_q.id] = res.filterObject(answer.attributes, 'createdAt', 'answer');
                                    }
                                    gen.next();
                                })(question),
                                error: res.errorHandler
                            });
                            yield 0;
                            logger.debug(question.objectId);
                        }
                        res.json(result);
                    })();
                    gen.next();
                },
                error: res.errorHandler
            });
        },
        post: (req, res) => {
            var question = req.body.question;
            if (!question) {
                res.error({msg: 'Question not specified!'}, 400);
            }
            var answer = req.body.answer;
            if (!answer) {
                res.error({msg: 'Answer not specified!'}, 400);
            }
            var client = req.body.client;
            if (!client) {
                res.error({msg: 'Client not specified!'}, 400);
            }
            new Parse.Object('ScreenAnswer').save({
                mhr: {
                    __type: 'Pointer',
                    className: 'MHR',
                    objectId: client
                },
                question: {
                    __type: 'Pointer',
                    className: 'ScreenQuestion',
                    objectId: question
                },
                uploader: req.user,
                answer
            }, {
                success: obj => {
                    res.json({id: obj.id});
                },
                error: res.errorHandler
            });
        }
    }
};
