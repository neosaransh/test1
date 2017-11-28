module.exports = {
    path: '/chat/messages',
    auth: true,
    handlers: {
        get: (req, res) => {
            let contactId = req.query.contact_id || null;
            DB.getMessages(req.session, contactId).done(messages => {
                res.json(messages);
            }).fail(error => {
                logger.error(error);
                res.error({msg: error.message}, 500);
            });
        }
    }
};
