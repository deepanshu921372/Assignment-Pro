import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If the user is an admin, allow access to the admin dashboard
  if (isAdmin) {
    return <>{children}</>; // Render the children (Admin Dashboard)
  }

  // If the user is authenticated but not an admin, allow access to user dashboard
  return <>{children}</>; // Render the children (User Dashboard)
};

export default ProtectedRoute; 
