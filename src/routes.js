const fileController = require('./controllers/file.controller');
const upload = require('./helpers/fileUpload.helper');
const otherController = require('./controllers/other.controller');
const authController = require('./controllers/auth.controller');
const blogController = require('./controllers/blog.controller');
const authMiddleware = require('./middlewares/auth.middleware');

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


    app.get('', (req, res) => res.json({ 
        message: 'Welcome to the Blog API',
        version: '1.0.0',
        routes: {
            registerUser:{
                type: "POST",
                url: req.get('host') + '/auth/register',
                requestBody: {
                    name: "string",
                    email: "string",
                    password: "string"
                }
            },
            verifyOtp:{
                type: "POST",
                url: req.get('host') + '/auth/verifyotp',
                requestBody: {
                    email: "string",
                    otp: "string",
                    password: "string"
                },
                response: {
                    msg: "string",
                    token: "string"
                }
            },
            resendOtp:{
                type: "POST",
                url: req.get('host') + '/auth/resendotp',
                requestBody: {
                    email: "string",
                    password: "string"
                }
            },
            blogList: {
                type: "GET",
                url: req.get('host') + '/blog/list',
                response: {
                    data: "array"
                }
            },
            blogAddEdit: {
                type: "POST",
                url: req.get('host') + '/blog/addedit',
                requestBody: {
                    title: "string",
                    content: "string",
                    files: "array of objects",
                    author: "_id of user",
                    comments: "array of objects",
                    likes: "number",
                    tags: "array"
                },
                response: {
                    msg: "string"
                }
            }
        },
     }));

    app.post('/auth/register', authController.registerUser);
    app.post('/auth/verifyotp', authController.verifyOtp);
    app.post('/auth/resendotp', authController.resendOtp);
    app.get('/blog/list', blogController.list);
    app.post('/blog/addedit', authMiddleware, blogController.addedit);
    app.delete('/blog/delete', authMiddleware, blogController.deleteBlog);


    // app.post("/upload", upload.single("file"), fileController.fileUpload);
    // app.get('/sendmail', otherController.sendMail);

}