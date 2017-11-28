module.exports = {
    path: '/screens',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('Screen').find({
                success: _screens => {
                    req.fetchTree(_screens, screens => {
                        res.json(screens.map(screen => res.filterObject(screen, 'name', 'instructions', 'id')));
                    });
                },
                error: res.errorHandler
            });
        }
    }
};
