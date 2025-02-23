import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If the user is authenticated, redirect to the dashboard or home
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin-dashboard" />;
  }
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated; 