module.exports = {
    path: '/shake',
    auth: ['patient'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('Shake').equalToPointer('mhr', 'MHR', req.mhr.id).find({
                success: _shakes => {
                    req.fetchShallow(_shakes, shakes => {
                        res.json(shakes.map(shake => res.filterObject(shake, 'xHigh', 'xLow', 'yHigh', 'yLow', 'zHigh', 'zLow', 'shakeValue', 'createdAt')));
                    });
                },
                error: res.errorHandler
            });
        },
        post: (req, res) => {
            new Parse.Object('Shake').save({
                ...res.filterObject(req.body, 'xHigh', 'xLow', 'yHigh', 'yLow', 'zHigh', 'zLow', 'shakeValue'),
                mhr: req.mhr
            }, {
                sessionToken: req.session,
                success: () => {
                    res.json({success: true});
                },
                error: res.errorHandler
            });
        }
    }
};
