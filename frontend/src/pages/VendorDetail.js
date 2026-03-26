import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/official/vendors/${id}`);
      setVendor(r.data);
    } catch { toast.error('Failed to load vendor details'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchVendor(); }, [fetchVendor]);

  const getRiskBadge = (score) => {
    if (score >= 70) return <span className="gov-badge gov-badge-high">High Risk — {score}/100</span>;
    if (score >= 40) return <span className="gov-badge gov-badge-medium">Medium Risk — {score}/100</span>;
    return <span className="gov-badge gov-badge-low">Low Risk — {score}/100</span>;
  };

  if (loading) return (
    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="gov-spinner"></div>
    </div>
  );
  if (!vendor) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Vendor not found.</div>;

  return (
    <div style={{ padding: '22px 24px', minHeight: '100%' }}>
      <div className="gov-page-title-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/official/vendors')} className="gov-btn gov-btn-outline" style={{ padding: '5px 12px', fontSize: 12 }}>
            <ArrowLeft style={{ width: 13, height: 13 }} /> Back
          </button>
          <div>
            <h1 className="gov-page-title" style={{ fontSize: 17 }}>{vendor.company_name}</h1>
            <div className="gov-breadcrumb" style={{ marginBottom: 0, marginTop: 3 }}>
              <a href="/official/dashboard">Dashboard</a><span className="sep">›</span>
              <a href="/official/vendors">Vendors</a><span className="sep">›</span>
              <span>{vendor.company_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="gov-card" style={{ marginBottom: 16 }}>
        <div className="gov-card-header">
          <span>Vendor Summary</span>
          {getRiskBadge(vendor.risk_score)}
        </div>
        <div className="gov-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { icon: <FileText style={{ width: 16, height: 16 }} />, label: 'Total Contracts', value: vendor.total_contracts || 0, color: '#003087' },
              { icon: <AlertTriangle style={{ width: 16, height: 16 }} />, label: 'Delayed Projects', value: vendor.delayed_projects || 0, color: '#C0392B' },
              { icon: <Calendar style={{ width: 16, height: 16 }} />, label: 'Established', value: vendor.established_year, color: '#333' },
              { icon: <FileText style={{ width: 16, height: 16 }} />, label: 'Total Value', value: `₹${((vendor.total_value || 0) / 10000000).toFixed(2)} Cr`, color: '#138808' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#F7F7F3', border: '1px solid #E5E5E0', borderLeft: `3px solid ${s.color}`, padding: '12px 14px' }}>
                <div style={{ color: s.color, marginBottom: 5 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="gov-card" style={{ marginBottom: 16 }}>
        <div className="gov-card-header"><span>Company Information</span></div>
        <div className="gov-card-body" style={{ padding: 0 }}>
          <table className="gov-info-table">
            <tbody>
              {[
                ['Contact Person', vendor.contact_person],
                ['Email Address', vendor.email],
                ['Phone Number', vendor.phone],
                ['Registration No.', vendor.registration_number],
              ].map(([k, v], i) => (
                <tr key={i}>
                  <td>{k}</td>
                  <td style={{ fontFamily: k === 'Registration No.' ? 'Courier New, monospace' : 'inherit' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract History */}
      {vendor.contracts?.length > 0 && (
        <div className="gov-card">
          <div className="gov-card-header"><span>Contract History ({vendor.contracts.length})</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Department</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vendor.contracts.map(c => (
                  <tr key={c.id} onClick={() => navigate(`/official/contracts/${c.id}`)}>
                    <td style={{ fontWeight: 600, color: '#003087' }}>{c.project_name}</td>
                    <td style={{ fontSize: 12, color: '#555' }}>{c.department}</td>
                    <td style={{ fontWeight: 600 }}>₹{(c.contract_value / 10000000).toFixed(2)} Cr</td>
                    <td style={{ textTransform: 'capitalize', color: c.status === 'delayed' ? '#C0392B' : c.status === 'completed' ? '#138808' : '#003087', fontWeight: 600, fontSize: 12 }}>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;
