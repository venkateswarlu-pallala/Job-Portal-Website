import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => {
  return (
    <div className="card job-card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{job.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{job.companyName}</h6>
        <p className="card-text text-secondary">{job.location}</p>
        <p className="card-text fw-bold">
          ${job.salary ? job.salary.toLocaleString() : 'Not specified'}
        </p>
        <div className="mt-auto pt-2">
          <Link to={`/jobs/${job._id}`} className="btn btn-outline-primary">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;