var querycore = require('../querycore.js');

module.exports = {
    path: '/query',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            var type = req.query.type;
            if (!type) {
                return res.error({msg: 'Query type not specified!'}, 400);
            }
            if (type == 'saved') {
                var id = req.query.id;
                if (!id) {
                    return res.error({msg: 'Saved query ID not specified!'}, 400);
                }
                req.parseQuery('SavedQuery').get(id, {
                    success: obj => {
                        var config = obj.get('config');
                        querycore(req, res, config.type, {
                            ...config,
                            ...req.query
                        });
                    },
                    error: res.errorHandler
                });
            } else {
                querycore(req, res, type, req.query);
            }
        }
    }
};
