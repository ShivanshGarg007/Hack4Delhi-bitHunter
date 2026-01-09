import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, FileText, TrendingUp, AlertTriangle, Users, LogOut, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = ['#EF4444', '#F59E0B', '#10B981'];

const OfficialDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API}/official/dashboard`);
      setDashboard(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#71C9CE]"></div>
      </div>
    );
  }

  const riskData = [
    { name: 'High Risk', value: dashboard?.high_risk_contracts || 0, color: '#EF4444' },
    { name: 'Medium Risk', value: dashboard?.medium_risk_contracts || 0, color: '#F59E0B' },
    { name: 'Low Risk', value: (dashboard?.total_contracts || 0) - (dashboard?.high_risk_contracts || 0) - (dashboard?.medium_risk_contracts || 0), color: '#10B981' },
  ];

  const fraudCategories = dashboard?.fraud_categories || {};

  return (
    <div className="min-h-screen bg-[#E3FDFD]">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-[#71C9CE]" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-slate-900">Sentinel</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, {user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Fraud Detection Dashboard</h1>
          <p className="text-slate-600">Overview of contract anomalies and risk indicators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-[#71C9CE]" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{dashboard?.total_contracts || 0}</p>
            <p className="text-sm text-slate-600">Total Contracts</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{dashboard?.high_risk_contracts || 0}</p>
            <p className="text-sm text-slate-600">High Risk Contracts</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-amber-500" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{dashboard?.pending_audits || 0}</p>
            <p className="text-sm text-slate-600">Pending Audits</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-[#71C9CE]" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{dashboard?.total_citizen_reports || 0}</p>
            <p className="text-sm text-slate-600">Citizen Reports</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Risk Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                data-testid="view-contracts-btn"
                onClick={() => navigate('/official/contracts')}
                className="w-full flex items-center justify-between p-4 bg-[#CBF1F5] hover:bg-[#A6E3E9] rounded-lg transition-colors duration-300"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-[#71C9CE]" />
                  <span className="font-medium text-slate-900">View All Contracts</span>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600" />
              </button>

              <button
                onClick={() => navigate('/official/contracts?risk=high')}
                className="w-full flex items-center justify-between p-4 bg-[#CBF1F5] hover:bg-[#A6E3E9] rounded-lg transition-colors duration-300"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-slate-900">High Risk Contracts</span>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600" />
              </button>

              <button
                onClick={() => navigate('/official/vendors')}
                className="w-full flex items-center justify-between p-4 bg-[#CBF1F5] hover:bg-[#A6E3E9] rounded-lg transition-colors duration-300"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-[#71C9CE]" />
                  <span className="font-medium text-slate-900">Vendor Intelligence</span>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Fraud Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(fraudCategories).map(([key, data]) => (
              <div key={key} className="p-4 bg-[#E3FDFD] rounded-lg border border-[#A6E3E9]">
                <h3 className="font-semibold text-slate-900 mb-2 capitalize">{key.replace(/_/g, ' ')}</h3>
                <p className="text-2xl font-bold text-[#71C9CE] mb-1">{data.total_flagged}</p>
                <p className="text-sm text-slate-600">Flagged Cases</p>
                <p className="text-xs text-emerald-600 mt-2">{data.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboard;