const Blog = require('../models/blog.model')
const User = require('../models/user.model')
const mongoose = require('mongoose');

exports.list = async (req, res) => {
    let blogs = await Blog.find({});
    if(blogs.length > 0) {
        return res.json({ blogs })
    }else{
        return res.status(404).json({ msg: 'No blogs found' });
    }
}

exports.addedit = async (req, res) => {
    let blog;
    if (req.body._id) {
        // update blog
        blog = await Blog.findOneAndUpdate({_id: req.body._id},{
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            files: req.body.files,
            likes: req.body.likes,
            tags: req.body.tags,
            comments: req.body.comments
        })
        return res.status(200).json({ msg: 'Blog saved successfully', blog });
    } else {
        // adding a new blog
        blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
            files: req.body.files,
            likes: 0,
            tags: req.body.tags,
            comments: [{}]
        });
        blog.save().then((result) => {
            return res.status(200).json({ msg: 'Blog saved successfully', blog });
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error while creating blog' });
        });
    }
};

exports.deleteBlog = (req, res) => {
    let user = User.findOne({_id: req.user._id});
    if(user){
        Blog.findOneAndDelete({_id: req.body._id}).then((result) => {
            if(!result){
                return res.status(404).json({ msg: 'Blog not found' });
            }
            return res.status(200).json({ msg: 'Blog deleted successfully',result });
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error while deleting blog' });
        });
    }else{
        return res.status(401).json({ msg: 'You are not authorized to delete this blog' });
    }
}