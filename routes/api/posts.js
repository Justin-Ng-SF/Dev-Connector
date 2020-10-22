const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route Post api/ posts
//@desc create a post
//@access priv
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        

        //fetched from the database using the id as the token
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }


});

//@route get api/posts
//@desc get all posts
//@access priv ( can be public) 
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });//-1 most recent, oldest is 1

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route get api/posts/:id
//@desc get post by id
//@access priv 
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind==='ObjectId') {//if true, it is not a formated id
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});


//@route get api/posts
//@desc get all posts
//@access priv ( can be public) 
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });//-1 most recent, oldest is 1

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route delete api/post/:id
//@desc delete post by id
//@access priv 
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        //check user
            //post.user is orignally an object
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        res.json({msg: 'Post removed'});
    } catch (err) {
        console.error(err.message);
        if (err.kind==='ObjectId') {//if true, it is not a formated id
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route put api/posts/like/:id
//@desc like a post
//@access priv 
router.put('/like/:id', auth, async(req, res)=> {
    try {
        const post = await Post.findById(req.params.id);

        //check if post has been liked by user already
        //post.likes of type array (filter through where filter takes in a function)
        //comparing current user to user logged in
        //remember to turn like.user into a string
        //req.user.id is the user logged in
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route put api/posts/like/:id
//@desc like a post
//@access priv 
router.put('/unlike/:id', auth, async(req, res)=> {
    try {
        const post = await Post.findById(req.params.id);

        //check if post has been liked by user already
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ msg: 'Post not yet liked' });
        }

        //get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json({ msg: 'Post unliked' })
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route Post api/posts/comment/:id
//@desc comment on post
//@access priv
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],
    async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);//get post

        const newComment = {//not a collection in database
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();
        

        //fetched from the database using the id as the token
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }


});

//@route delete api/posts/comment/:id/:comment_id
//@desc delete a comment
//@access priv
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //test if comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        //check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);
        
        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//exporter
module.exports = router;