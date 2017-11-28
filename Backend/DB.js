module.exports = {
    getUserFromSessionToken: (sessionToken) => {
        let query = new Parse.Query('_Session');

        query.equalTo('sessionToken', sessionToken);

        return query.first({sessionToken: sessionToken}).done(session => {
            return session.get('user').fetch().done(user => {
                return userToJson(user);
            });
        });
    },
    getUser: (sessionToken, userId) => {
        let query = new Parse.Query('_User');

        query.equalTo('objectId', userId);

        return query.first({sessionToken: sessionToken}).done(user => {
            return userToJson(user);
        });
    },
    getUsers: (sessionToken, groups) => {
        if (groups)
            logger.info('Fetching users in group(s) ' + groups.join(', '));
        else
            logger.info('Fetching users');

        let query = new Parse.Query('_User');

        if (groups) {
            if (groups.constructor === Array) {
                for (let i = 0; i < groups.length; i++) {
                    if (i === 0)
                    query = new Parse.Query('_User').equalTo('type', groups[i]);
                    else
                    query = Parse.Query.or(query, new Parse.Query('_User').equalTo('type', groups[i]))
                }
            } else {
                query = new Parse.Query('_User').equalTo('type', groups);
            }
        }

        return query.find({sessionToken: sessionToken}).done(rows => {
            let users = [];

            for (let i = 0; i < rows.length; i++) {
                users.push(userToJson(rows[i]));
            }

            return users;
        });
    },
    getMessages(sessionToken, contactId, maxCount) {
        return this.getUserFromSessionToken(sessionToken).done(user => {
            if (contactId)
                logger.info('Fetching messages for user "%s" from "%s"...', user.id, contactId);
            else
                logger.info('Fetching messages for user "%s"...', user.id);

            // create default query
            let senderQuery = new Parse.Query('Message');
            senderQuery.equalToPointer('sender', '_User', user.id);

            let recipientQuery = new Parse.Query('Message');
            recipientQuery.equalToPointer('recipient', '_User', user.id);

            // if recipient id is set
            if (contactId) {
                senderQuery.equalToPointer('recipient', '_User', contactId);
                recipientQuery.equalToPointer('sender', '_User', contactId);
            }

            // combine queries
            let query = Parse.Query.or(senderQuery, recipientQuery);

            // query db for messages (up to 1000 from latest message)
            return query.descending('sentAt').limit(maxCount || 1000).find({sessionToken: sessionToken}).done(array => {
                let messages = [];

                for (let i = 0; i < array.length; i++) {
                    messages.push(messageToJson(array[i], user.id));
                }

                return messages.reverse();
            });
        });
    }
};

function userToJson(user) {
    return {
        'id':             user.id || null,
        'email_verified': user.get('emailVerified') === true,
        'username':       user.get('username') || null,
        'created_at':     user.get('createdAt') || null,
        'email':          user.get('email') || null,
        'name':           user.get('name') || null,
        'type':           user.get('type') || null
    }
}

function messageToJson(message, currentUserId) {
    return {
        'id':                   message.id,
        'sender':               message.get('sender').id === currentUserId ? 'me' : message.get('sender').id,
        'recipient':            message.get('recipient').id === currentUserId ? 'me' : message.get('recipient').id,
        'sent_at':              message.get('sentAt') || null,
        'text':                 message.get('text') || null,
        'attachment_name':      message.get('attachmentName') || null,
        'content_type':         message.get('contentType') || null,
        'read_at':              message.get('readAt') || null,
        'read_acknowledged':    message.get('readAt') !== null
    };
}
