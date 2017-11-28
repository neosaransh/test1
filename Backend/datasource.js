function datasource(req, res, type, id, client, callback) {
    switch (type) {
        case 'user-field':
            req.parseQuery('MHR').get(client, {
                success: mhr => {
                    mhr.get('patient').fetch({
                        success: user => {
                            callback([{value: user.get(id), timestamp: Math.trunc(user.get('createdAt').valueOf() / 86400000)}]);
                        },
                        error: res.errorHandler
                    });
                },
                error: res.errorHandler
            });
            break;
        case 'mhr-field':
            req.parseQuery('MHR').get(client, {
                success: mhr => {
                    callback([{value: mhr.get(id), timestamp: Math.trunc(mhr.get('createdAt').valueOf() / 86400000)}]);
                },
                error: res.errorHandler
            });
            break;
        case 'mood':
            req.parseQuery('Mood').equalToPointer('mhr', 'MHR', client).find({
                success: _results => {
                    req.fetchShallow(_results, results => {
                        callback(results.map(result => ({
                            value: {
                                value: result.value,
                                type: 'mood'
                            },
                            timestamp: Math.trunc(result.createdAt.valueOf() / 86400000)
                        })));
                    });
                },
                error: res.errorHandler
            });
            break;
        case 'shake':
            if (!['xHigh', 'xLow', 'yHigh', 'yLow', 'zHigh', 'zLow', 'shakeValue'].includes(id)) {
                return res.error({msg: `Invalid shake data field name '${id}'!`}, 400);
            }
            req.parseQuery('Shake').equalToPointer('mhr', 'MHR', client).find({
                success: _results => {
                    req.fetchShallow(_results, results => {
                        callback(results.map(result => ({
                            value: id === 'shakeValue' ? {
                                value: result.shakeValue,
                                type: 'shakeValue'
                            } : {
                                value: result[id],
                                type: 'measurement',
                                units: 'm/s^2'
                            },
                            timestamp: Math.trunc(result.createdAt.valueOf() / 86400000)
                        })));
                    });
                },
                error: res.errorHandler
            });
            break;
        case 'screen-answer':
            req.parseQuery('ScreenAnswer').equalToPointer('question', 'ScreenQuestion', id).equalToPointer('mhr', 'MHR', client).find({
                success: _results => {
                    req.fetchShallow(_results, results => {
                        logger.debug(results);
                        callback(results.map(result => ({value: result.answer, timestamp: Math.trunc(result.createdAt.valueOf() / 86400000)})));
                    });
                },
                error: res.errorHandler
            });
            break;
        case 'calculated-attribute':
            req.parseQuery('CalculatedAttribute').get(id, {
                success: query => {
                    var userFieldValues = {};
                    var mhrFieldValues = {};
                    var screenAnswerValues = {};
                    var calculatedAttributeValues = {};
                    var queryTypesMap = {
                        'user-field': {
                            out: userFieldValues,
                            multi: false
                        },
                        'mhr-field': {
                            out: mhrFieldValues,
                            multi: false
                        },
                        'screen-answer': {
                            out: screenAnswerValues,
                            multi: true
                        },
                        'calculated-attribute': {
                            out: calculatedAttributeValues,
                            multi: true
                        }
                    };
                    var functions = {
                        add: {
                            args: 2,
                            func: (a, b) => a + b
                        },
                        subtract: {
                            args: 2,
                            func: (a, b) => a - b
                        },
                        multiply: {
                            args: 2,
                            func: (a, b) => a * b
                        },
                        divide: {
                            args: 2,
                            func: (a, b) => a / b
                        },
                        remainder: {
                            args: 2,
                            func: (a, b) => a % b
                        },
                        sqrt: {
                            args: 1,
                            func: Math.sqrt
                        }
                    }
                    var funcBuilders = undefined;
                    var handleNode = obj => {
                        logger.debug(obj);
                        if (typeof obj !== 'object') {
                            res.error({msg: `Error in calculated attribute model: expected node object, got '${typeof obj}'!`});
                            throw null;
                        }
                        if (!(obj.type in funcBuilders)) {
                            res.error({msg: `Error in calculated attribute model: unknown node type '${obj.type}'!`});
                            throw null;
                        }
                        return funcBuilders[obj.type](obj);
                    }
                    funcBuilders = {
                        value: obj => callback => setImmediate(() => callback(obj.value)),
                        query: obj => {
                            if (!(obj.source_type in queryTypesMap)) {
                                res.error({msg: `Error in calculated attribute model: unknown datasource type '${obj.source_type}'!`});
                                throw null;
                            }
                            var typeInfo = queryTypesMap[obj.source_type];
                            return callback => {
                                if (obj.id in typeInfo.out) {
                                    logger.debug(typeInfo.out[obj.id]);
                                    return setImmediate(() => callback(typeInfo.out[obj.id]));
                                }
                                datasource(req, res, obj.source_type, obj.id, client, results => {
                                    typeInfo.out[obj.id] = typeInfo.multi ? results : results[0];
                                    logger.debug(typeInfo.out[obj.id]);
                                    callback(typeInfo.out[obj.id]);
                                });
                            }
                        },
                        func: obj => {
                            if (!(obj.func in functions)) {
                                res.error({msg: `Error in calculated attribute model: unknown function '${obj.func}'!`});
                                throw null;
                            }
                            var funcInfo = functions[obj.func];
                            if (!(obj.args && obj.args.constructor === Array)) {
                                res.error({msg: `Error in calculated attribute model: argument list not provided for function '${obj.func}'!`});
                                throw null;
                            }
                            if (obj.args.length < funcInfo.args) {
                                res.error({msg: `Error in calculated attribute model: not enough arguments for function '${obj.func}': got ${obj.args.length}, expected ${funcInfo.args}!`});
                                throw null;
                            }
                            var args = obj.args.map(handleNode);
                            return callback => {
                                var gen = undefined;
                                gen = (function* () {
                                    for (var i = 0; i < args.length; i++) {
                                        args[i](result => {
                                            logger.debug(i);
                                            logger.debug(result);
                                            args[i] = result;
                                            gen.next();
                                        });
                                        yield 0;
                                    }
                                    for (var arg of args) {
                                        if (arg.constructor === Array && arg.length == 0) {
                                            callback([]);
                                            return;
                                        }
                                    }
                                    var indices = args.map(arg => arg.constructor === Array ? 0 : null);
                                    logger.debug(args);
                                    callback(Array.from((function* () {
                                        while (true) {
                                            var sources = args.map((arg, i) => indices[i] === null ? arg : arg[indices[i]]);
                                            yield {
                                                timestamp: Math.max(...sources.map(s => s.timestamp)),
                                                value: {value: funcInfo.func(...sources.map(s => s.value.value))}
                                            };
                                            var next = null;
                                                for (var i = 0; i < args.length; i++) {
                                                    var index = indices[i] + (histogram((next || {args: []}).args)[i] || 0) + 1;
                                                    if (indices[i] !== null && args[i].length > index && (!next || next.time >= args[i][index].timestamp)) {
                                                        updated = true;
                                                        logger.debug(next);
                                                        logger.debug(args[i][index]);
                                                        if (next && next.time == args[i][index].timestamp) {
                                                            next.args.push(i);
                                                        } else {
                                                            next = {
                                                                args: [i],
                                                                time: args[i][index].timestamp
                                                            };
                                                        }
                                                    }
                                                }
                                            logger.debug(next);
                                            if (!next) {
                                                return;
                                            }
                                            for (var i of next.args) {
                                                indices[i]++;
                                            }
                                        }
                                    })()));
                                })();
                                gen.next();
                            }
                        }
                    }
                    try {
                        handleNode(query.get('model'))(results => {
                            callback(results.map(point => ({
                                timestamp: point.timestamp,
                                value: {
                                    ...point.value,
                                    ...(query.get('resultBase') || {})
                                }
                            })));
                        });
                    } catch (ex) {
                        if (ex !== null) {
                            res.error({msg: 'Unknown internal server error!'});
                            logger.debug(ex);
                        }
                    }
                },
                error: res.errorHandler
            });
            break;
        default:
            return res.error({msg:`Unknown datasource type '${type}'!`}, 400);
    }
}

module.exports = datasource;
