import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, FileText, TrendingUp, AlertTriangle, ChevronRight, Lock } from 'lucide-react';

/* ── Ashoka Chakra SVG (24-spoke wheel) ── */
const AshokaChakra = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="#003087" strokeWidth="4" fill="none"/>
    <circle cx="50" cy="50" r="6" fill="#003087"/>
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x1 = 50 + 8 * Math.cos(angle); const y1 = 50 + 8 * Math.sin(angle);
      const x2 = 50 + 42 * Math.cos(angle); const y2 = 50 + 42 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#003087" strokeWidth="1.5"/>;
    })}
    <circle cx="50" cy="50" r="42" stroke="#003087" strokeWidth="1.5" fill="none"/>
  </svg>
);

const GovHeader = ({ showBack, onBack }) => (
  <>
    {/* Utility bar */}
    <div className="gov-utility-bar">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Government of National Capital Territory of Delhi</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {showBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#b0b8cc', cursor: 'pointer', fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4 }}>
              ← Back to Home
            </button>
          )}
          <a href="#">Screen Reader</a>
          <span style={{ color: '#444' }}>|</span>
          <a href="#">Skip to Content</a>
          <span style={{ color: '#444' }}>|</span>
          <span style={{ display: 'flex', gap: 6 }}>
            <button style={{ background: 'none', border: '1px solid #555', color: '#b0b8cc', padding: '1px 6px', cursor: 'pointer', fontSize: 10 }}>A-</button>
            <button style={{ background: 'none', border: '1px solid #555', color: '#b0b8cc', padding: '1px 6px', cursor: 'pointer', fontSize: 12 }}>A</button>
            <button style={{ background: 'none', border: '1px solid #555', color: '#b0b8cc', padding: '1px 6px', cursor: 'pointer', fontSize: 14 }}>A+</button>
          </span>
        </div>
      </div>
    </div>

    {/* Tricolor */}
    <div className="gov-tricolor-bar" />

    {/* Site header */}
    <div className="gov-site-header">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Emblem */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
            alt="Emblem of India"
            style={{ height: 68, display: 'block' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
        {/* Title block */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#777', fontWeight: 500, letterSpacing: 0.3, marginBottom: 2 }}>
            Government of National Capital Territory of Delhi
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#003087', fontFamily: 'Noto Serif, Georgia, serif', lineHeight: 1.2 }}>
            Sentinel — Anti-Fraud Intelligence Platform
          </div>
          <div style={{ fontSize: 12.5, color: '#555', marginTop: 3 }}>
            भ्रष्टाचार विरोधी खुफिया प्रणाली &nbsp;|&nbsp; bitHunter Initiative
          </div>
        </div>
        {/* Right: Ashoka + NIC badge */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <AshokaChakra size={52} />
          <div style={{ fontSize: 9, color: '#888', textAlign: 'center', letterSpacing: 0.5 }}>NIC DELHI</div>
        </div>
      </div>
    </div>
  </>
);

const GovFooter = () => (
  <footer className="gov-footer" style={{ marginTop: 40 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
        <div>
          <div style={{ color: '#E8500A', fontWeight: 700, fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Quick Links</div>
          {['Accessibility Statement', 'Copyright Policy', 'Hyperlink Policy', 'Privacy Policy', 'Terms & Conditions', 'Feedback', 'RTI'].map(l => (
            <div key={l} style={{ marginBottom: 5 }}><a href="#">› {l}</a></div>
          ))}
        </div>
        <div>
          <div style={{ color: '#E8500A', fontWeight: 700, fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Contact Us</div>
          <div style={{ fontSize: 12, lineHeight: 1.9, color: '#B0BCCC' }}>
            <div style={{ fontWeight: 600, color: '#D0D8E8', marginBottom: 4 }}>Anti-Fraud Intelligence Division</div>
            <div>Delhi Secretariat, I.P. Estate</div>
            <div>New Delhi — 110 002</div>
            <div style={{ marginTop: 8 }}>📞 &nbsp;011-23392254</div>
            <div>📠 &nbsp;011-23392689</div>
            <div>✉ &nbsp;sentinel@delhi.gov.in</div>
          </div>
        </div>
        <div>
          <div style={{ color: '#E8500A', fontWeight: 700, fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>About Platform</div>
          <p style={{ fontSize: 12, lineHeight: 1.8, color: '#9AAABB' }}>
            The Sentinel Platform is an initiative of the Government of NCT of Delhi to leverage AI and blockchain technology for detecting fraud in public procurement, welfare schemes, and distribution systems.
          </p>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['ISO 27001', 'NIC Certified', 'GIGW Compliant'].map(b => (
              <span key={b} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#B0BCCC', fontSize: 10, padding: '2px 8px', borderRadius: 2 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="gov-footer-bottom" style={{ padding: '10px 20px', textAlign: 'center', fontSize: 11, color: '#7A8899' }}>
      © 2026 Government of National Capital Territory of Delhi. All Rights Reserved.
      &nbsp;|&nbsp; Designed &amp; Developed by <strong style={{ color: '#9AAABB' }}>National Informatics Centre (NIC), Delhi</strong>
      &nbsp;|&nbsp; Last Updated: March 2026
    </div>
  </footer>
);

export { GovHeader, GovFooter, AshokaChakra };

/* ══════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#EFEFEA' }}>
      <GovHeader />

      {/* Primary Nav */}
      <nav className="gov-primary-nav">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {['Home', 'About', 'Notifications', 'Tenders', 'Contact Us', 'RTI'].map((item, i) => (
            <a key={i} href="#" className={i === 0 ? 'active' : ''}>{item}</a>
          ))}
        </div>
      </nav>

      {/* Ticker */}
      <div className="gov-ticker-wrap">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <span className="gov-ticker-label">Latest News</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <span className="gov-ticker-content">
              ◆ Sentinel Platform v2.0 deployed with enhanced ML fraud detection &nbsp;&nbsp;&nbsp;
              ◆ Welfare applicant cross-verification now live with Vahan &amp; Discom databases &nbsp;&nbsp;&nbsp;
              ◆ PDS Ledger (Kawach) blockchain system operational across all Delhi districts &nbsp;&nbsp;&nbsp;
              ◆ SATARK-360 lifestyle mismatch scanner deployed for field officers &nbsp;&nbsp;&nbsp;
              ◆ 1,050+ welfare applicants verified through AI-powered fraud detection system
            </span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #003087 0%, #00205B 55%, #001540 100%)',
        padding: '44px 0 40px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid #E8500A',
      }}>
        {/* Decorative pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(232,80,10,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '35%', backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 12px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(232,80,10,0.18)', border: '1px solid rgba(232,80,10,0.4)', padding: '4px 12px', marginBottom: 16, borderRadius: 2 }}>
              <span style={{ width: 6, height: 6, background: '#E8500A', borderRadius: '50%', display: 'inline-block' }}></span>
              <span style={{ color: '#FFB080', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Government of NCT of Delhi — Anti-Fraud Division
              </span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 700, fontFamily: 'Noto Serif, Georgia, serif', lineHeight: 1.25, marginBottom: 14, margin: '0 0 14px' }}>
              Sentinel Anti-Fraud<br />
              <span style={{ color: '#FFB080' }}>Intelligence Platform</span>
            </h1>
            <p style={{ color: '#C8D4E8', fontSize: 14, maxWidth: 500, lineHeight: 1.75, marginBottom: 28 }}>
              AI-powered fraud detection for government contracts, welfare schemes, and public distribution systems — ensuring transparency, accountability, and data-driven governance.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                data-testid="citizen-portal-btn"
                onClick={() => navigate('/citizen')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.1)', color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  padding: '10px 22px', fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                <Users style={{ width: 16, height: 16 }} />
                Citizen Portal
              </button>
              <button
                data-testid="official-portal-btn"
                onClick={() => navigate('/official/login')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#E8500A', color: '#fff',
                  border: '1.5px solid #C44008',
                  padding: '10px 22px', fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
                  boxShadow: '0 2px 8px rgba(232,80,10,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C44008'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#E8500A'; }}
              >
                <Lock style={{ width: 16, height: 16 }} />
                Official Login
              </button>
            </div>
          </div>

          {/* Feature pills */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 230 }} className="hidden md:flex">
            {[
              { icon: '📋', label: 'Contract Monitoring', sub: 'Real-time AI scoring' },
              { icon: '🔍', label: 'Welfare Fraud Detection', sub: 'ML-powered verification' },
              { icon: '⛓', label: 'PDS Blockchain Ledger', sub: 'Tamper-proof records' },
              { icon: '👁', label: 'Lifestyle Mismatch Scan', sub: 'SATARK-360 system' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderLeft: '3px solid #E8500A',
                padding: '9px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                borderRadius: 2,
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ color: '#E8EEF8', fontSize: 12.5, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ color: '#8899BB', fontSize: 11 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

          {/* Left column */}
          <div>
            {/* Portal Access */}
            <div className="gov-section-heading">
              <Shield style={{ width: 16, height: 16 }} />
              Portal Access
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              {/* Citizen card */}
              <div
                className="gov-card"
                onClick={() => navigate('/citizen')}
                style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,48,135,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
              >
                <div className="gov-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users style={{ width: 15, height: 15 }} />
                    <span>Citizen Portal</span>
                  </div>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>नागरिक पोर्टल</span>
                </div>
                <div className="gov-card-body">
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 14 }}>
                    View government projects, check contract transparency, and submit anonymous reports about irregularities in public works.
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {['View Projects', 'Submit Reports', 'Track Status'].map(t => (
                      <span key={t} className="gov-tag">{t}</span>
                    ))}
                  </div>
                  <button className="gov-btn gov-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    Access Citizen Portal <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>

              {/* Official card */}
              <div
                className="gov-card-saffron"
                onClick={() => navigate('/official/login')}
                style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,80,10,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
              >
                <div className="gov-card-header-saffron">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Shield style={{ width: 15, height: 15 }} />
                    <span>Official Portal</span>
                  </div>
                  <span style={{ fontSize: 11, opacity: 0.8 }}>अधिकारी पोर्टल</span>
                </div>
                <div className="gov-card-body">
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 14 }}>
                    Fraud detection analytics, contract audit management, welfare verification, and AI-powered risk assessment for authorised officials.
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {['Fraud Detection', 'Audit Mgmt', 'AI Analysis'].map(t => (
                      <span key={t} className="gov-tag gov-tag-saffron">{t}</span>
                    ))}
                  </div>
                  <button className="gov-btn gov-btn-saffron" style={{ width: '100%', justifyContent: 'center' }}>
                    Official Login <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            </div>

            {/* System Modules */}
            <div className="gov-section-heading">
              <FileText style={{ width: 16, height: 16 }} />
              System Modules
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: <FileText style={{ width: 20, height: 20 }} />, title: 'Contract Intelligence', desc: 'Real-time monitoring of government contracts with AI-powered fraud risk scoring and audit trails.', color: '#003087' },
                { icon: <TrendingUp style={{ width: 20, height: 20 }} />, title: 'Welfare Verification', desc: 'Cross-reference welfare applicants against Vahan & Discom databases using ML models.', color: '#138808' },
                { icon: <AlertTriangle style={{ width: 20, height: 20 }} />, title: 'PDS Ledger (Kawach)', desc: 'Blockchain-based tamper-proof Public Distribution System transaction tracking.', color: '#6A0DAD' },
              ].map((f, i) => (
                <div key={i} style={{
                  background: '#fff',
                  border: '1px solid #DDD',
                  borderTop: `3px solid ${f.color}`,
                  padding: '14px 16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ color: f.color, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: f.color, marginBottom: 6, fontFamily: 'Noto Serif, Georgia, serif' }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Notices */}
            <div className="gov-section-heading">
              <AlertTriangle style={{ width: 16, height: 16 }} />
              Important Notices
            </div>
            <div className="gov-card" style={{ marginBottom: 20 }}>
              <div className="gov-card-header">
                <span>Notifications / Circulars</span>
              </div>
              {[
                { date: '18-03-2026', text: 'Sentinel Platform v2.0 deployed with enhanced ML fraud detection capabilities.' },
                { date: '15-03-2026', text: 'SATARK-360 lifestyle mismatch scanner now integrated with Vahan registry.' },
                { date: '10-03-2026', text: 'Blockchain PDS Ledger (Kawach) operational across all Delhi districts.' },
                { date: '05-03-2026', text: 'Welfare fraud detection system cross-verified 1,050+ applicants.' },
                { date: '01-03-2026', text: 'New audit action workflow deployed for contract risk management.' },
              ].map((notice, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #F0F0EC',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: i % 2 === 0 ? '#fff' : '#FAFAF7',
                }}>
                  <div style={{
                    background: '#003087', color: '#fff',
                    fontSize: 9.5, padding: '3px 7px',
                    whiteSpace: 'nowrap', marginTop: 1, flexShrink: 0,
                    fontWeight: 600, letterSpacing: 0.3,
                  }}>{notice.date}</div>
                  <div style={{ fontSize: 12.5, color: '#333', lineHeight: 1.55 }}>{notice.text}</div>
                </div>
              ))}
              <div style={{ padding: '8px 14px', background: '#F7F7F3', textAlign: 'right', borderTop: '1px solid #EEE' }}>
                <a href="#" style={{ color: '#003087', fontSize: 12, fontWeight: 600 }}>View All Notices →</a>
              </div>
            </div>

            {/* Stats */}
            <div className="gov-section-heading">
              <TrendingUp style={{ width: 16, height: 16 }} />
              Platform Statistics
            </div>
            <div className="gov-card">
              <div className="gov-card-header"><span>Live Statistics</span></div>
              {[
                { label: 'Contracts Monitored', value: '500+', color: '#003087' },
                { label: 'Fraud Cases Detected', value: '127', color: '#C0392B' },
                { label: 'Welfare Scans Done', value: '1,050+', color: '#E8500A' },
                { label: 'Citizen Reports Filed', value: '89', color: '#138808' },
                { label: 'Vendors Tracked', value: '200+', color: '#6A0DAD' },
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: '9px 14px',
                  borderBottom: '1px solid #F0F0EC',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: i % 2 === 0 ? '#fff' : '#FAFAF7',
                }}>
                  <span style={{ fontSize: 13, color: '#444' }}>{stat.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <GovFooter />
    </div>
  );
};

export default LandingPage;
