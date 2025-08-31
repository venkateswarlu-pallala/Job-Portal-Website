const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' }); // Increased expiration
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, userType } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, userType });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});