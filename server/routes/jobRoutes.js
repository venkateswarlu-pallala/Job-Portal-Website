const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getJobs);
router.route('/:id').get(getJobById);
router.route('/').post(protect, authorize('employer'), createJob);

// Ensure this line is at the end of the file
module.exports = router;