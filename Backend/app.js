global.ABSPATH = __dirname;

var express                 = require('express');
var httpLogger              = require('morgan');
var bodyParser              = require('body-parser');
var Parse = global.Parse    = require('parse/node');
var requireDirectory        = require('require-directory');
let logger = global.logger  = require('tracer').colorConsole({
    transport: function(data) {
        console.log(data.output);
    },
    format: [
        "{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}",
        {
            warn: "\033[0;33m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m",   // for colors codes, see:
            error: "\033[0;31m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m"   // https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
        }
    ],
    dateformat: "yyyy-mm-dd'T'HH:MM:ss.l'Z'"
});

let DB = global.DB          = require('./DB.js');

var app = express();

Parse.serverURL = 'https://medimoliveparseserver.azurewebsites.net/parse'; // http://medimo-test.herokuapp.com/parse
Parse.initialize('e88d4c10-004b-4611-aa3d-8bbc5a564433', null, 'df87925d-8cbf-4720-adf0-f0a974e01351');

// App ID: bGbWSeIv6znyE7xctLTB
// Master Key: 835aFHTnKlnqm9wsPNgd'

Object.assign(Parse.Query.prototype, {
    equalToPointer(key, className, objectId) {
        return this.equalTo(key, {__type: 'Pointer', className, objectId});
    }
});

global.histogram = array => array.reduce((acc, curr) => (curr in acc ? acc[curr]++ : acc[curr] = 1, acc), {});
global.dateOnly = date => {
    var _date = new Date(date);
    _date.setHours(0, 0, 0, 0);
    return _date;
};

/**
* allows better cURL readability
*/
app.use((req, res, next) => {
    if (req.headers['x-json-pretty-print'] && req.headers['x-json-pretty-print'] == true)
    app.set('json spaces', 4);

    next();
});

app.use((req, res, next) => {
    logger.debug('begin extension middleware');
    req.parseQuery = className => new Parse.Query(className);
    req.fetchTree = (input, callback) => {
        var fetched = {};
        var handleObject = (obj, _callback) => {
            if (obj.id in fetched) {
                return setImmediate(() => _callback(fetched[obj.id]));
            }
            obj.fetch({
                sessionToken: req.session,
                success: _obj => {
                    fetched[obj.id] = _obj.attributes;
                    var gen = undefined;
                    gen = (function* () {
                        var result = {};
                        for (var field in _obj.attributes) {
                            if (_obj.attributes[field].className) {
                                handleObject(_obj.attributes[field], __obj => {
                                    __obj.id = _obj.attributes[field].id;
                                    result[field] = __obj;
                                    gen.next();
                                });
                                yield 0;
                            } else {
                                result[field] = _obj.attributes[field];
                            }
                        }
                        setImmediate(() => _callback(result));
                    })();
                    gen.next();
                }
            });
        };
        if (Array.isArray(input)) {
            var gen = undefined;
            gen = (function* () {
                var result = [];
                for (var i = 0; i < input.length; i++) {
                    handleObject(input[i], obj => {
                        obj.id = input[i].id;
                        result[i] = obj;
                        gen.next();
                    });
                    yield 0;
                }
                setImmediate(() => callback(result));
            })();
            gen.next();
        } else {
            handleObject(input, callback);
        }
    };
    req.getTree = (className, id, callback) => {
        req.parseQuery(className).get(id, {
            success: obj => {
                var gen = undefined;
                gen = (function* () {
                    var result = {};
                    for (var field in obj.attributes) {
                        if (obj.attributes[field].className) {
                            req.fetchTree(obj.attributes[field], _obj => {
                                _obj.id = obj.attributes[field].id;
                                result[field] = _obj;
                                gen.next();
                            });
                            yield 0;
                        } else {
                            result[field] = obj.attributes[field];
                        }
                    }
                    setImmediate(() => callback(result));
                })();
                gen.next();
            },
            error: res.errorHandler
        })
    }
    req.fetchShallow = (input, callback) => {
        var gen = undefined;
        gen = (function* () {
            var result = [];
            for (var i = 0; i < input.length; i++) {
                input[i].fetch({
                    success: obj => {
                        result[i] = {...obj.attributes, id: input[i].id};
                        gen.next();
                    },
                    error: res.errorHandler
                });
                yield 0;
            }
            setImmediate(() => callback(result));
        })();
        gen.next();
    };
    res.error = (error, code) => res.status(code || 500).json(error);
    res.buildJson = (...args) => {
        var result = {};
        args.forEach(map => {
            for (key in map) {
                if (key != '$') {
                    result[key] = map.$.get(map[key]);
                }
            }
        });
        res.json(result);
        return res;
    };
    res.filterObject = (obj, ...keys) => {
        var result = {};
        for (var key of keys) {
            result[key] = obj[key];
        }
        return result;
    };
    res.errorHandler = (obj, error) => {
        logger.error(error);
        res.error({msg: 'Internal error'});
    };
    logger.debug('end extension middleware');
    next();
});

// for some reason, bodyParser.raw() prevents any following middleware from running
app.use(httpLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({
    inflate: true,
    limit: '8mb',
    type: 'image/*'
}));

app.use(require('./auth'));

var api = requireDirectory(module, './api');
for (var name in api) {
    var config = api[name];
    for (var method in config.handlers) {
        if (config.auth) {
            logger.debug(config.auth);
            app[method](config.path, (req, res, next) => {
                logger.info('Running authentication check');
                if (!req.user) {
                    res.error({msg: 'Not authenticated'}, 401);
                    logger.error('Rejected due to no authentication');
                } else {
                    next();
                }
            });
            if (config.auth !== true) {
                (auth => {
                    app[method](config.path, (req, res, next) => {
                        logger.info('Running account type check');
                        if (!auth.includes(req.user.get('type'))) {
                            res.error({msg: 'You are not authorized to connect to this endpoint'}, 403);
                            logger.error('Rejected due to invalid user type');
                        } else {
                            next();
                        }
                    });
                })(config.auth)
            }
        }
        app[method](config.path, config.handlers[method]);
        logger.info('Added ' + method + ' handler for ' + config.path);
    }
}

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    logger.error(err);
    res.error(err, err.status);
});

module.exports = app;
