//let AWSHelper = require('/Users/nicolasgnyra/WebstormProjects/Medimo/Backend/awshelper');

module.exports = function(server) {
    let io = require('socket.io')(server);

    let clients = [];
    let logger = global.logger;

    logger.info('Initializing chat...');

    io.use(function (socket, next) {
        // get session token from query
        let token = socket.handshake.query.session_token;

        if (!token) {
            logger.error("Token must be supplied");
            return next(new Error("Token must be supplied"));
        }

        DB.getUserFromSessionToken(token).done(user => {
            logger.info('Authorized user with ID ' + user.id);
            clients[socket.id] = user.id;
            return next();
        }).fail(error => {
            logger.error(error);
            return next(error)
        });
    });

    io.on('connection', function (socket) {
        // retrieve session token from handshake data
        let sessionToken = socket.handshake.query.session_token;

        logger.info('Client %s (user ID %s) connected', socket.id, clients[socket.id]);

        socket.on('chat-message-send', function (message, ack) {
            if (!message.recipient) {
                logger.error('Message recipient must be specified.');
                return;
            }

            if (!message.text && !message.attachment_name && !message.content_type) {
                logger.error('Either text or attachment must be defined!');
                return;
            }

            if (message.attachment_name && !message.content_type) {
                logger.error('Attachment must have a content type');
                return;
            }

            logger.info('Sending message from %s to %s', clients[socket.id], message['recipient']);

            let object = new Parse.Object('Message');
            let sentAt = new Date();

            object.set('sender',            new Parse.Object.extend('_User').createWithoutData(clients[socket.id]));
            object.set('recipient',         new Parse.Object.extend('_User').createWithoutData(message.recipient));
            object.set('sentAt',            sentAt);
            object.set('text',              message.text);
            object.set('attachmentName',    message.attachment_name);
            object.set('contentType',       message.content_type);

            object.save().done((object) => {
                let content = {
                    'id':                   object.id || null,
                    'sent_at':              sentAt || null,
                    'text':                 message.text || null,
                    'attachment_name':      message.attachment_name || null,
                    'content_type':         message.content_type || null,
                    'read_at':              object.get('readAt'),
                    'read_acknowledged':    object.get('readAt') !== null
                };

                let sendContent = {
                    'sender':               clients[socket.id] || null,
                    'recipient':            'me' || null
                };

                let ackContent = {
                    'sender':               'me' || null,
                    'recipient':            message.recipient || null
                };

                Object.assign(sendContent, content);
                Object.assign(ackContent, content);

                ack(ackContent);

                sendToSocketsWithClientId(message['recipient'], 'chat-message-broadcast', sendContent);

                logger.info('Successfully saved message to DB');
            }).fail((error) => {
                logger.error(error);
            });
        });

        socket.on('chat-read', function(data, ack) {
            let messageId = data.message_id;
            let me = clients[socket.id];
            let now = new Date();

            if (!messageId) {
                logger.error('Message ID must be defined');
                return
            }

            let query = new Parse.Query('Message');

            query.equalTo('objectId', messageId);
            query.equalTo('recipient', new Parse.Object.extend('_User').createWithoutData(me));
            query.doesNotExist('readAt');

            query.first().done((object) => {
                if (!object) {
                    logger.warn('Non-read message with ID "%s" does not exist!', messageId);
                    ack();
                    return;
                }

                let sender = object.get('sender').id;

                if (sender === me) {
                    logger.error('Cannot set own message as sent!');
                    return
                }

                object.set('readAt', now);

                object.save().done((object) => {
                    logger.trace('Marked message "%s" as read', object.id);
                }).fail((error) => {
                    logger.error('Failed to mark message "%s" as read: %s', object.id, error.message);
                });

                sendToSocketsWithClientId(sender, 'chat-read-broadcast', object.id);

                ack();
            }).fail((error) => {
                logger.error(error);
            });
        });

        socket.on('disconnect', function () {
            delete clients[socket.client.id];
            logger.info('Client %s disconnected', socket.client.id);
        });
    });

    let sendToSocketsWithClientId = (clientId, messageId, content) => {
        // iterate through connected clients
        for (let socketId in clients) {
            // check if clientId is same as message recipient
            if (clients[socketId] === clientId) {
                // send message to client
                io.to(socketId).emit(messageId, content);
                logger.trace('Sent "%s" to "%s"', messageId, socketId);
            }
        }
    };

    logger.info('Chat initialized.');
};