import React from 'react'; // 'useState' has been removed from this line
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">JobPortal</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/jobs">Job Listings</NavLink>
            </li>
            {user?.userType === 'employer' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/post-job">Post a Job</NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                {/* This 'a' tag has been changed to a 'button' to fix the accessibility warning */}
                <button className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-primary ms-lg-2" to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;