import React, { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';

const JobListingPage = () => {
  // 1. Initialize state with an empty array
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 2. Add state for error handling
  
  // 3. Add state for pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch jobs for the current page
        const response = await fetch(`http://localhost:5000/api/jobs?page=${page}`);
        const data = await response.json();

        // 4. Correctly handle the API response object
        if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          setTotalPages(data.totalPages);
        } else {
          throw new Error('Unexpected data format from API');
        }

      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Sorry, we couldn't load the jobs right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page]); // 5. Refetch jobs when the page number changes

  const handlePrevPage = () => setPage(p => Math.max(p - 1, 1));
  const handleNextPage = () => setPage(p => Math.min(p + 1, totalPages));

  if (loading) return <div className="text-center py-5">Loading jobs...</div>;
  if (error) return <div className="alert alert-danger text-center container">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Available Job Listings</h2>
      
      {jobs.length > 0 ? (
        <>
          <div className="row g-4">
            {jobs.map(job => (
              <div key={job._id} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <nav className="d-flex justify-content-center mt-5">
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handlePrevPage}>Previous</button>
              </li>
              <li className="page-item active" aria-current="page">
                <span className="page-link">{page} of {totalPages}</span>
              </li>
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handleNextPage}>Next</button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        // 6. Display a message when no jobs are found
        <div className="text-center">
          <p>No job listings found at the moment. Please check back later!</p>
        </div>
      )}
    </div>
  );
};

export default JobListingPage;