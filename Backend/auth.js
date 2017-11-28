module.exports = (req, res, next) => {
    logger.debug('Checking API header for session key');
    if (req.session = req.headers['x-medimo-api-session']) {
        try {
            req.parseQuery('_Session').equalTo('sessionToken', req.session).first({
                sessionToken: req.session,
                success: session => {
                    session.get('user').fetch({
                        success: user => {
                            req.user = user;
                            if (req.user.get('type') === 'patient') {
                                req.parseQuery('MHR').equalToPointer('patient', '_User', user.id).first({
                                    success: _mhr => {
                                        _mhr.fetch({
                                            success: mhr => {
                                                req.mhr = mhr;
                                                next();
                                            },
                                            error: res.errorHandler
                                        });
                                    },
                                    error: res.errorHandler
                                });
                            } else {
                                next();
                            }
                        },
                        error: res.errorHandler
                    })
                },
                error: (error) => {
                    res.error({msg: error.message}, 403);
                }
            });
        } catch (e) {
            logger.error(e);
        }
    } else {
        next();
    }
};
