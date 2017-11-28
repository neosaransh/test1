var email = require('../email.js');

module.exports = {
    path: '/passwordreset',
    handlers: {
        get: (req, res) => {
            logger.debug('Password reset request from user "%s"', req.query.username);
            email({
                from: 'Medimo Clinic Password Reset <noreply@medimoclinic.ca>',
                to: `${req.user.get('name')} <${req.user.get('email')}>`,
                subject: 'Medimo Clinic Password Reset',
                html: '' //TODO: Generate HTML content of email from template
            });
        },
        post: (req, res) => {
            //TODO: check reset token and password, push changes to database
        }
    }
};
