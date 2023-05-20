const mailHelper = require('../helpers/mailer.helper');


exports.sendMail = (req, res) => {
    mailHelper.sendMail(req, res, 'login');
    res.json({msg: 'mail is sent successfully'})
}