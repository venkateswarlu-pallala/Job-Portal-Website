import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the employer's view
  const [applications, setApplications] = useState([]);

  // State for the student's application modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // The unused 'resumeUrl' state has been removed from here
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        // Fetch job details
        const jobRes = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const jobData = await jobRes.json();
        setJob(jobData);

        // If the user is an employer and owns this job, fetch applications
        if (user && user.userType === 'employer' && user._id === jobData.postedBy) {
          const appRes = await fetch(`http://localhost:5000/api/applications/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const appData = await appRes.json();
          setApplications(appData);
        }
      } catch (err) {
        setError("Failed to load job details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApplications();
  }, [id, user]);

  // Handler for submitting an application
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ jobId: id, resumeUrl: 'placeholder.pdf' }),
      });
      if (!response.ok) throw new Error('Application failed');
      alert('Application submitted successfully!');
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for employer changing an application status
  const handleStatusChange = async (applicationId, newStatus) => {
    setApplications(prev => 
      prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
    );

    try {
      await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger container">{error}</div>;
  if (!job) return <div className="text-center py-5">Job not found.</div>;
  
  const isJobOwner = user && user.userType === 'employer' && user._id === job.postedBy;

  return (
    <div className="container py-5">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h2>{job.title}</h2>
          <h4 className="text-muted">{job.companyName}</h4>
        </div>
        <div className="card-body">
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> ${job.salary ? job.salary.toLocaleString() : 'Not specified'}</p>
          <hr />
          <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
          {user?.userType === 'student' && (
            <button className="btn btn-primary mt-3" onClick={() => setIsModalOpen(true)}>Apply Now</button>
          )}
        </div>
      </div>

      {isJobOwner && (
        <div className="card shadow-sm">
          <div className="card-header">
            <h3>Job Applicants ({applications.length})</h3>
          </div>
          <div className="card-body">
            {applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Email</th>
                      <th>Applied On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app._id}>
                        <td>{app.studentId.name}</td>
                        <td>{app.studentId.email}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select 
                            className="form-select form-select-sm" 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            <option>Submitted</option>
                            <option>Viewed</option>
                            <option>Interviewing</option>
                            <option>Offered</option>
                            <option>Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No applications yet.</p>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for {job.title}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleApplicationSubmit}>
                <div className="modal-body">
                  <p>You are applying as <strong>{user.name}</strong>.</p>
                  <div className="mb-3">
                    <label htmlFor="resume" className="form-label">Resume</label>
                    <input type="file" className="form-control" id="resume" />
                    <small className="form-text text-muted">File upload is a placeholder for now.</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;