const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route POST post a message - Private
router.post('/', [auth,
    [
        check('text', 'Text is required')
            .not()
            .isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // array method from errors object returns an array of errors
        }

        try {
            const user = await User.findById(req.user.id).select('-password'); // do not send back password

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save();

            res.json(post);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    })

// route GET - Private - get all posts
router.get('/', auth, async (req, res) => {
    try {

        const posts = await Post.find().sort({ date: -1 }); //sort by date (-1 , most recent first);
        res.send(posts);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

// route GET - Private - get post by id
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' }) //404 - not found status
        }
        res.json(post);

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})

//route DELETE - Private - delete post by id
router.delete('/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        //Check User
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove();
        res.json({ msg: 'Post removed' });

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})

router.put('/like/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        //check if post has already been liked by user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) { // if the filter array returns at length greater than zero than user has already liked
          return res.status(400).json({ msg: 'Post already liked' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();

        res.json(post.likes);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

router.put('/unlike/:id', auth, async (req, res) => {
  
    try {
        
      const post = await Post.findById(req.params.id)
      //Check to see if post has been liked
      if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({ msg: 'Post has not been liked yet'})
      }
      
      const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id); //maps all likes to array and converts to string then finds the index of the post to unlike.
      
      post.likes.splice(removeIndex, 1);

      await post.save();

      res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;