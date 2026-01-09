import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import ProjectDetail from './pages/ProjectDetail';
import OfficialLogin from './pages/OfficialLogin';
import OfficialDashboard from './pages/OfficialDashboard';
import ContractsList from './pages/ContractsList';
import ContractDetail from './pages/ContractDetail';
import VendorsList from './pages/VendorsList';
import VendorDetail from './pages/VendorDetail';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/citizen/projects/:id" element={<ProjectDetail />} />
          
          <Route path="/official/login" element={<OfficialLogin />} />
          
          <Route path="/official/dashboard" element={
            <ProtectedRoute>
              <OfficialDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/official/contracts" element={
            <ProtectedRoute>
              <ContractsList />
            </ProtectedRoute>
          } />
          
          <Route path="/official/contracts/:id" element={
            <ProtectedRoute>
              <ContractDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/official/vendors" element={
            <ProtectedRoute>
              <VendorsList />
            </ProtectedRoute>
          } />
          
          <Route path="/official/vendors/:id" element={
            <ProtectedRoute>
              <VendorDetail />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;