module.exports = {
    path: '/calculated-attributes-list',
    auth: ['provider', 'admin'],
    handlers: {
        get: (req, res) => {
            req.parseQuery('CalculatedAttribute').find({
                success: _attributes => {
                    req.fetchShallow(_attributes, attributes => {
                        logger.debug(attributes);
                        res.json(attributes.map(attribute => ({
                            id: attribute.id,
                            name: attribute.name
                        })));
                    });
                }, error: res.errorHandler
            });
        }
    }
};
