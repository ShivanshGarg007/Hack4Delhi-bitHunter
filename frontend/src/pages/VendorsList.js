import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Search, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VendorsList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API}/official/vendors`);
      setVendors(response.data.vendors);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const filteredVendors = vendors.filter(v => 
    v.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#E3FDFD]">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/official/dashboard')} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-[#71C9CE]" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-slate-900">Vendor Intelligence</span>
            </div>
            <div className="w-48"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              data-testid="search-vendors-input"
              placeholder="Search by company name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#71C9CE]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  data-testid="vendor-card"
                  onClick={() => navigate(`/official/vendors/${vendor.id}`)}
                  className="p-6 bg-[#CBF1F5] hover:bg-[#A6E3E9] rounded-lg border border-slate-100 hover:border-[#71C9CE] transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex-1">{vendor.company_name}</h3>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getRiskColor(vendor.risk_score)}`}>
                        {vendor.risk_score}
                      </p>
                      <p className="text-xs text-slate-500">Risk Score</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500">Registration Number</p>
                      <p className="text-sm font-mono text-slate-900">{vendor.registration_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Established</p>
                      <p className="text-sm font-medium text-slate-900">{vendor.established_year}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Total Contracts</p>
                        <p className="text-lg font-bold text-slate-900">{vendor.total_contracts || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Delayed</p>
                        <p className="text-lg font-bold text-amber-600">{vendor.delayed_projects || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No vendors found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorsList;