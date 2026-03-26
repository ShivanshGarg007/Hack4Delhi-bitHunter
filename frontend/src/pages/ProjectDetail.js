import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, User, AlertTriangle, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({ description: '', file: null });
  const [submitting, setSubmitting] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/citizen/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportData.description.trim()) { toast.error('Please provide a description'); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('project_id', id);
      formData.append('description', reportData.description);
      if (reportData.file) formData.append('file', reportData.file);
      if (project.location) formData.append('location', JSON.stringify(project.location));
      await axios.post(`${API}/citizen/reports`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Report submitted successfully');
      setShowReportForm(false);
      setReportData({ description: '', file: null });
      fetchProject();
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div className="animate-spin rounded-full" style={{ width: 32, height: 32, border: '3px solid #003087', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
    </div>
  );

  if (!project) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Project not found.</div>;

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
      <div style={{ background: '#fff', borderBottom: '1px solid #ccc' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/citizen')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#003087', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Projects
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#003087', fontFamily: 'Noto Serif, Georgia, serif' }}>
              Project Details — Citizen Portal
            </div>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
            alt="Emblem" style={{ height: 44 }} onError={e => { e.target.style.display = 'none'; }} />
        </div>
      </div>
      <div className="gov-nav-bar" style={{ padding: '6px 0' }}>
        <div className="max-w-7xl mx-auto px-4">
          <span style={{ color: '#ccd6f6', fontSize: 12 }}>
            Home &rsaquo; Citizen Portal &rsaquo; Projects &rsaquo; {project.project_name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary */}
        <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087', marginBottom: 16 }}>
          <div style={{ background: '#003087', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Project Summary</span>
            {project.is_flagged && (
              <span style={{ background: '#c0392b', color: '#fff', fontSize: 11, padding: '2px 8px', fontWeight: 700 }}>
                ⚠ FLAGGED
              </span>
            )}
          </div>
          <div style={{ padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#003087', fontFamily: 'Noto Serif, Georgia, serif', marginBottom: 6 }}>{project.project_name}</h2>
            <p style={{ fontSize: 13, color: '#555', marginBottom: 14 }}>{project.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Contract Value', value: `₹${(project.contract_value / 10000000).toFixed(2)} Cr`, color: '#003087' },
                { label: 'Contractor', value: project.contractor_name, color: '#333' },
                { label: 'Status', value: project.status, color: '#138808' },
              ].map((stat, i) => (
                <div key={i} style={{ background: '#f5f5f0', border: '1px solid #ddd', padding: '10px 12px', borderLeft: `3px solid ${stat.color}` }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: stat.color, textTransform: 'capitalize' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Details */}
          <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
            <div style={{ background: '#003087', padding: '8px 14px' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Project Details</span>
            </div>
            <div style={{ padding: 14 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  {[
                    { label: 'Department', value: project.department },
                    { label: 'Location', value: `${project.location?.city}, ${project.location?.state}` },
                    { label: 'Start Date', value: formatDate(project.start_date) },
                    { label: 'Expected Completion', value: formatDate(project.expected_completion) },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: '7px 10px', background: '#f5f5f0', fontWeight: 600, color: '#555', width: '40%', border: '1px solid #eee' }}>{row.label}</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #eee' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map */}
          {project.location && (
            <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
              <div style={{ background: '#003087', padding: '8px 14px' }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Project Location</span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ height: 220, border: '1px solid #ddd' }}>
                  <MapContainer center={[project.location.lat, project.location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <Marker position={[project.location.lat, project.location.lng]}>
                      <Popup>{project.project_name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Citizen Reports */}
        <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
          <div style={{ background: '#003087', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Citizen Reports ({project.citizen_reports?.length || 0})</span>
            <button data-testid="submit-report-btn" onClick={() => setShowReportForm(!showReportForm)}
              style={{ background: '#FF6200', color: '#fff', border: 'none', padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Upload style={{ width: 12, height: 12 }} /> Submit Report
            </button>
          </div>
          <div style={{ padding: 14 }}>
            {showReportForm && (
              <form onSubmit={handleSubmitReport} style={{ background: '#f5f5f0', border: '1px solid #ddd', borderLeft: '3px solid #FF6200', padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#003087', marginBottom: 12 }}>Submit Anonymous Report</div>
                <div style={{ marginBottom: 10 }}>
                  <label className="gov-label">Description *</label>
                  <textarea data-testid="report-description-input" value={reportData.description}
                    onChange={e => setReportData({ ...reportData, description: e.target.value })}
                    rows={4} className="gov-input" placeholder="Describe the issue you observed..." />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label className="gov-label">Attach Photo/Video (optional)</label>
                  <input type="file" accept="image/*,video/*"
                    onChange={e => setReportData({ ...reportData, file: e.target.files[0] })}
                    className="gov-input" />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" disabled={submitting} className="gov-btn-saffron" style={{ opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button type="button" onClick={() => setShowReportForm(false)} className="gov-btn-outline">Cancel</button>
                </div>
              </form>
            )}
            {project.citizen_reports && project.citizen_reports.length > 0 ? (
              project.citizen_reports.map(report => (
                <div key={report.id} style={{ display: 'flex', gap: 8, padding: '10px 12px', background: '#f5f5f0', border: '1px solid #ddd', marginBottom: 6 }}>
                  <FileText style={{ width: 14, height: 14, color: '#003087', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{report.description}</p>
                    <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                      {new Date(report.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    {report.file_url && (
                      <a href={report.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#003087', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <ImageIcon style={{ width: 12, height: 12 }} /> View Attachment
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: '#888', textAlign: 'center', padding: 24 }}>No reports yet. Be the first to report!</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: '#003087', color: '#ccd6f6', marginTop: 32, padding: '10px 0', textAlign: 'center', fontSize: 11 }}>
        © 2026 Government of National Capital Territory of Delhi | Sentinel Platform | NIC Delhi
      </div>
    </div>
  );
};

export default ProjectDetail;
