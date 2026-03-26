import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield, LayoutDashboard, FileText, Building2,
  UserSearch, Link2, ScanLine, LogOut, ChevronRight
} from 'lucide-react';
import { AshokaChakra } from '../../pages/LandingPage';

const SIDEBAR_SECTIONS = [
  {
    section: 'Overview',
    items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/official/dashboard' }]
  },
  {
    section: 'Contract Intelligence',
    items: [
      { icon: FileText, label: 'Contracts', path: '/official/contracts' },
      { icon: Building2, label: 'Vendors', path: '/official/vendors' },
    ]
  },
  {
    section: 'Fraud Detection',
    items: [
      { icon: UserSearch, label: 'Welfare Fraud', path: '/official/welfare' },
      { icon: Link2, label: 'PDS Ledger', path: '/official/ledger' },
      { icon: ScanLine, label: 'Lifestyle Scan', path: '/official/lifestyle' },
    ]
  }
];

const OfficialLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#EFEFEA' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 248,
        background: '#fff',
        borderRight: '1px solid #D8D8D3',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '2px 0 6px rgba(0,0,0,0.04)',
      }}>

        {/* Logo block */}
        <div style={{
          background: 'linear-gradient(135deg, #003087 0%, #00205B 100%)',
          padding: '16px',
          borderBottom: '3px solid #E8500A',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <AshokaChakra size={36} />
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Noto Serif, Georgia, serif', lineHeight: 1.2 }}>
                Sentinel
              </div>
              <div style={{ color: '#8899BB', fontSize: 10, letterSpacing: 0.5 }}>bitHunter Platform</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#6677AA', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, lineHeight: 1.5 }}>
            Govt. of NCT of Delhi<br />
            <span style={{ color: '#E8500A', fontWeight: 600 }}>OFFICIAL USE ONLY</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {SIDEBAR_SECTIONS.map(section => (
            <div key={section.section}>
              <div className="gov-sidebar-section-label">{section.section}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `gov-sidebar-link${isActive ? ' active' : ''}`}
                >
                  <item.icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronRight style={{ width: 12, height: 12, opacity: 0.3 }} />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div style={{ borderTop: '1px solid #E8E8E3', background: '#F7F7F3' }}>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #003087, #00205B)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
              border: '2px solid #C8D4E8',
            }}>
              {user?.full_name?.charAt(0)?.toUpperCase() || 'O'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.full_name || 'Official'}
              </div>
              <div style={{ fontSize: 10.5, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <div style={{ padding: '0 14px 12px' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#fff', border: '1px solid #CCC',
                padding: '6px 10px', fontSize: 12, color: '#555',
                cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FDECEA'; e.currentTarget.style.color = '#C0392B'; e.currentTarget.style.borderColor = '#C0392B'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#CCC'; }}
            >
              <LogOut style={{ width: 13, height: 13 }} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top header bar */}
        <div style={{
          background: '#003087',
          borderBottom: '2px solid #E8500A',
          padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 40, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield style={{ width: 14, height: 14, color: '#E8500A' }} />
            <span style={{ color: '#C8D4E8', fontSize: 12 }}>
              Anti-Fraud Intelligence System &nbsp;|&nbsp; Government of NCT of Delhi
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#8899BB', fontSize: 11 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span style={{ background: '#E8500A', color: '#fff', fontSize: 10, padding: '2px 8px', fontWeight: 700, letterSpacing: 0.5 }}>
              OFFICIAL USE ONLY
            </span>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', background: '#EFEFEA' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OfficialLayout;
