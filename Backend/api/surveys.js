module.exports = {
    path: '/surveys',
    auth: ['patient'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('Surveys').equalToPointer('mhr', 'MHR', req.mhr.id).find({
                success: _surveys => {
                    req.fetchShallow(_surveys, surveys => {
                        res.json(surveys.map(survey => res.filterObject(survey, 'order', 'createdAt')));
                    });
                },
                error: res.errorHandler
            });
        },
        post: (req, res) => {
            if (!req.body.order || req.body.order.constructor !== Array) {
                return res.error({msg: 'Order must be an array!'}, 400);
            }
            for (var e of req.body.order) {
                if (typeof e !== 'number') {
                    return res.error({msg: 'Order can only contain numbers!'}, 400);
                }
            }
            new Parse.Object('Surveys').save({
                order: req.body.order,
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
