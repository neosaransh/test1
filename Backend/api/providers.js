module.exports = {
    path: '/providers',
    auth: ['admin'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('_User').equalTo('type', 'provider').find({
                success: _providers => {
                    req.fetchShallow(_providers, providers => {
                        res.json(providers.map(provider => res.filterObject(provider, 'id', 'name')));
                    });
                }, error: res.errorHandler
            });
        }
    }
};
