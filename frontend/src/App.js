import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';

// Core Pages
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import ProjectDetail from './pages/ProjectDetail';
import OfficialLogin from './pages/OfficialLogin';
import OfficialDashboard from './pages/OfficialDashboard';
import ContractsList from './pages/ContractsList';
import ContractDetail from './pages/ContractDetail';
import VendorsList from './pages/VendorsList';
import VendorDetail from './pages/VendorDetail';

// Integrated Module Pages (from h4d, kawach-ledger, lifestyle_mismatch)
import OfficialLayout from './components/layouts/OfficialLayout';
import WelfareDashboard from './pages/modules/welfare/WelfareDashboard';
import WelfareScanIndividual from './pages/modules/welfare/WelfareScanIndividual';
import LedgerDashboard from './pages/modules/ledger/LedgerDashboard';
import LifestyleDashboard from './pages/modules/lifestyle/LifestyleDashboard';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/citizen/projects/:id" element={<ProjectDetail />} />
          
          {/* Official Auth */}
          <Route path="/official/login" element={<OfficialLogin />} />
          
          {/* Official Portal (Protected with Sidebar Layout) */}
          <Route path="/official" element={
            <ProtectedRoute>
              <OfficialLayout />
            </ProtectedRoute>
          }>
            {/* Core Modules */}
            <Route path="dashboard" element={<OfficialDashboard />} />
            <Route path="contracts" element={<ContractsList />} />
            <Route path="contracts/:id" element={<ContractDetail />} />
            <Route path="vendors" element={<VendorsList />} />
            <Route path="vendors/:id" element={<VendorDetail />} />
            
            {/* Integrated Fraud Detection Modules */}
            <Route path="welfare" element={<WelfareDashboard />} />
            <Route path="welfare/scan" element={<WelfareScanIndividual />} />
            <Route path="ledger" element={<LedgerDashboard />} />
            <Route path="lifestyle" element={<LifestyleDashboard />} />
            
            {/* Default redirect */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;