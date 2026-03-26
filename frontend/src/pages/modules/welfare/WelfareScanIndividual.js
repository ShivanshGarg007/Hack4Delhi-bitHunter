import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';

const WelfareScanIndividual = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    applicant_id: '', name: '', dob: '', address: '', declared_income: '', asset_flag: 'Standard'
  });

  const assetOptions = [
    { value: 'Standard', label: 'Standard Assets' },
    { value: 'Mutual Funds > 5L', label: 'Mutual Funds > 5 Lakhs' },
    { value: 'Luxury Car', label: 'Luxury Car' },
    { value: 'Property > 50L', label: 'Property > 50 Lakhs' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!formData.applicant_id || !formData.name || !formData.dob || !formData.address || !formData.declared_income) {
      toast.error('Please fill in all required fields');
      return;
    }
    setScanning(true);
    try {
      const response = await axios.post(`${API}/api/welfare/scan`, {
        applicant_id: formData.applicant_id,
        name: formData.name,
        dob: formData.dob,
        address: formData.address,
        declared_income: parseFloat(formData.declared_income),
        asset_flag: formData.asset_flag
      }, { headers: { 'Authorization': `Bearer ${token}` } });
      setResult(response.data);
      toast.success('Scan completed successfully');
      setTimeout(() => { document.getElementById('scan-result')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to scan applicant');
    } finally {
      setScanning(false);
    }
  };

  const getRiskColor = (status) => {
    if (status === 'red') return '#c0392b';
    if (status === 'yellow') return '#e67e22';
    return '#27ae60';
  };

  const getRiskLabel = (status) => {
    if (status === 'red') return 'HIGH RISK';
    if (status === 'yellow') return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  return (
    <div style={{ padding: 24, background: '#F5F5F0', minHeight: '100%' }}>
      <div style={{ marginBottom: 16, borderBottom: '2px solid #FF6200', paddingBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#003087', fontFamily: 'Noto Serif, Georgia, serif', margin: 0 }}>
            Scan Individual Applicant
          </h1>
          <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
            Verify welfare fraud risk using ML-trained model on financial intelligence data
          </div>
        </div>
        <button onClick={() => navigate('/official/welfare')} className="gov-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <ArrowLeft style={{ width: 13, height: 13 }} /> Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
            <div style={{ background: '#003087', padding: '8px 14px' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Applicant Details</span>
            </div>
            <div style={{ padding: 16 }}>
              <form onSubmit={handleScan}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="gov-label">Applicant ID *</label>
                    <input name="applicant_id" placeholder="e.g., DLHI000001" value={formData.applicant_id} onChange={handleInputChange} required className="gov-input" />
                  </div>
                  <div>
                    <label className="gov-label">Full Name *</label>
                    <input name="name" placeholder="e.g., Raj Kumar Singh" value={formData.name} onChange={handleInputChange} required className="gov-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="gov-label">Date of Birth *</label>
                    <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required className="gov-input" />
                  </div>
                  <div>
                    <label className="gov-label">Declared Annual Income (₹) *</label>
                    <input name="declared_income" type="number" placeholder="e.g., 300000" value={formData.declared_income} onChange={handleInputChange} required className="gov-input" />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="gov-label">Address *</label>
                  <input name="address" placeholder="e.g., 123 Main Street, Delhi" value={formData.address} onChange={handleInputChange} required className="gov-input" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="gov-label">Asset Type</label>
                  <select name="asset_flag" value={formData.asset_flag} onChange={handleInputChange} className="gov-select" style={{ width: '100%' }}>
                    {assetOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Based on Vahan (vehicle) and property records</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" disabled={scanning} className="gov-btn-primary" style={{ flex: 1, padding: '9px', opacity: scanning ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {scanning ? (
                      <><div className="animate-spin rounded-full" style={{ width: 12, height: 12, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}></div> Scanning...</>
                    ) : 'Scan Applicant'}
                  </button>
                  <button type="button" className="gov-btn-outline" onClick={() => { setFormData({ applicant_id: '', name: '', dob: '', address: '', declared_income: '', asset_flag: 'Standard' }); setResult(null); }}>
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
            <div style={{ background: '#003087', padding: '8px 14px' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>How It Works</span>
            </div>
            <div style={{ padding: 14, fontSize: 12, color: '#444', lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, color: '#003087', marginBottom: 4 }}>ML-Trained Model</div>
              <p style={{ marginBottom: 10 }}>Uses financial intelligence dataset with 1,050 records for accurate fraud detection.</p>
              <div style={{ fontWeight: 700, color: '#003087', marginBottom: 4 }}>Risk Factors</div>
              <ul style={{ paddingLeft: 16, marginBottom: 10 }}>
                <li>Asset ownership (Vahan)</li>
                <li>Income-asset mismatch</li>
                <li>Age &amp; demographics</li>
                <li>Address patterns</li>
              </ul>
              <div style={{ fontWeight: 700, color: '#003087', marginBottom: 6 }}>Risk Levels</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="gov-badge-high" style={{ display: 'inline-block' }}>🔴 Red — High Risk</span>
                <span className="gov-badge-medium" style={{ display: 'inline-block' }}>🟡 Yellow — Medium Risk</span>
                <span className="gov-badge-low" style={{ display: 'inline-block' }}>🟢 Green — Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div id="scan-result" style={{ marginTop: 24 }}>
          <div style={{ background: '#fff', border: `2px solid ${getRiskColor(result.risk_status)}`, borderTop: `4px solid ${getRiskColor(result.risk_status)}` }}>
            <div style={{ background: getRiskColor(result.risk_status), padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{result.name}</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>ID: {result.applicant_id}</div>
              </div>
              <span style={{ background: '#fff', color: getRiskColor(result.risk_status), fontWeight: 700, fontSize: 13, padding: '4px 12px' }}>
                {getRiskLabel(result.risk_status)}
              </span>
            </div>
            <div style={{ padding: 16 }}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Fraud Probability', value: result.fraud_probability != null ? `${(result.fraud_probability * 100).toFixed(1)}%` : 'N/A' },
                  { label: 'Age', value: result.feature_values?.age || 'N/A' },
                  { label: 'Declared Income', value: `₹${(result.declared_income / 100000).toFixed(1)}L` },
                ].map((stat, i) => (
                  <div key={i} style={{ background: '#f5f5f0', border: '1px solid #ddd', padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {result.flags && result.flags.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#c0392b', marginBottom: 8 }}>
                    ⚠ Red Flags Detected ({result.flags.length})
                  </div>
                  {result.flags.map((flag, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, padding: '8px 10px', background: flag.severity === 'high' ? '#fff8f8' : '#fffbf0', border: `1px solid ${flag.severity === 'high' ? '#fdd' : '#ffe'}`, borderLeft: `3px solid ${flag.severity === 'high' ? '#c0392b' : '#e67e22'}`, marginBottom: 6 }}>
                      <AlertTriangle style={{ width: 14, height: 14, color: flag.severity === 'high' ? '#c0392b' : '#e67e22', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{(flag.type || flag.reason || '').replace(/_/g, ' ')}</div>
                        <div style={{ fontSize: 12, color: '#555' }}>{flag.details || flag.evidence || ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.feature_values && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#003087', marginBottom: 8 }}>Model Feature Analysis</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(result.feature_values).map(([key, value]) => (
                      <div key={key} style={{ background: '#f5f5f0', border: '1px solid #ddd', padding: '8px 10px' }}>
                        <div style={{ fontSize: 11, color: '#888', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ padding: '12px 14px', background: result.risk_status === 'red' ? '#fff8f8' : result.risk_status === 'yellow' ? '#fffbf0' : '#f0fff4', border: `1px solid ${getRiskColor(result.risk_status)}`, borderLeft: `4px solid ${getRiskColor(result.risk_status)}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 4 }}>Recommendation</div>
                {result.risk_status === 'red' && <p style={{ fontSize: 13, color: '#555', margin: 0 }}>⛔ Reject welfare application. High fraud risk detected. Recommend for detailed investigation.</p>}
                {result.risk_status === 'yellow' && <p style={{ fontSize: 13, color: '#555', margin: 0 }}>⚠️ Manual review required. Some anomalies detected. Recommend cross-verification with authorities.</p>}
                {result.risk_status === 'green' && <p style={{ fontSize: 13, color: '#555', margin: 0 }}>✓ Application appears legitimate. Can proceed with standard processing.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelfareScanIndividual;
