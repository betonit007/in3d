const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User')


// @route GET for api/users - PUBLIC
router.get('/', auth, async (req, res) => {
  
    try {
        const user = await User.findById(req.user.id).select('-password'); // leave off password
        res.json(user);
    } catch(err) {
        console.error(err);
        res.statue(500).send('Server Error');
    }
})

module.exports = router;