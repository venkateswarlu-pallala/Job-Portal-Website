// ../routes/applicationRoutes.js

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route for students to create an application
router.post('/', protect, authorize('student'), applicationController.createApplication);

// Route for students to get their own applications
router.get('/my-applications', protect, authorize('student'), applicationController.getMyApplications);

// Route for employers to get all applications for a specific job
router.get('/:jobId', protect, authorize('employer'), applicationController.getApplicationsByJobId);

// Route for employers to update an application's status
router.patch('/:applicationId/status', protect, authorize('employer'), applicationController.updateApplicationStatus);

// Ensure this line is at the end of the file
module.exports = router;