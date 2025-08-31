import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Assuming you have a shared CSS file for auth pages
import './LoginPage.css'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, userType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card shadow-lg">
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* The missing input fields are now added */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label htmlFor="userType" className="form-label">Register as</label>
              <select className="form-select" id="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="student">Student/Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
            <p className="mt-3 text-center">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;