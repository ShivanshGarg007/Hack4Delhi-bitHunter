import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin rounded-full" style={{ width: 40, height: 40, border: '3px solid #003087', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px' }}></div>
          <div style={{ fontSize: 13, color: '#666' }}>Authenticating...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/official/login" replace />;
  }

  return children;
};

export default ProtectedRoute;