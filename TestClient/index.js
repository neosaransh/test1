const {get, request} = require('http');
const {lookup, extension} = require('mime-types');
const input = require('readline-sync');
const fs = require('fs');
const io = require('socket.io-client');
const readline = require('readline');

const options = {
    port: 3001
};

function handler(res, callback) {
    console.log('Response received: ' + res.statusCode);
    for (let header in res.headers) {
        console.log(`\t${header}: ${res.headers[header]}`);
    }
    let contentType = res.headers['content-type'];
    let text = /^text\/.*|.*\/json(?:[^\w].*|)$/i.test(contentType);
    let body = text ? '' : [];
    if (text) {
        res.setEncoding('utf8');
    }
    res.on('data', chunk => {
        if (text) {
            body += chunk;
        } else {
            body.push(chunk);
        }
    });
    res.on('end', () => {
        if (text) {
            console.log('Content:\n\t' + body.replace('\n','\n\t'));
            if (/\/json(?:[^\w].*|)$/i.test(contentType)) {
                body = JSON.parse(body);
            }
        } else {
            const path = '/tmp/response.' + extension(contentType);
            body = Buffer.from(body);
            fs.writeFile(path, body, {}, err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Content saved in ' + path);
                }
            })
        }
        if (callback) {
            callback(body, res.statusCode);
        }
    });
}

function _get(path, callback) {
    get({
        ...options,
        path
    }, res => handler(res, callback));
}

function _request(method, path, type, body, callback) {
    let req = request({
        ...options,
        method,
        path,
        headers: {
            ...options.headers,
            'content-type': type,
            'content-length': body.length
        }
    }, res => handler(res, callback));
    req.write(body, 'utf8');
    req.end();
}

const sources = {
    file: () => {
        const path = input.questionPath('File: ');
        return {
            body: fs.readSync(path),
            type: lookup(path)
        };
    },
    json: () => ({
        body: input.question('JSON: ', {limit: text => {
            try {
                JSON.parse(text);
                return true;
            } catch (e) {
                return false;
            }
        }}),
        type: 'application/json'
    })
};

function cont(data, status) {
    if (status >= 400) {
        console.error('Authentication failed');
        process.exit(1);
    }

    options.headers = {'x-medimo-api-session': data.session_token};
    console.log('Successfully authenticated');

    if (process.argv[2] === 'chat') {
        const other = input.question('Other user ID: ');
        const socket = io('http://localhost:3001', {query: {session_token: options.headers['x-medimo-api-session']}});
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        let queue = [];
        socket.on('connect', () => {
            console.log('Connected to chat server');
            let gen;
            gen = (function* () {
                while (true) {
                    rl.question('Message: ', message => {
                        process.stdout.write('\r\033[A\033[J');
                        queue.forEach(msg => console.log(msg));
                        queue = [];
                        message = message.trim();
                        if (message === '') {
                            gen.next();
                        } else {
                            socket.emit('chat-message-send', {
                                recipient: other,
                                sent_at: new Date(),
                                content_type: 'text',
                                contents: message
                            }, ack => {
                                console.log('< ' + message);
                                gen.next();
                            });
                        }
                    });
                    yield 0;
                }
            })();
            gen.next();
        });
        socket.on('chat message', msg => queue.push('> ' + msg.contents));
    } else {
        let gen;
        gen = (function* () {
            while (true) {
                const method = input.question('Method: ').toUpperCase();
                const path = input.question('Path: ');
                if (method === 'GET') {
                    _get(path, () => gen.next());
                } else {
                    const types = ['file', 'json'];
                    const {type, body} = sources[types[input.keyInSelect(types, 'Request body source')]]();
                    _request(method, path, type, body, () => gen.next());
                }
                yield 0;
            }
        })();
        gen.next();
    }
}

if (process.argv[2] === 'signup') {
    const id = input.question('Request ID: ');
    _get('/patient-signup?id=' + id, (data, status) => {
        if (status < 400) {
            const email = input.question('Email: ');
            const password = input.question('Password: ', {hideEchoBack: true});
            _request('POST', '/patient-signup', 'application/json', JSON.stringify({id, email, password}), cont);
        } else {
            console.log('Invalid user ID.')
            process.exit(1);
        }
    });
} else {
    const username = input.question('Username: ');
    const password = input.question('Password: ', {hideEchoBack: true});

    _request('POST', '/login', 'application/json', JSON.stringify({username, password}), cont)
}
