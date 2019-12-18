const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

//authenticate user and get token

router.post('/', [  
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // if there are errors do the following
        return res.status(400).json({ errors: errors.array() }) // if errors send back an erray of errors.
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        // See if user exists
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }


        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'), // pass in the payload from above and the secret from config file - default.json
            { expiresIn: 360000 },
            (err, token) => { //callback function that takes in error and the token
              if (err) throw err;
              res.json({ token });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

})

module.exports = router;