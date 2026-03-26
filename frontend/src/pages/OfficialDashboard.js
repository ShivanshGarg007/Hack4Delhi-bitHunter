import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, AlertTriangle, TrendingUp, Users, ArrowRight, UserSearch, Link2, ScanLine } from 'lucide-react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className={`gov-stat-card ${color}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 11, color: '#777', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#1C1C1C', lineHeight: 1 }}>{value}</div>
      </div>
      <div style={{ opacity: 0.12 }}>
        <Icon style={{ width: 36, height: 36 }} />
      </div>
    </div>
  </div>
);

const OfficialDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/official/dashboard`);
      setDashboard(r.data);
    } catch { toast.error('Failed to load dashboard data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) return (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="gov-spinner"></div>
      <div style={{ fontSize: 13, color: '#777' }}>Loading dashboard data…</div>
    </div>
  );

  const riskData = [
    { name: 'High Risk', value: dashboard?.high_risk_contracts || 0, color: '#C0392B' },
    { name: 'Medium Risk', value: dashboard?.medium_risk_contracts || 0, color: '#D68910' },
    { name: 'Low Risk', value: Math.max(0, (dashboard?.total_contracts || 0) - (dashboard?.high_risk_contracts || 0) - (dashboard?.medium_risk_contracts || 0)), color: '#138808' },
  ];

  const fraudCategories = dashboard?.fraud_categories || {};

  const modules = [
    { icon: UserSearch, title: 'Welfare Fraud Detection', desc: 'Cross-reference applicants against Vahan & Discom databases using ML models.', path: '/official/welfare', color: '#003087' },
    { icon: Link2, title: 'PDS Ledger (Kawach)', desc: 'Blockchain-based tamper-proof Public Distribution System transaction tracking.', path: '/official/ledger', color: '#6A0DAD' },
    { icon: ScanLine, title: 'SATARK-360 Lifestyle Scan', desc: 'AI-powered 360° asset & lifestyle mismatch detection for field officers.', path: '/official/lifestyle', color: '#138808' },
  ];

  return (
    <div style={{ padding: '22px 24px', minHeight: '100%' }}>

      {/* Page title */}
      <div className="gov-page-title-bar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="gov-page-title">Fraud Detection Dashboard</h1>
            <div className="gov-page-subtitle">
              Welcome, <strong>{user?.full_name || 'Official'}</strong> &nbsp;|&nbsp; Overview of contract anomalies and risk indicators
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#999', textAlign: 'right' }}>
            Last refreshed: {new Date().toLocaleTimeString('en-IN')}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="Total Contracts" value={dashboard?.total_contracts || 0} color="navy" icon={FileText} />
        <StatCard label="High Risk Contracts" value={dashboard?.high_risk_contracts || 0} color="red" icon={AlertTriangle} />
        <StatCard label="Pending Audits" value={dashboard?.pending_audits || 0} color="amber" icon={TrendingUp} />
        <StatCard label="Citizen Reports" value={dashboard?.total_citizen_reports || 0} color="green" icon={Users} />
      </div>

      {/* Charts + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* Pie chart */}
        <div className="gov-card">
          <div className="gov-card-header"><span>Risk Distribution</span></div>
          <div className="gov-card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" outerRadius={80} innerRadius={30} dataKey="value" paddingAngle={2}>
                  {riskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="gov-card">
          <div className="gov-card-header"><span>Quick Actions</span></div>
          <div className="gov-card-body" style={{ padding: '12px 14px' }}>
            {[
              { icon: FileText, label: 'View All Contracts', sub: `${dashboard?.total_contracts || 0} total`, path: '/official/contracts', testId: 'view-contracts-btn', color: '#003087' },
              { icon: AlertTriangle, label: 'High Risk Contracts', sub: `${dashboard?.high_risk_contracts || 0} flagged`, path: '/official/contracts?risk=high', color: '#C0392B' },
              { icon: Users, label: 'Vendor Intelligence', sub: 'Risk-scored vendors', path: '/official/vendors', color: '#6A0DAD' },
            ].map((action, i) => (
              <button
                key={i}
                data-testid={action.testId}
                onClick={() => navigate(action.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', background: '#F7F7F3',
                  border: '1px solid #E5E5E0', borderLeft: `3px solid ${action.color}`,
                  cursor: 'pointer', marginBottom: 8, transition: 'background 0.12s',
                  borderRadius: 2,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EBF0FA'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F7F7F3'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <action.icon style={{ width: 16, height: 16, color: action.color }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{action.label}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{action.sub}</div>
                  </div>
                </div>
                <ArrowRight style={{ width: 14, height: 14, color: '#AAA' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fraud Categories */}
      {Object.keys(fraudCategories).length > 0 && (
        <div className="gov-card" style={{ marginBottom: 20 }}>
          <div className="gov-card-header"><span>Fraud Categories Overview</span></div>
          <div className="gov-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {Object.entries(fraudCategories).map(([key, data]) => (
                <div key={key} style={{ background: '#F7F7F3', border: '1px solid #E5E5E0', borderLeft: '3px solid #E8500A', padding: '12px 14px' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#444', marginBottom: 6, textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#E8500A', lineHeight: 1 }}>{data.total_flagged}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Flagged Cases</div>
                  <div style={{ fontSize: 11, color: '#138808', marginTop: 3, fontWeight: 600 }}>{data.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrated Modules */}
      <div className="gov-card">
        <div className="gov-card-header"><span>Fraud Detection Modules</span></div>
        <div className="gov-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {modules.map(mod => (
              <button
                key={mod.path}
                onClick={() => navigate(mod.path)}
                style={{
                  background: '#F7F7F3', border: '1px solid #E5E5E0',
                  borderTop: `3px solid ${mod.color}`,
                  padding: '16px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s', borderRadius: 2,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EBF0FA'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,48,135,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F7F7F3'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <mod.icon style={{ width: 22, height: 22, color: mod.color, marginBottom: 10 }} />
                <div style={{ fontWeight: 700, fontSize: 13.5, color: '#1C1C1C', marginBottom: 5, fontFamily: 'Noto Serif, Georgia, serif' }}>{mod.title}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>{mod.desc}</div>
                <div style={{ fontSize: 12, color: mod.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Open Module <ArrowRight style={{ width: 12, height: 12 }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboard;
