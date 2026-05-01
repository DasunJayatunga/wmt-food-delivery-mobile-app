const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token using the same secret that will be used to create it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // decoded = { id, role } (or whatever you put in the token payload)
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
