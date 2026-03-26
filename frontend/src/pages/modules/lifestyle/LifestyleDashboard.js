import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ScanLine, AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LifestyleDashboard = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [formData, setFormData] = useState({ name: '', dob: '1980-01-01', address: 'Delhi' });

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`${API}/lifestyle/stats`),
        axios.get(`${API}/lifestyle/history?limit=5`)
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Please enter applicant name'); return; }
    setScanning(true); setScanResult(null);
    try {
      const response = await axios.post(`${API}/lifestyle/scan`, formData);
      setScanResult(response.data);
      fetchData();
      if (response.data.integrity_status === 'CLEAN') toast.success('Applicant is ELIGIBLE');
      else if (response.data.integrity_status === 'CRITICAL FRAUD') toast.error('CRITICAL FRAUD detected');
      else toast.warning('Review required for this applicant');
    } catch (error) {
      toast.error('Scan failed');
    } finally { setScanning(false); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CLEAN': return '#27ae60';
      case 'REVIEW REQUIRED': return '#e67e22';
      case 'CRITICAL FRAUD': return '#c0392b';
      default: return '#888';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CLEAN': return <span className="gov-badge-low">CLEAN</span>;
      case 'REVIEW REQUIRED': return <span className="gov-badge-medium">REVIEW REQUIRED</span>;
      case 'CRITICAL FRAUD': return <span className="gov-badge-high">CRITICAL FRAUD</span>;
      default: return <span className="gov-badge-blue">{status}</span>;
    }
  };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div className="animate-spin rounded-full" style={{ width: 32, height: 32, border: '3px solid #003087', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div style={{ padding: 24, background: '#F5F5F0', minHeight: '100%' }}>
      <div style={{ marginBottom: 16, borderBottom: '2px solid #FF6200', paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#003087', fontFamily: 'Noto Serif, Georgia, serif', margin: 0 }}>
            SATARK-360 Scanner
          </h1>
          <span style={{ background: '#6a0dad', color: '#fff', fontSize: 10, padding: '2px 6px', fontWeight: 700 }}>PRO</span>
        </div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
          AI-powered 360° lifestyle &amp; asset mismatch detection
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Scans', value: stats?.total_scans || 0, color: '#003087' },
          { label: 'Critical Fraud', value: stats?.status_distribution?.critical_fraud || 0, color: '#c0392b' },
          { label: 'Review Required', value: stats?.status_distribution?.review_required || 0, color: '#e67e22' },
          { label: 'Clean', value: stats?.status_distribution?.clean || 0, color: '#27ae60' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ccc', borderTop: `3px solid ${stat.color}`, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Scan Form */}
        <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
          <div style={{ background: '#003087', padding: '8px 14px' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>360° Profile Scan</span>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 14 }}>Enter applicant details to scan Family, Assets &amp; Lifestyle</p>
            <form onSubmit={handleScan}>
              <div style={{ marginBottom: 12 }}>
                <label className="gov-label">Head of Family Name</label>
                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar" required className="gov-input" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="gov-label">Date of Birth</label>
                <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  required className="gov-input" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="gov-label">Declared Address</label>
                <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full Address..." required className="gov-input" rows={3} />
              </div>
              <button type="submit" disabled={scanning} className="gov-btn-primary" style={{ width: '100%', padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: scanning ? 0.7 : 1 }}>
                {scanning ? (
                  <><div className="animate-spin rounded-full" style={{ width: 12, height: 12, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}></div> Scanning Authorities...</>
                ) : (
                  <><ScanLine style={{ width: 14, height: 14 }} /> Run Deep Scan</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Scan Result */}
        <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
          <div style={{ background: '#003087', padding: '8px 14px' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Scan Result</span>
          </div>
          <div style={{ padding: 16 }}>
            {scanResult ? (
              <div style={{ border: `2px solid ${getStatusColor(scanResult.integrity_status)}`, padding: 16 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  {scanResult.integrity_status === 'CLEAN'
                    ? <CheckCircle2 style={{ width: 48, height: 48, color: '#27ae60', margin: '0 auto 8px' }} />
                    : <AlertTriangle style={{ width: 48, height: 48, color: getStatusColor(scanResult.integrity_status), margin: '0 auto 8px' }} />
                  }
                  <div style={{ fontSize: 18, fontWeight: 700, color: getStatusColor(scanResult.integrity_status) }}>{scanResult.integrity_status}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{scanResult.system_message}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f5f5f0', border: '1px solid #ddd', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#555' }}>Risk Score</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: getStatusColor(scanResult.integrity_status) }}>{scanResult.risk_score}/100</span>
                </div>
                {scanResult.family_cluster?.length > 0 && (
                  <div style={{ padding: '8px 12px', background: '#f5f5f0', border: '1px solid #ddd', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Users style={{ width: 13, height: 13 }} /> Family Cluster
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {scanResult.family_cluster.map((member, i) => (
                        <span key={i} className="gov-badge-blue">{member}</span>
                      ))}
                    </div>
                  </div>
                )}
                {scanResult.assets_detected?.length > 0 && (
                  <div style={{ padding: '8px 12px', background: '#fff8f8', border: '1px solid #fdd', borderLeft: '3px solid #c0392b' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#c0392b', marginBottom: 6 }}>Assets Detected</div>
                    {scanResult.assets_detected.map((asset, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#555', marginBottom: 2 }}>• {asset}</div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
                <ScanLine style={{ width: 40, height: 40, margin: '0 auto 10px' }} />
                <p style={{ fontSize: 13 }}>Enter applicant details and run a scan to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
        <div style={{ background: '#003087', padding: '8px 14px' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Recent Scans</span>
        </div>
        <div style={{ padding: 14 }}>
          {history?.scans?.length > 0 ? (
            <table className="gov-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Scanned By</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {history.scans.map((scan, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{scan.applicant_name}</td>
                    <td>{scan.scanned_by_name}</td>
                    <td style={{ fontSize: 12, color: '#888' }}>{new Date(scan.scanned_at).toLocaleString()}</td>
                    <td>{getStatusBadge(scan.integrity_status)}</td>
                    <td style={{ fontWeight: 700, color: getStatusColor(scan.integrity_status) }}>{scan.risk_score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: 24, color: '#888', fontSize: 13 }}>No scans recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifestyleDashboard;
