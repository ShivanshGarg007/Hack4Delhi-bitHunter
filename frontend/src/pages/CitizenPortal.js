import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, AlertTriangle, CheckCircle, Clock, Search, MessageSquare, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/citizen/projects`);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (score) => {
    if (score >= 70) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">High Risk</span>;
    } else if (score >= 40) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Medium Risk</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Low Risk</span>;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'delayed':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#E3FDFD]">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Citizen Portal</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Government Projects</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  data-testid="search-projects-input"
                  placeholder="Search projects by name or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#71C9CE]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    data-testid="project-card"
                    onClick={() => navigate(`/citizen/projects/${project.id}`)}
                    className="bg-[#CBF1F5] hover:bg-[#A6E3E9] rounded-xl p-6 border border-slate-100 hover:border-[#71C9CE] transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900 flex-1">{project.project_name}</h3>
                      {project.is_flagged && <AlertTriangle className="h-5 w-5 text-red-500" strokeWidth={2} />}
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {project.location?.city}, {project.location?.state}
                      </div>
                      <div className="flex items-center text-sm font-medium">
                        {getStatusIcon(project.status)}
                        <span className="ml-2 capitalize">{project.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Contract Value</p>
                        <p className="text-lg font-bold text-slate-900">₹{(project.contract_value / 10000000).toFixed(2)}Cr</p>
                      </div>
                      {getRiskBadge(project.fraud_risk_score)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">No projects found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenPortal;