const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')

const User = require('../../models/User');


// @route for api/users - register user - PUBLIC
router.post('/', [  // inside [ ] middlewarre express validator checking to see if these values match criteria.
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 5 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // if there are errors do the following
        return res.status(400).json({ errors: errors.array() }) // if errors send back an erray of errors.
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        // See if user exists
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });
        // Encrypt password

        const salt = await bcrypt.genSalt(10); // rounds (10) recommends the more rounds the more secure (10 recommended);

        user.password = await bcrypt.hash(password, salt);

        await user.save();  //anything that returns a promise you want to use await.

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