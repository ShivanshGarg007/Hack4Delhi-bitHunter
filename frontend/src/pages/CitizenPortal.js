import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, AlertTriangle, CheckCircle, Clock, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CitizenPortal = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/citizen/projects`);
      setProjects(response.data.projects);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (score) => {
    if (score >= 70) return <span className="gov-badge-high">High Risk</span>;
    if (score >= 40) return <span className="gov-badge-medium">Medium Risk</span>;
    return <span className="gov-badge-low">Low Risk</span>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle style={{ width: 14, height: 14, color: '#27ae60', display: 'inline' }} />;
      case 'delayed': return <AlertTriangle style={{ width: 14, height: 14, color: '#e67e22', display: 'inline' }} />;
      default: return <Clock style={{ width: 14, height: 14, color: '#003087', display: 'inline' }} />;
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F0' }}>
      {/* Top bar */}
      <div style={{ background: '#003087', color: '#fff', fontSize: 12, padding: '4px 0' }}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <span>Government of National Capital Territory of Delhi</span>
          <span>A- A A+</span>
        </div>
      </div>
      <div className="gov-tricolor-bar"></div>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ccc' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#003087', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Home
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#003087', fontFamily: 'Noto Serif, Georgia, serif' }}>
              Citizen Portal — Government Projects
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>नागरिक पोर्टल | Sentinel Anti-Fraud Platform</div>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
            alt="Emblem" style={{ height: 50 }} onError={e => { e.target.style.display = 'none'; }} />
        </div>
      </div>
      <div className="gov-nav-bar">
        <div className="max-w-7xl mx-auto px-4 flex">
          {['Home', 'Projects', 'Submit Report', 'About', 'Contact'].map((item, i) => (
            <a key={i} href="#" style={{ color: '#fff', fontSize: 13, padding: '8px 14px', borderRight: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FF6200'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{item}</a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
          <a href="#" style={{ color: '#003087' }}>Home</a> &rsaquo; <span>Government Projects</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
          <div style={{ background: '#003087', padding: '10px 16px' }}>
            <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0, fontFamily: 'Noto Serif, Georgia, serif' }}>
              Government Projects — Public Transparency Portal
            </h2>
          </div>
          <div style={{ padding: 16 }}>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#888' }} />
                <input
                  type="text"
                  data-testid="search-projects-input"
                  placeholder="Search projects by name or department..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="gov-input"
                  style={{ paddingLeft: 28 }}
                />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="gov-select">
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="animate-spin rounded-full" style={{ width: 32, height: 32, border: '3px solid #003087', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map(project => (
                  <div key={project.id} data-testid="project-card"
                    onClick={() => navigate(`/citizen/projects/${project.id}`)}
                    style={{
                      background: '#fff', border: '1px solid #ccc', borderLeft: '3px solid #003087',
                      padding: 14, cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0f4ff'; e.currentTarget.style.borderLeftColor = '#FF6200'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderLeftColor = '#003087'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#003087', margin: 0, flex: 1, fontFamily: 'Noto Serif, Georgia, serif' }}>
                        {project.project_name}
                      </h3>
                      {project.is_flagged && <AlertTriangle style={{ width: 16, height: 16, color: '#c0392b', flexShrink: 0, marginLeft: 8 }} />}
                    </div>
                    <p style={{ fontSize: 12, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>{project.description}</p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 8, fontSize: 12, color: '#666' }}>
                      <span><MapPin style={{ width: 12, height: 12, display: 'inline', marginRight: 3 }} />{project.location?.city}, {project.location?.state}</span>
                      <span>{getStatusIcon(project.status)} <span style={{ marginLeft: 3, textTransform: 'capitalize' }}>{project.status}</span></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#888' }}>Contract Value</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>₹{(project.contract_value / 10000000).toFixed(2)} Cr</div>
                      </div>
                      {getRiskBadge(project.fraud_risk_score)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && filteredProjects.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 13 }}>No projects found matching your criteria.</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#003087', color: '#ccd6f6', marginTop: 32, padding: '12px 0', textAlign: 'center', fontSize: 11 }}>
        © 2026 Government of National Capital Territory of Delhi | Sentinel Platform | NIC Delhi
      </div>
    </div>
  );
};

export default CitizenPortal;
