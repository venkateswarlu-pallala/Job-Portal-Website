const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import your DB connection function
const errorHandler = require('./middleware/errorHandler'); // Import error handler

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Use the custom error handler
// This MUST be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});