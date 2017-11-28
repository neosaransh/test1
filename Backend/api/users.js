module.exports = {
    path: '/users',
    auth: true,
    handlers: {
        get: (req, res) => {
            let types = req.query.types ? req.query.types.split(',') : [];

            DB.getUsers(req.session, types).done(users => {
                res.json(users);
            }).fail(error => {
                logger.error(error);
                res.error({msg: error.message}, 500);
            });
        }
    }
};
