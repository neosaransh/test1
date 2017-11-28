var datasource = require('./datasource.js');

module.exports = (req, res, type, config) => {
    switch (type) {
        case 'over-time':
            if (config.series === undefined) {
                config.series = Array.from((function* () {
                    var count = parseInt(config.count);
                    for (var i = 0; i < count; i++) {
                        var obj = {};
                        var regexp = new RegExp('' + i + '_(\\w+)');
                        for (var field in config) {
                            var match = regexp.exec(field);
                            if (match !== null) {
                                obj[match[1]] = config[field];
                            }
                        }
                        yield obj;
                    }
                })());
            }
            var gen = undefined;
            gen = (function* () {
                var clients = [];
                for (var id of config.client.split(',')) {
                    logger.debug(id);
                    req.parseQuery('MHR').get(id, {
                        success: client => {
                            client.get('patient').fetch({
                                success: user => {
                                    logger.debug(user);
                                    clients.push({
                                        id,
                                        name: user.get('name')
                                    });
                                    gen.next();
                                },
                                error: res.errorHandler
                            });
                        },
                        error: res.errorHandler
                    });
                    yield 0;
                }
                var gen2 = undefined;
                gen2 = (function* () {
                    var result = [];
                    for (var series of config.series) {
                        var source_type = series.source_type;
                        if (!source_type) {
                            return res.error({msg: 'Query source type not specified!'}, 400);
                        }
                        var source_id = series.source_id;
                        if (!source_id) {
                            return res.error({msg: 'Query source ID not specified!'}, 400);
                        }
                        var gen3 = undefined;
                        gen3 = (function* () {
                            for (var i = 0; i < clients.length; i++) {
                                logger.debug(clients[i]);
                                datasource(req, res, source_type, source_id, clients[i].id, results => {
                                    logger.debug(results);
                                    result.push({
                                        name: series.name,
                                        client: clients[i].name,
                                        results
                                    });
                                    gen3.next();
                                });
                                yield 0;
                            }
                            gen2.next();
                        })();
                        gen3.next();
                        yield 0;
                    }
                    res.json({
                        config: {
                            type: 'over-time',
                            series: config.series
                        },
                        result
                    });
                })();
                gen2.next();
            })();
            gen.next();
            break;
        default:
            return res.error({msg: `Unknown query type '${type}'!`}, 400);
    }
}
