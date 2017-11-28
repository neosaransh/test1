module.exports = {
    path: '/querystore',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            var _query = req.parseQuery('SavedQuery');
            if (req.query.me) {
                _query.equalTo('creator', req.user);
            }
            _query.find({
                success: _queries => {
                    req.fetchShallow(_queries, queries => {
                        res.json(queries.map(query => ({
                            id: query.id,
                            name: query.name,
                            config: query.config
                        })));
                    });
                },
                error: res.errorHandler
            });
        },
        post: (req, res) => {
            var name = req.body.name;
            if (!name) {
                return res.error({msg: 'Query name not specified!'}, 400);
            }
            var config = req.body.config;
            if (!config) {
                return res.error({msg: 'Query configuration not specified!'}, 400);
            }
            var id = req.body.id;
            if (id) {
                req.parseQuery('SavedQuery').get(id, {
                    success: query => {
                        query.save({name, config}, {
                            success: () => res.json({id}),
                            error: res.errorHandler
                        });
                    },
                    error: res.errorHandler
                });
            } else {
                var query = new Parse.Object('SavedQuery', {name, config});
                query.save({
                    sessionToken: req.session,
                    success: obj => {
                        res.json({id: obj.id});
                    },
                    error: res.errorHandler
                });
            }
        }
    }
};
