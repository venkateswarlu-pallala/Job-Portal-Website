const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true, // --- IMPROVEMENT: Improves search performance
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    index: true, // --- IMPROVEMENT: Improves search performance
  },
  description: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
  jobType: { // --- IMPROVEMENT: Added structured data field
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
    default: 'Full-Time',
  },
  experienceLevel: { // --- IMPROVEMENT: Added structured data field
    type: String,
    enum: ['Entry-Level', 'Mid-Level', 'Senior-Level', 'Manager'],
    default: 'Mid-Level',
  },
  skills: [{ type: String }], // --- IMPROVEMENT: Array of strings for skills
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // --- IMPROVEMENT: Replaces postedDate with createdAt/updatedAt
});

module.exports = mongoose.model('Job', jobSchema);