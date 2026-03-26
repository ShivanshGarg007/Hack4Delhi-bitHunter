import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, AlertTriangle, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContractsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState(searchParams.get('risk') || 'all');

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (riskFilter !== 'all') params.risk_filter = riskFilter;
      const r = await axios.get(`${API}/official/contracts`, { params });
      setContracts(r.data.contracts);
    } catch { toast.error('Failed to load contracts'); }
    finally { setLoading(false); }
  }, [riskFilter]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const getRiskBadge = (score) => {
    if (score >= 70) return <span className="gov-badge gov-badge-high"><AlertTriangle style={{ width: 9, height: 9 }} /> High ({score})</span>;
    if (score >= 40) return <span className="gov-badge gov-badge-medium"><TrendingUp style={{ width: 9, height: 9 }} /> Medium ({score})</span>;
    return <span className="gov-badge gov-badge-low"><TrendingDown style={{ width: 9, height: 9 }} /> Low ({score})</span>;
  };

  const filtered = contracts.filter(c =>
    c.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '22px 24px', minHeight: '100%' }}>
      <div className="gov-page-title-bar">
        <h1 className="gov-page-title">Contracts</h1>
        <div className="gov-breadcrumb" style={{ marginBottom: 0, marginTop: 4 }}>
          <a href="/official/dashboard">Dashboard</a><span className="sep">›</span>
          <span>Contract Intelligence</span><span className="sep">›</span>
          <span>Contracts</span>
        </div>
      </div>

      <div className="gov-card">
        <div className="gov-card-header">
          <span>Contract List — {filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="gov-badge gov-badge-high">{contracts.filter(c => c.fraud_risk_score >= 70).length} High</span>
            <span className="gov-badge gov-badge-medium">{contracts.filter(c => c.fraud_risk_score >= 40 && c.fraud_risk_score < 70).length} Medium</span>
            <span className="gov-badge gov-badge-low">{contracts.filter(c => c.fraud_risk_score < 40).length} Low</span>
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderBottom: '1px solid #E8E8E3', background: '#F7F7F3', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#999' }} />
            <input
              type="text"
              data-testid="search-contracts-input"
              placeholder="Search by project name, contractor, or department…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="gov-input"
              style={{ paddingLeft: 30 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter style={{ width: 13, height: 13, color: '#777' }} />
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="gov-select">
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div className="gov-spinner"></div>
            <div style={{ fontSize: 13, color: '#777' }}>Loading contracts…</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Project Name</th>
                  <th>Department</th>
                  <th>Contractor</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Risk Score</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    data-testid="contract-item"
                    onClick={() => navigate(`/official/contracts/${c.id}`)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: '#003087', fontSize: 13 }}>{c.project_name}</div>
                    </td>
                    <td style={{ fontSize: 12, color: '#555' }}>{c.department}</td>
                    <td style={{ fontSize: 12 }}>{c.contractor_name}</td>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>₹{(c.contract_value / 10000000).toFixed(2)} Cr</td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                        color: c.status === 'delayed' ? '#C0392B' : c.status === 'completed' ? '#138808' : '#003087',
                      }}>{c.status}</span>
                    </td>
                    <td>{getRiskBadge(c.fraud_risk_score)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {c.flags?.single_bidder && <span className="gov-badge gov-badge-high" style={{ fontSize: 10 }}>Single Bidder</span>}
                        {c.flags?.repeated_vendor && <span className="gov-badge gov-badge-medium" style={{ fontSize: 10 }}>Repeat Vendor</span>}
                        {c.flags?.timeline_overrun && <span className="gov-badge gov-badge-medium" style={{ fontSize: 10 }}>Timeline Overrun</span>}
                        {c.flags?.budget_escalation && <span className="gov-badge gov-badge-medium" style={{ fontSize: 10 }}>Budget Escalation</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 13 }}>
                No contracts found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsList;
