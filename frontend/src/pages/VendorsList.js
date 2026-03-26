import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const VendorsList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API}/official/vendors`)
      .then(r => setVendors(r.data.vendors))
      .catch(() => toast.error('Failed to load vendors'))
      .finally(() => setLoading(false));
  }, []);

  const getRiskBadge = (score) => {
    if (score >= 70) return <span className="gov-badge gov-badge-high">{score}</span>;
    if (score >= 40) return <span className="gov-badge gov-badge-medium">{score}</span>;
    return <span className="gov-badge gov-badge-low">{score}</span>;
  };

  const filtered = vendors.filter(v =>
    v.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '22px 24px', minHeight: '100%' }}>
      <div className="gov-page-title-bar">
        <h1 className="gov-page-title">Vendor Intelligence</h1>
        <div className="gov-breadcrumb" style={{ marginBottom: 0, marginTop: 4 }}>
          <a href="/official/dashboard">Dashboard</a><span className="sep">›</span>
          <span>Contract Intelligence</span><span className="sep">›</span>
          <span>Vendors</span>
        </div>
      </div>

      <div className="gov-card">
        <div className="gov-card-header">
          <span>Registered Vendors — {filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #E8E8E3', background: '#F7F7F3' }}>
          <div style={{ position: 'relative', maxWidth: 420 }}>
            <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#999' }} />
            <input
              type="text"
              data-testid="search-vendors-input"
              placeholder="Search by company name or registration number…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="gov-input"
              style={{ paddingLeft: 30 }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div className="gov-spinner"></div>
            <div style={{ fontSize: 13, color: '#777' }}>Loading vendors…</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Registration No.</th>
                  <th>Established</th>
                  <th style={{ textAlign: 'center' }}>Total Contracts</th>
                  <th style={{ textAlign: 'center' }}>Delayed</th>
                  <th style={{ textAlign: 'center' }}>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} data-testid="vendor-card" onClick={() => navigate(`/official/vendors/${v.id}`)}>
                    <td style={{ fontWeight: 600, color: '#003087' }}>{v.company_name}</td>
                    <td style={{ fontFamily: 'Courier New, monospace', fontSize: 12, color: '#555' }}>{v.registration_number}</td>
                    <td>{v.established_year}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{v.total_contracts || 0}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: (v.delayed_projects || 0) > 0 ? '#C0392B' : '#138808' }}>
                      {v.delayed_projects || 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>{getRiskBadge(v.risk_score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 13 }}>No vendors found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsList;
