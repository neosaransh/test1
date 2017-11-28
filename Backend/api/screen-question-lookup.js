module.exports = {
    path: '/screen-question-lookup',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('ScreenQuestion').get(req.query.id, {
                success: question => {
                    res.json({screen: question.get('screen').id});
                },
                error: res.errorHandler
            });
        }
    }
};
