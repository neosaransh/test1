module.exports = {
    path: '/newpatient',
    auth: ['admin'],
    handlers: {
        post: (req, res) => {
            new Parse.Object('NewPatientRequest').save({
                ...res.filterObject(req.body, 'name', 'username', 'gender', 'ethnicity'),
                dateOfBirth: new Date(req.body.dob),
                provider: {__type: 'Pointer', className: '_User', objectId: req.body.provider}
            }, {
                success: obj => {
                    res.json({request_id: obj.id});
                },
                error: res.errorHandler
            });
        }
    }
};
