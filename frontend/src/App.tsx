import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useTheme } from './hooks/useTheme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SubmitAssignment from './pages/SubmitAssignment';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import EditPricing from './pages/EditPricing';

function App() {
  const { theme } = useTheme();

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<RedirectIfAuthenticated><Home /></RedirectIfAuthenticated>} />
              <Route 
                path="/login" 
                element={
                  <RedirectIfAuthenticated>
                    <Login />
                  </RedirectIfAuthenticated>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <RedirectIfAuthenticated>
                    <SignUp />
                  </RedirectIfAuthenticated>
                } 
              />
              <Route path="/submit-assignment" element={<ProtectedRoute><SubmitAssignment /></ProtectedRoute>} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/edit-pricing" element={<ProtectedRoute><EditPricing /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;