module.exports = {
    path: '/users/me',
    auth: true,
    handlers: {
        get: (req, res) => {
            let types = req.query.types ? req.query.types.split(',') : [];

            DB.getUserFromSessionToken(req.session, types).done(user => {
                res.json(user);
            }).fail(error => {
                logger.error(error);
                res.error({msg: error.message}, 500);
            });
        }
    }
};
