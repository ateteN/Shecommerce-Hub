const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name');
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add post
router.post('/', async (req, res) => {
    const { user, title, content } = req.body;
    try {
        const post = new Post({ user, title, content });
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
