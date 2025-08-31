const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Middleware to protect routes (Authentication)
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Middleware to grant access to specific roles (Authorization)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userType)) {
      res.status(403); // 403 Forbidden
      throw new Error(`User role '${req.user?.userType}' is not authorized to access this route`);
    }
    next();
  };
};