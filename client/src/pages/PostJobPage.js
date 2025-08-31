import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostJobPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState({
    title: '',
    companyName: '',
    location: '',
    salary: '',
    jobType: 'Full-Time',      // Added for the select dropdown
    experienceLevel: 'Mid-Level', // Added for the select dropdown
    skills: [],               // Added for the tag input
  });
  const [description, setDescription] = useState(''); // Separate state for rich text editor if used
  const [currentSkill, setCurrentSkill] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      const newSkill = currentSkill.trim();
      if (!jobDetails.skills.includes(newSkill)) {
        setJobDetails(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      }
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setJobDetails(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ...jobDetails, description, postedBy: user._id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to post job');
      setSuccess('Job posted successfully! Redirecting...');
      setTimeout(() => navigate(`/jobs/${data._id}`), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4">Post a New Job</h2>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Job Title</label>
                  <input type="text" className="form-control" id="title" name="title" value={jobDetails.title} onChange={handleChange} required />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="companyName" className="form-label">Company Name</label>
                    <input type="text" className="form-control" id="companyName" name="companyName" value={jobDetails.companyName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="location" name="location" value={jobDetails.location} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row">
                   <div className="col-md-4 mb-3">
                    <label htmlFor="jobType" className="form-label">Job Type</label>
                    <select className="form-select" id="jobType" name="jobType" value={jobDetails.jobType} onChange={handleChange}>
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="experienceLevel" className="form-label">Experience Level</label>
                    <select className="form-select" id="experienceLevel" name="experienceLevel" value={jobDetails.experienceLevel} onChange={handleChange}>
                      <option>Entry-Level</option>
                      <option>Mid-Level</option>
                      <option>Senior-Level</option>
                    </select>
                  </div>
                   <div className="col-md-4 mb-3">
                    <label htmlFor="salary" className="form-label">Salary (Annual)</label>
                    <input type="number" className="form-control" id="salary" name="salary" value={jobDetails.salary} onChange={handleChange} placeholder="Optional, e.g., 80000" />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="skills" className="form-label">Required Skills (press Enter to add)</label>
                  <div className="form-control d-flex flex-wrap gap-2">
                    {jobDetails.skills.map(skill => (
                      <span key={skill} className="badge bg-primary d-flex align-items-center">
                        {skill}
                        <button type="button" className="btn-close btn-close-white ms-2" style={{fontSize: '.6em'}} onClick={() => removeSkill(skill)}></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-grow-1 border-0"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      style={{ outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Job Description</label>
                  <textarea className="form-control" id="description" name="description" rows="6" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading ? 'Posting...' : 'Post Job'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;