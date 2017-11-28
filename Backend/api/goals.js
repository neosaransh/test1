module.exports = {
    path: '/goals',
    auth: true,
    handlers: {
        get: (req, res) => {
            req.parseQuery('Goals').equalToPointer('mhr', 'MHR', req.mhr ? req.mhr.id : req.query.client).find({
                success: _goals => {
                    req.fetchShallow(_goals, goals => {
                        res.json(goals.map(goal => ({
                            id: goal.id,
                            goal: goal.task,
                            createdAt: goal.createdAt,
                            issuer: req.user.id === goal.uploader.id ? 'Patient' : 'Physician',
                            completed: goal.completed,
                            accepted: goal.accepted
                        })));
                    });
                },
                error: res.errorHandler
            });
        },
        post: (req, res) => {
            switch(req.body.type) {
                case 'new':
                    new Parse.Object('Goals').save({
                        task: req.body.goal,
                        mhr: req.mhr || {
                            __type: 'Pointer',
                            className: 'MHR',
                            objectId: req.body.client
                        },
                        uploader: req.user,
                        completed: false,
                        accepted: false
                    }, {
                        sessionToken: req.session,
                        success: obj => {
                            res.json({id: obj.id});
                        },
                        error: res.errorHandler
                    });
                    break;
                case 'update':
                    req.parseQuery('Goals').get(req.body.id, {
                        success: goal => {
                            goal.save({
                                task: req.body.updates.goal,
                                ...res.filterObject(req.body.updates, 'completed', 'accepted')
                            }, {
                                success: () => {
                                    res.json({success: true});
                                },
                                error: res.errorHandler
                            });
                        },
                        error: res.errorHandler
                    });
                    break;
            }
        }
    }
};
