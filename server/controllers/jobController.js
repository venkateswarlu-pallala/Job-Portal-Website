const Job = require('../models/Job');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private/Employer
exports.createJob = asyncHandler(async (req, res) => {
  // 1. Explicitly pick fields instead of trusting req.body completely
  const { title, companyName, location, description, salary, jobType, experienceLevel, skills } = req.body;
  
  // 2. Link the job to the employer who is creating it
  const postedBy = req.user._id;

  const newJob = new Job({
    title,
    companyName,
    location,
    description,
    salary,
    jobType,
    experienceLevel,
    skills,
    postedBy,
  });

  const savedJob = await newJob.save();
  res.status(201).json(savedJob);
});

// @desc    Get all jobs with filtering, pagination, and sorting
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
  const { search, location, jobType, page = 1, limit = 10 } = req.query;
  
  // 1. Build the query object for filtering
  const query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
  }
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  if (jobType) {
    query.jobType = jobType;
  }

  // 2. Pagination logic
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // 3. Execute query and get total count for pagination
  const jobs = await Job.find(query)
    .sort({ postedDate: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limitNumber);
    
  const totalJobs = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalJobs / limitNumber);

  res.status(200).json({
    jobs,
    currentPage: pageNumber,
    totalPages,
    totalJobs,
  });
});

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});