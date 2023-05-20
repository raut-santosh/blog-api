const nodemailer = require('nodemailer');


exports.sendMail = async (req, res, email = 'rautsantoshtukaram@gmail.com', type = null, model = null) => {

    let too = ''; let ccc = ''; let stg = '';
    if (req.get('host') == 'localhost:3000' || req.get('host') == 'example.com') {
        too = email;
        ccc = 'rauts6462@gmail.com';
        stg = 'Staging';
    } else {
        too = email;
        ccc = 'rauts6462@gmail.com';
        stg = 'Staging';
    };

    let msg = '';
    let subjectTitle = '';
    switch (type) {
        case 'register':
            subjectTitle = 'Dont share your otp with others!';
            msg = `
            <h1>OTP Verification</h1>
            <p>Your OTP is: <strong>${model.otp}</strong></p>
            <p>Please use this OTP to complete the verification process.</p>
            <p><em>This OTP will expire within 5 minutes.</em></p>
          `;
            break;
        case 'resendOTP':
            subjectTitle = 'Dont share your otp with others!';
            msg = `
            <h1>OTP Verification</h1>
            <p>Your new OTP is: <strong>${model.otp}</strong></p>
            <p>Please use this new OTP to complete the verification process.</p>
            <p><em>This OTP will expire within 5 minutes.</em></p>
          `;
            break;
    }
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'rautsantoshtukaram@gmail.com',
            pass: process.env.mailPass
        }
    });

    let mailOptions = {
        from: 'rautsantoshtukaram@gmail.com',
        to: too,
        cc: ccc,
        subject: subjectTitle,
        html: msg,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            return res.status(400).send(error);
        } else {
            next();
        }
    });
}