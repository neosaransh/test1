module.exports = {
    path: '/patient-signup',
    handlers: {
        get: (req, res) => {
            req.parseQuery('NewPatientRequest').get(req.query.id, {
                success: obj => {
                    res.json(res.filterObject(obj.attributes, 'name', 'username'));
                },
                error: res.errorHandler
            });
        },
        post: (req, res) => {
            req.parseQuery('NewPatientRequest').get(req.body.id, {
                success: obj => {
                    try {
                        Parse.User.signUp(obj.get('username'), req.body.password, {email: req.body.email, name: obj.get('name'), type: 'patient'}, {
                            useMasterKey: true,
                            success: user => {
                                new Parse.Object('MHR').save({
                                    ...res.filterObject(obj.attributes, 'dateOfBirth', 'gender', 'ethnicity'),
                                    patient: user,
                                    provider: obj.get('provider')
                                }, {
                                    useMasterKey: true,
                                    success: mhr => {
                                        Parse.User.logIn(user.get('username'), req.body.password, {
                                            success: _user => {
                                                res.json({session_token: _user.getSessionToken()});
                                                obj.destroy({useMasterKey: true});
                                            },
                                            error: res.errorHandler
                                        });
                                    },
                                    error: res.errorHandler
                                });
                            },
                            error: res.errorHandler
                        });
                    } catch(e){logger.error(e);}
                },
                error: res.errorHandler
            });
        }
    }
};
