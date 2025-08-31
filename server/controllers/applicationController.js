// ../controllers/applicationController.js

const Application = require('../models/Application');
const Job = require('../models/Job');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private/Student
exports.createApplication = asyncHandler(async (req, res) => {
  const { jobId, resumeUrl } = req.body;
  const studentId = req.user._id;

  // 1. Check if the user has already applied for this job
  const existingApplication = await Application.findOne({ studentId, jobId });
  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  const application = new Application({
    studentId,
    jobId,
    resumeUrl,
  });

  const newApplication = await application.save();
  res.status(201).json(newApplication);
});

// @desc    Get all applications for a specific job
// @route   GET /api/applications/:jobId
// @access  Private/Employer
exports.getApplicationsByJobId = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const employerId = req.user._id;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Security check: Ensure the requester is the job owner
  if (job.postedBy.toString() !== employerId.toString()) {
    res.status(403);
    throw new Error('Not authorized to view these applications');
  }

  const applications = await Application.find({ jobId }).populate(
    'studentId',
    'name email'
  );
  res.status(200).json(applications);
});

// @desc    Update application status
// @route   PATCH /api/applications/:applicationId/status
// @access  Private/Employer
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  const employerId = req.user._id;

  const application = await Application.findById(applicationId).populate('jobId');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Security check: Ensure the requester owns the job associated with the application
  if (application.jobId.postedBy.toString() !== employerId.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  application.status = status;
  await application.save();

  res.status(200).json(application);
});

// @desc    Get all applications for the logged-in student
// @route   GET /api/applications/my-applications
// @access  Private/Student
exports.getMyApplications = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const applications = await Application.find({ studentId }).populate(
    'jobId',
    'title companyName'
  );

  res.status(200).json(applications);
});