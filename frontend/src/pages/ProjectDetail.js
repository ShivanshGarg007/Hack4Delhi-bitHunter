import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/citizen/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('project_id', id);
      formData.append('description', reportData.description);
      if (reportData.file) {
        formData.append('file', reportData.file);
      }
      if (project.location) {
        formData.append('location', JSON.stringify(project.location));
      }

      await axios.post(`${API}/citizen/reports`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Report submitted successfully');
      setShowReportForm(false);
      setReportData({ description: '', file: null });
      fetchProject();
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#71C9CE]"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center">
        <p className="text-slate-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3FDFD]">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/citizen')} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Projects</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.project_name}</h1>
                <p className="text-slate-600">{project.description}</p>
              </div>
              {project.is_flagged && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Flagged</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">Contract Value</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">₹{(project.contract_value / 10000000).toFixed(2)} Cr</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Contractor</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{project.contractor_name}</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-lg font-bold text-slate-900 capitalize">{project.status}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Project Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="text-base font-medium text-slate-900">{project.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <p className="text-base font-medium text-slate-900">{project.location?.city}, {project.location?.state}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Start Date</p>
                  <p className="text-base font-medium text-slate-900">{formatDate(project.start_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Expected Completion</p>
                  <p className="text-base font-medium text-slate-900">{formatDate(project.expected_completion)}</p>
                </div>
              </div>
            </div>

            {project.location && (
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Location</h2>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[project.location.lat, project.location.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[project.location.lat, project.location.lng]}>
                      <Popup>{project.project_name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Citizen Reports ({project.citizen_reports?.length || 0})</h2>
              <button
                data-testid="submit-report-btn"
                onClick={() => setShowReportForm(!showReportForm)}
                className="px-4 py-2 bg-[#71C9CE] hover:bg-[#5BB8BE] text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Submit Report</span>
              </button>
            </div>

            {showReportForm && (
              <form onSubmit={handleSubmitReport} className="mb-6 p-6 bg-[#E3FDFD] rounded-lg border border-[#A6E3E9]">
                <h3 className="font-semibold text-slate-900 mb-4">Submit Anonymous Report</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                    <textarea
                      data-testid="report-description-input"
                      value={reportData.description}
                      onChange={(e) => setReportData({...reportData, description: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
                      placeholder="Describe the issue you observed..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Attach Photo/Video (optional)</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setReportData({...reportData, file: e.target.files[0]})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#71C9CE] hover:bg-[#5BB8BE] text-white rounded-lg transition-colors duration-300 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReportForm(false)}
                      className="px-6 py-2 bg-white border-2 border-[#71C9CE] text-[#71C9CE] hover:bg-[#E3FDFD] rounded-lg transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {project.citizen_reports && project.citizen_reports.length > 0 ? (
                project.citizen_reports.map((report) => (
                  <div key={report.id} className="p-4 bg-[#CBF1F5] rounded-lg border border-slate-100">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-slate-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-slate-900">{report.description}</p>
                        <p className="text-sm text-slate-500 mt-2">
                          {new Date(report.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        {report.file_url && (
                          <a href={report.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-sm text-[#71C9CE] hover:underline mt-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>View Attachment</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-600 py-8">No reports yet. Be the first to report!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;