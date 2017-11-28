module.exports = {
    path: '/clientlist',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            var query = req.parseQuery('MHR');
            if (req.user.get('type') !== 'admin') {
                query.equalToPointer('provider', '_User', req.user.id);
            }
            query.find({
                success: _clients => {
                    req.fetchTree(_clients, clients => {
                        res.json(clients.map(client => ({
                            id: client.id,
                            name: client.patient.name,
                            profileimg: client.patient.profileimg ? client.patient.profileimg._url : undefined,
                            lastinteraction: client.lastinteraction
                        })));
                    });
                }, error: res.errorHandler
            });
        }
    }
};
