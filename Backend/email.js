var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@medimoclinic.ca',
        pass: 'correct horse battery staple'
    }
});

//module.exports = (options, callback) => transporter.sendMail(options, callback);
module.exports = () => {}
