const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Posts = require('../../models/Posts')


// @route GET for api/profile/me
router.get('/me', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); // populate the returned object with the 'user' fields 'name and 'avatar' 2nd param is an array of the desired fields you want populated.

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }



});

// @route POST for api/profile - create or update a user profile

router.post('/', [auth,
    [
        check('status', 'Status is required').not().isEmpty(),  // TO DO - IF YOU WANT TO REQUIRE SPECIFIC FIELDS IN USER PROFILE CHANGE THIS
        check('skills', 'Skills is required').not().isEmpty()
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

        await Posts.deleteMany({ user: req.user.id });
        await Profile.findOneAndRemove({ user: req.user.id }); //Remove profile
        await User.findOneAndDelete({ _id: req.user.id }); //Remove User

        res.json({ msg: 'User deleted' })

    } catch (error) {
        console.error(error.message)
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
        if (!errors.isEmpty()) {
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

// delete - api/profile/experience/:exp_id

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(500).send('Server Error');
    }
})

// put request to api/profile/education
router.put('/certifications',
    [auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty()
        ]
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // errors are returned with a method called .array() - will return all errors
        }

        const { school, degree, fieldofstudy, from, to, current, description } = req.body;

        const newEdu = { school, degree, fieldofstudy, from, to, current, description };

        try {

            const profile = await Profile.findOne({ user: req.user.id });

            profile.certifications.unshift(newEdu) // unshift like push but appends to front of array.

            await profile.save();

            res.json(profile);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }

    })

// delete - api/profile/education/:exp_id

router.delete('/certifications/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.certifications.map(item => item.id).indexOf(req.params.edu_id);

        profile.certifications.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(500).send('Server Error');
    }
})


// get - api/profile/github/:username - public
router.get('/github/:username', (req, res) => {

    try {

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:as&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }
            res.json(JSON.parse(body))
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

})


module.exports = router;