const fileController = require('./controllers/file.controller');
const upload = require('./helpers/fileUpload.helper');
const otherController = require('./controllers/other.controller');
const authController = require('./controllers/auth.controller');


module.exports = function (app) {

    // Handling cors errors (middleware)
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    });


    app.get('', (req, res) => res.json({ msg: 'hello world!' }));
    app.post('/auth/register', authController.registerUser);
    app.post('/auth/verifyotp', authController.verifyOtp);
    app.post('/auth/resendotp', authController.resendOtp);


    // app.post("/upload", upload.single("file"), fileController.fileUpload);
    // app.get('/sendmail', otherController.sendMail);

}