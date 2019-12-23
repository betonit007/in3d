const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route GET for api/profile/me
router.get('/me', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); // populate the returned object with the 'user' fields 'name and 'avatar' 2nd param is an array of the desired fields you want populated.

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    res.json(profile);

});

// @route POST for api/profile - create or update a user profile

router.post('/', [auth,
    [
        // check('status', 'Status is required').not().isEmpty(),  // TO DO - IF YOU WANT TO REQUIRE SPECIFIC FIELDS IN USER PROFILE CHANGE THIS
        // check('skills', 'Skills is required').not().isEmpty()
    ]
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

    // Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim()); //split turns into array and trim() removes any amount of spaces for each skill
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {

        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update if profile is found
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true } // returns updated profile
            );
            return res.json(profile);
        }

        // Create profile if one is not found
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

//get all profiles and populate with name and avatar
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']) //fields we want to add 'name and avatar' must in array form
        res.json(profiles);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

//get profile by user id - public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']) //fields we want to add 'name and avatar' must in array form

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' })
        }

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error');
    }
})

// delete route that deletes user, profile and post
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id }); //Remove profile
        await User.findOneAndDelete({ _id: req.user.id }); //Remove User

        res.json({ msg: 'User deleted' })

    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error');
    }
})

// put request to api/profile/experience
router.put('/experience',
    [auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('location', 'Location is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // errors are returned with a method called .array() - will return all errors
        }

        const { title, company, location, from, to, current, description } = req.body;

        const newExp = { title, company, location, from, to, current, description };

        try {
            
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp) // unshift like push but appends to front of array.

            await profile.save();

            res.json(profile);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }

    })


module.exports = router;