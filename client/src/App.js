import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import JobListingPage from './pages/JobListingPage';
import JobDetailsPage from './pages/JobDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostJobPage from './pages/PostJobPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import PrivateRoute from './components/PrivateRoute'; // Corrected: Renamed from ProtectedRoute for consistency
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListingPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/post-job" element={
              <PrivateRoute roles={['employer']}>
                <PostJobPage />
              </PrivateRoute>
            } />
            <Route path="/my-applications" element={
              <PrivateRoute roles={['student']}>
                <MyApplicationsPage />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
