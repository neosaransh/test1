module.exports = {
    path: '/questions',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('ScreenQuestion').equalToPointer('screen', 'Screen', req.query.id).find({
                success: _questions => {
                    logger.debug(_questions);
                    req.fetchShallow(_questions, questions => {
                        logger.debug(questions);
                        var data = questions.sort((a, b) => a.sequence - b.sequence).map(question => res.filterObject(question, 'screen', 'text', 'id', 'suggestedFrequency', 'continuation', 'notes', 'answerBase'));
                        logger.debug(data);
                        res.json(data);
                    });
                }, error: res.errorHandler
            });
        }
    }
};
