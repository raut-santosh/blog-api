const File = require('../models/file.model')

exports.fileUpload = async (req, res) => {
    console.log(req.file);
    let file = new File({
        name: req.file.originalname,
        alias: req.file.fieldname,
        path: req.file.path,
        type: req.file.mimetype,
        size: req.file.size,
        is_active: true,
    });
    file.save().then((result) => {
        result.msg = 'File Uploaded Successfully';
        res.json(result);
    }).catch((err) => {
        res.json(err);
    })

}