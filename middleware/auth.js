const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => { // middelware function that has access to req, res and next moves on to next function
  // Get token from header
  const token = req.header('x-auth-token');
 
  // If no token
  if(!token) {
      return res.status(401).json({ msg: 'No token, authorization denied'})
  }

  // Verify token
  try {

    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();

  } catch(err) {
    res.status(401).json({ msg: 'token is not valid' });
  }

}