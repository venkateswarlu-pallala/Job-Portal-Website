// server/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
   status: {
    type: String,
    enum: ['Submitted', 'Viewed', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Submitted',
   },
});

module.exports = mongoose.model('Application', applicationSchema);