module.exports = {
    path: '/mood',
    auth: ['patient'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('Mood').equalToPointer('mhr', 'MHR', req.mhr.id).find({
                success: _moods => {
                    req.fetchShallow(_moods, moods => {
                        res.json(moods.map(mood => res.filterObject(mood, 'value', 'createdAt')));
                    });
                },
                error: res.errorHandler
            });
        },
        post: (req, res) => {
            new Parse.Object('Mood').save({
                value: req.body.value,
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
