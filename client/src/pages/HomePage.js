import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      <header className="hero-section text-white text-center">
        <div className="container">
          <h1 className="display-4">Find Your Dream Job</h1>
          <p className="lead">Search through thousands of job listings from top companies.</p>
          <Link to="/jobs" className="btn btn-primary btn-lg mt-3">Browse All Jobs</Link>
        </div>
      </header>
      {/* You can add more sections here like latest jobs, categories etc. */}
    </div>
  );
};

export default HomePage;