import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { GovHeader } from './LandingPage';

const OfficialLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/official/dashboard');
    } catch (err) {
      setError('Invalid email address or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#EFEFEA' }}>
      <GovHeader showBack onBack={() => navigate('/')} />

      {/* Nav strip */}
      <div className="gov-primary-nav">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <a href="#" className="active">Home</a>
            <a href="#">About</a>
            <a href="#">Contact Us</a>
          </div>
          <span style={{ color: '#FFB080', fontSize: 11, fontWeight: 700, padding: '10px 0', letterSpacing: 1 }}>
            🔒 RESTRICTED ACCESS — AUTHORISED PERSONNEL ONLY
          </span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 20px' }}>
        <div className="gov-breadcrumb">
          <a href="/">Home</a><span className="sep">›</span>
          <span>Official Portal</span><span className="sep">›</span>
          <span>Login</span>
        </div>
      </div>

      {/* Login area */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 40px', display: 'flex', gap: 32, alignItems: 'flex-start' }}>

        {/* Form card */}
        <div style={{ flex: '0 0 420px' }}>
          <div className="gov-card">
            <div className="gov-card-header" style={{ padding: '14px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Official Portal Login</div>
                  <div style={{ fontSize: 11, opacity: 0.75 }}>Sentinel Anti-Fraud Platform</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 24px 20px' }}>
              {error && (
                <div className="gov-alert gov-alert-danger" style={{ marginBottom: 18 }}>
                  <AlertCircle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label className="gov-label">Email Address / User ID</label>
                  <input
                    type="email"
                    data-testid="login-email-input"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    required
                    className="gov-input"
                    placeholder="official@sentinel.gov.in"
                    autoComplete="username"
                  />
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label className="gov-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      data-testid="login-password-input"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      required
                      className="gov-input"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      style={{ paddingRight: 38 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0 }}
                    >
                      {showPwd ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  data-testid="login-submit-btn"
                  disabled={loading}
                  className="gov-btn gov-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 14 }}
                >
                  {loading ? (
                    <><div className="gov-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Authenticating...</>
                  ) : (
                    <><Lock style={{ width: 15, height: 15 }} /> Login to Portal</>
                  )}
                </button>
              </form>

              <hr className="gov-divider" />

              {/* Demo credentials */}
              <div style={{ background: '#F0F4FF', border: '1px solid #C8D4EE', borderLeft: '3px solid #003087', padding: '12px 14px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#003087', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  ℹ &nbsp;Demo Credentials (Testing Only)
                </div>
                <div style={{ fontFamily: 'Courier New, monospace', fontSize: 12, color: '#333', lineHeight: 1.8 }}>
                  <div><strong>Email:</strong> official@sentinel.gov.in</div>
                  <div><strong>Password:</strong> demo123</div>
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 11, color: '#999', textAlign: 'center', lineHeight: 1.7 }}>
                This system is for authorised government personnel only.<br />
                Unauthorised access is a punishable offence under IT Act, 2000.
              </div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div style={{ flex: 1 }}>
          <div className="gov-section-heading" style={{ marginTop: 0 }}>
            <Shield style={{ width: 16, height: 16 }} />
            About the Official Portal
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { icon: '📋', title: 'Contract Intelligence', desc: 'Monitor government contracts with AI-powered fraud risk scoring and audit management.' },
              { icon: '👤', title: 'Welfare Fraud Detection', desc: 'Cross-reference welfare applicants against Vahan & Discom databases using ML models.' },
              { icon: '⛓', title: 'PDS Ledger (Kawach)', desc: 'Blockchain-based tamper-proof tracking of Public Distribution System transactions.' },
              { icon: '🔍', title: 'SATARK-360 Scanner', desc: 'AI-powered 360° lifestyle and asset mismatch detection for field officers.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #DDD', borderLeft: '3px solid #003087', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#003087', marginBottom: 5, fontFamily: 'Noto Serif, Georgia, serif' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, background: '#FFF8E7', border: '1px solid #F0D080', borderLeft: '3px solid #D68910', padding: '12px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7B5800', marginBottom: 4 }}>⚠ Security Notice</div>
            <div style={{ fontSize: 12, color: '#7B5800', lineHeight: 1.6 }}>
              All activities on this portal are logged and monitored. Unauthorised access or misuse of government data is a criminal offence under the Information Technology Act, 2000 and Indian Penal Code.
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ background: '#003087', padding: '10px 0', textAlign: 'center', fontSize: 11, color: '#7A8899' }}>
        © 2026 Government of National Capital Territory of Delhi. All Rights Reserved. | NIC Delhi
      </div>
    </div>
  );
};

export default OfficialLogin;
