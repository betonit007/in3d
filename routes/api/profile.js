const express = require('express');
const router = express.Router();


// @route GET for api/users - PUBLIC
router.get('/', (req, res) => res.send('Profile Route'))

module.exports = router;