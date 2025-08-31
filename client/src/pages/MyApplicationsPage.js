// src/pages/MyApplicationsPage.jsx (New File)

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/applications/my-applications', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications.');
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (loading) return <div className="text-center py-5">Loading your applications...</div>;
  if (error) return <div className="alert alert-danger container">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">My Job Applications</h2>
      {applications.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <Link to={`/jobs/${app.jobId._id}`}>{app.jobId.title}</Link>
                  </td>
                  <td>{app.jobId.companyName}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">
          <p>You haven't applied to any jobs yet.</p>
          <Link to="/" className="btn btn-primary">Browse Jobs</Link>
        </div>
      )}
    </div>
  );
};

// Helper function to assign colors to statuses
const getStatusColor = (status) => {
  switch (status) {
    case 'Submitted':
      return 'secondary';
    case 'Viewed':
      return 'info';
    case 'Interviewing':
      return 'primary';
    case 'Offered':
      return 'success';
    case 'Rejected':
      return 'danger';
    default:
      return 'light';
  }
};

export default MyApplicationsPage;