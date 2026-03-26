import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserSearch, AlertTriangle, CheckCircle2, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const WelfareDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchStats = useCallback(async () => {
    try { const r = await axios.get(`${API}/welfare/stats`); setStats(r.data); } catch {}
  }, []);

  const fetchHistory = useCallback(async () => {
    try { const r = await axios.get(`${API}/welfare/history?limit=10`); setResults(r.data); }
    catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); fetchHistory(); }, [fetchStats, fetchHistory]);

  const runBulkAnalysis = async () => {
    setAnalyzing(true);
    try {
      const r = await axios.get(`${API}/welfare/analyze`);
      toast.success(`Analyzed ${r.data.total_analyzed} applicants`);
      fetchStats(); fetchHistory();
    } catch { toast.error('Failed to run bulk analysis'); }
    finally { setAnalyzing(false); }
  };

  const getRiskBadge = (s) => {
    if (s === 'red') return <span className="gov-badge gov-badge-high">High Risk</span>;
    if (s === 'yellow') return <span className="gov-badge gov-badge-medium">Medium Risk</span>;
    if (s === 'green') return <span className="gov-badge gov-badge-low">Low Risk</span>;
    return <span className="gov-badge gov-badge-blue">Unknown</span>;
  };

  if (loading) return (
    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="gov-spinner"></div>
    </div>
  );

  return (
    <div style={{ padding: '22px 24px', minHeight: '100%' }}>
      <div className="gov-page-title-bar">
        <h1 className="gov-page-title">Welfare Fraud Detection</h1>
        <div className="gov-page-subtitle">Cross-reference welfare applicants against Vahan &amp; Discom databases</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Scans', value: stats?.total_scans || 0, color: 'navy' },
          { label: 'High Risk', value: stats?.risk_distribution?.high_risk || 0, color: 'red' },
          { label: 'Medium Risk', value: stats?.risk_distribution?.medium_risk || 0, color: 'amber' },
          { label: 'Low Risk', value: stats?.risk_distribution?.low_risk || 0, color: 'green' },
        ].map((s, i) => (
          <div key={i} className={`gov-stat-card ${s.color}`}>
            <div style={{ fontSize: 11, color: '#777', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#1C1C1C' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={runBulkAnalysis} disabled={analyzing} className="gov-btn gov-btn-primary">
          {analyzing ? <><div className="gov-spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></div> Analyzing…</> : <><Search style={{ width: 14, height: 14 }} /> Run Bulk Analysis</>}
        </button>
        <button onClick={() => navigate('/official/welfare/scan')} className="gov-btn gov-btn-outline">
          <UserSearch style={{ width: 14, height: 14 }} /> Scan Individual Applicant
        </button>
      </div>

      <div className="gov-card">
        <div className="gov-card-header"><span>Recent Scans</span></div>
        {results?.scans?.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead><tr><th>Applicant Name</th><th>Declared Income</th><th>Risk Status</th><th>Flags</th></tr></thead>
              <tbody>
                {results.scans.map((scan, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{scan.name}</td>
                    <td>₹{scan.declared_income?.toLocaleString() || 'N/A'}</td>
                    <td>{getRiskBadge(scan.risk_status)}</td>
                    <td style={{ color: '#888', fontSize: 12 }}>{scan.flags?.length > 0 ? `${scan.flags.length} flag(s)` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <UserSearch style={{ width: 32, height: 32, margin: '0 auto 10px', color: '#CCC' }} />
            <p style={{ fontSize: 13 }}>No scans yet. Run a bulk analysis or scan an individual applicant.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelfareDashboard;
