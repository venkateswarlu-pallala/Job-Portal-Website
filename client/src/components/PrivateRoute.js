import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component to protect routes that require authentication and specific roles.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 * @param {string[]} props.roles - An array of roles that are allowed to access the route.
 */
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. While authentication status is loading, show a loading indicator.
  if (loading) {
    return <div className="text-center py-5">Authenticating...</div>;
  }

  // 2. If the user is not logged in, redirect them to the login page.
  // We save the original location they tried to visit, so we can redirect back after login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If the user is logged in but their role is not in the allowed 'roles' array,
  // redirect them to the home page (or an "unauthorized" page if you have one).
  if (roles && !roles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  // 4. If all checks pass, render the child component.
  return children;
};

export default PrivateRoute;
