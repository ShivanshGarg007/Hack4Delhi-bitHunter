import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Phone, Mail, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/official/vendors/${id}`);
      setVendor(response.data);
    } catch (error) {
      console.error('Failed to fetch vendor:', error);
      toast.error('Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#71C9CE]"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center">
        <p className="text-slate-600">Vendor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3FDFD]">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/official/vendors')} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Vendors</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{vendor.company_name}</h1>
                <p className="text-slate-600">{vendor.registration_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Risk Score</p>
                <p className={`text-4xl font-bold ${getRiskColor(vendor.risk_score)}`}>
                  {vendor.risk_score}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Total Contracts</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{vendor.total_contracts || 0}</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">Delayed Projects</span>
                </div>
                <p className="text-2xl font-bold text-amber-600">{vendor.delayed_projects || 0}</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Established</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{vendor.established_year}</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Total Value</span>
                </div>
                <p className="text-lg font-bold text-slate-900">₹{((vendor.total_value || 0) / 10000000).toFixed(2)} Cr</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Contact Person</p>
                  <p className="text-base font-medium text-slate-900">{vendor.contact_person}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-500">Email</p>
                  </div>
                  <p className="text-base font-medium text-slate-900">{vendor.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-500">Phone</p>
                  </div>
                  <p className="text-base font-medium text-slate-900">{vendor.phone}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-500">Registration</p>
                  </div>
                  <p className="text-base font-mono text-slate-900">{vendor.registration_number}</p>
                </div>
              </div>
            </div>
          </div>

          {vendor.contracts && vendor.contracts.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contract History ({vendor.contracts.length})</h2>
              <div className="space-y-3">
                {vendor.contracts.map((contract) => (
                  <div
                    key={contract.id}
                    onClick={() => navigate(`/official/contracts/${contract.id}`)}
                    className="p-4 bg-[#CBF1F5] hover:bg-[#A6E3E9] rounded-lg border border-slate-100 hover:border-[#71C9CE] transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{contract.project_name}</h3>
                        <p className="text-sm text-slate-600">{contract.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">₹{(contract.contract_value / 10000000).toFixed(2)} Cr</p>
                        <p className="text-xs text-slate-500 capitalize">{contract.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;