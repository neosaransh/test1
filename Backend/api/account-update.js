module.exports = {
    path: '/account-update',
    auth: true,
    handlers: {
        post: (req, res) => {
            Parse.User.logIn(req.user.getUsername(), req.body.password, {
                success: user => {
                    user.save(res.filterObject(req.body.updates, 'password', 'email'), {
                        useMasterKey: true,
                        success: () => {
                            res.json({success: true});
                        },
                        error: res.errorHandler
                    });
                },
                error: res.errorHandler
            });
        }
    }
};
