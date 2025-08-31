const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // --- IMPROVEMENT: Ensures email is always lowercase
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], // --- IMPROVEMENT: Validates email format
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // --- IMPROVEMENT: Enforces a minimum password length
  },
  userType: {
    type: String,
    enum: ['student', 'employer'],
    required: true,
  },
}, {
  timestamps: true, // --- IMPROVEMENT: Automatically adds createdAt and updatedAt fields
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);