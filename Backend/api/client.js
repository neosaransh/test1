module.exports = {
    path: '/client',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            req.getTree('MHR', req.query.id, client => {
                res.json({
                    patient: {
                        name: client.patient.name,
                        id: client.patient.id,
                        profileimg: client.patient.profileimg ? client.patient.profileimg._url : undefined
                    },
                    provider: {
                        name: client.provider.name,
                        id: client.provider.id
                    },
                    dateOfBirth: client.dateOfBirth,
                    gender: client.gender,
                    ethnicity: client.ethnicity
                });
            });
        }
    }
};
