import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Calendar, DollarSign, User, MapPin, FileCheck, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchContract = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/official/contracts/${id}`);
      setContract(r.data);
    } catch { toast.error('Failed to load contract details'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchContract(); }, [fetchContract]);

  const handleAuditAction = async (e) => {
    e.preventDefault();
    if (!actionType) { toast.error('Please select an action'); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/official/contracts/${id}/audit-action`, { action: actionType, notes });
      toast.success('Audit action recorded');
      setActionType(''); setNotes('');
      fetchContract();
    } catch { toast.error('Failed to record audit action'); }
    finally { setSubmitting(false); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  const getRiskBadge = (score) => {
    if (score >= 70) return <span className="gov-badge gov-badge-high">High Risk — {score}/100</span>;
    if (score >= 40) return <span className="gov-badge gov-badge-medium">Medium Risk — {score}/100</span>;
    return <span className="gov-badge gov-badge-low">Low Risk — {score}/100</span>;
  };

  if (loading) return (
    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="gov-spinner"></div>
      <div style={{ fontSize: 13, color: '#777' }}>Loading contract details…</div>
    </div>
  );
  if (!contract) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Contract not found.</div>;

  return (
    <div style={{ padding: '22px 24px', minHeight: '100%' }}>
      <div className="gov-page-title-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/official/contracts')} className="gov-btn gov-btn-outline" style={{ padding: '5px 12px', fontSize: 12 }}>
            <ArrowLeft style={{ width: 13, height: 13 }} /> Back
          </button>
          <div>
            <h1 className="gov-page-title" style={{ fontSize: 17 }}>{contract.project_name}</h1>
            <div className="gov-breadcrumb" style={{ marginBottom: 0, marginTop: 3 }}>
              <a href="/official/dashboard">Dashboard</a><span className="sep">›</span>
              <a href="/official/contracts">Contracts</a><span className="sep">›</span>
              <span>Detail</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="gov-card" style={{ marginBottom: 16 }}>
        <div className="gov-card-header">
          <span>Contract Summary</span>
          {getRiskBadge(contract.fraud_risk_score)}
        </div>
        <div className="gov-card-body">
          <p style={{ fontSize: 13, color: '#555', marginBottom: 16, lineHeight: 1.65 }}>{contract.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Contract Value', value: `₹${(contract.contract_value / 10000000).toFixed(2)} Cr`, color: '#003087' },
              { label: 'Contractor', value: contract.contractor_name, color: '#333' },
              { label: 'Status', value: contract.status, color: contract.status === 'delayed' ? '#C0392B' : '#138808' },
              { label: 'Audit Status', value: contract.audit_status, color: '#D68910' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#F7F7F3', border: '1px solid #E5E5E0', borderLeft: `3px solid ${s.color}`, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color, textTransform: 'capitalize' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Explanations */}
      {contract.fraud_explanations?.length > 0 && (
        <div className="gov-card-saffron" style={{ marginBottom: 16 }}>
          <div className="gov-card-header-saffron">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle style={{ width: 14, height: 14 }} />
              <span>Risk Explanation ({contract.fraud_explanations.length} factor{contract.fraud_explanations.length !== 1 ? 's' : ''})</span>
            </div>
          </div>
          <div className="gov-card-body">
            {contract.fraud_explanations.map((exp, i) => (
              <div key={i} className="gov-alert gov-alert-warning" style={{ marginBottom: 6 }}>
                <AlertTriangle style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }} />
                <span>{exp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Contract Details */}
        <div className="gov-card">
          <div className="gov-card-header"><span>Contract Details</span></div>
          <div className="gov-card-body" style={{ padding: 0 }}>
            <table className="gov-info-table">
              <tbody>
                {[
                  ['Department', contract.department],
                  ['Location', `${contract.location?.city}, ${contract.location?.state}`],
                  ['Start Date', fmt(contract.start_date)],
                  ['Expected Completion', fmt(contract.expected_completion)],
                  ['Number of Bidders', contract.bidder_count],
                ].map(([k, v], i) => (
                  <tr key={i}><td>{k}</td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="gov-card">
          <div className="gov-card-header"><span>Vendor Information</span></div>
          <div className="gov-card-body">
            {contract.vendor_details ? (
              <>
                <table className="gov-info-table" style={{ marginBottom: 14 }}>
                  <tbody>
                    {[
                      ['Company Name', contract.vendor_details.company_name],
                      ['Registration No.', contract.vendor_details.registration_number],
                      ['Vendor Risk Score', `${contract.vendor_details.risk_score}/100`],
                    ].map(([k, v], i) => (
                      <tr key={i}><td>{k}</td><td style={{ fontFamily: k === 'Registration No.' ? 'Courier New, monospace' : 'inherit' }}>{v}</td></tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => navigate(`/official/vendors/${contract.contractor_id}`)} className="gov-btn gov-btn-primary" style={{ fontSize: 12 }}>
                  View Full Vendor Profile →
                </button>
              </>
            ) : (
              <p style={{ fontSize: 13, color: '#888' }}>Vendor information not available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Citizen Reports */}
      {contract.citizen_reports?.length > 0 && (
        <div className="gov-card" style={{ marginBottom: 16 }}>
          <div className="gov-card-header">
            <span>Citizen Reports ({contract.citizen_reports.length})</span>
          </div>
          <div className="gov-card-body" style={{ padding: 0 }}>
            {contract.citizen_reports.map((r, i) => (
              <div key={r.id} style={{ padding: '10px 14px', borderBottom: '1px solid #F0F0EC', display: 'flex', gap: 10, background: i % 2 === 0 ? '#fff' : '#FAFAF7' }}>
                <MessageSquare style={{ width: 14, height: 14, color: '#003087', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{r.description}</p>
                  <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{fmt(r.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Action */}
      <div className="gov-card">
        <div className="gov-card-header-saffron">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileCheck style={{ width: 14, height: 14 }} />
            <span>Record Audit Action</span>
          </div>
        </div>
        <div className="gov-card-body">
          <form onSubmit={handleAuditAction}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="gov-label">Action *</label>
                <select data-testid="audit-action-select" value={actionType} onChange={e => setActionType(e.target.value)} className="gov-select" style={{ width: '100%' }}>
                  <option value="">— Select Action —</option>
                  <option value="send_for_audit">Send for Audit</option>
                  <option value="false_positive">Mark as False Positive</option>
                  <option value="under_investigation">Under Investigation</option>
                  <option value="cleared">Cleared</option>
                </select>
              </div>
              <div>
                <label className="gov-label">Notes / Remarks</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} className="gov-input" placeholder="Add any additional notes or remarks…" />
              </div>
            </div>
            <button type="submit" data-testid="submit-audit-action-btn" disabled={submitting} className="gov-btn gov-btn-saffron">
              {submitting ? 'Recording…' : 'Record Audit Action'}
            </button>
          </form>

          {contract.audit_history?.length > 0 && (
            <div style={{ marginTop: 20, borderTop: '1px solid #E8E8E3', paddingTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#003087', marginBottom: 10, fontFamily: 'Noto Serif, Georgia, serif' }}>Audit History</div>
              <table className="gov-table">
                <thead><tr><th>Action</th><th>Officer</th><th>Date</th><th>Notes</th></tr></thead>
                <tbody>
                  {contract.audit_history.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{a.action.replace(/_/g, ' ')}</td>
                      <td>{a.officer_name}</td>
                      <td style={{ fontSize: 12, color: '#777' }}>{fmt(a.created_at)}</td>
                      <td style={{ color: '#555' }}>{a.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
