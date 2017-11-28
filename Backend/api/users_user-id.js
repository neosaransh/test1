module.exports = {
  path: '/users/:user_id',
  auth: true,
  handlers: {
    get: (req, res) => {
      let userId = req.params.user_id;

      DB.getUser(req.session, userId).done(user => {
        res.json(user);
      }).fail(error => {
        logger.error(error);
        res.error({msg: error.message}, 500);
      });
    }
  }
};