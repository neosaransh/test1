module.exports = {
    path: '/login',
    handlers: {
        post: (req, res) => {
            logger.debug('Login request from user "%s"', req.body.username);
            Parse.User.logIn(req.body.username, req.body.password).done(user => {
                req.user = user;

                logger.debug('Successfully signed in user "%s"', req.body.username);

                res.json({
                    session_token: user.getSessionToken(),
                    admin: user.get('type') === 'admin'
                });
            }).fail(error => {
                logger.error('Failed to sign in user "%s": %s', req.body.username, error.message);
                res.error({msg: error.message}, 403);
            });
        }
    }
};
