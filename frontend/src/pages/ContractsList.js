import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Search, Filter, AlertTriangle, TrendingDown, TrendingUp, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContractsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState(searchParams.get('risk') || 'all');

  const fetchContracts = useCallback(async () => {
    try {
      const params = {};
      if (riskFilter !== 'all') {
        params.risk_filter = riskFilter;
      }
      const response = await axios.get(`${API}/official/contracts`, { params });
      setContracts(response.data.contracts);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }, [riskFilter]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const getRiskBadge = (score) => {
    if (score >= 70) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          High Risk ({score})
        </span>
      );
    } else if (score >= 40) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
          <TrendingUp className="h-3 w-3 mr-1" />
          Medium Risk ({score})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <TrendingDown className="h-3 w-3 mr-1" />
        Low Risk ({score})
      </span>
    );
  };

  const filteredContracts = contracts.filter(c => 
    c.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span className="text-2xl font-bold text-slate-900">Contracts</span>
            </div>
            <div className="w-48"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                data-testid="search-contracts-input"
                placeholder="Search by project, contractor, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
              />
            </div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#71C9CE]"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  data-testid="contract-item"
                  onClick={() => navigate(`/official/contracts/${contract.id}`)}
                  className="p-6 bg-[#CBF1F5] hover:bg-[#A6E3E9] rounded-lg border border-slate-100 hover:border-[#71C9CE] transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{contract.project_name}</h3>
                      <p className="text-sm text-slate-600">{contract.department}</p>
                    </div>
                    {getRiskBadge(contract.fraud_risk_score)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Contractor</p>
                      <p className="text-sm font-medium text-slate-900">{contract.contractor_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Contract Value</p>
                      <p className="text-sm font-bold text-slate-900">₹{(contract.contract_value / 10000000).toFixed(2)} Cr</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <p className="text-sm font-medium text-slate-900 capitalize">{contract.status}</p>
                    </div>
                  </div>

                  {contract.flags && Object.keys(contract.flags).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex flex-wrap gap-2">
                        {contract.flags.single_bidder && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Single Bidder</span>
                        )}
                        {contract.flags.repeated_vendor && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">Repeated Vendor</span>
                        )}
                        {contract.flags.timeline_overrun && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">Timeline Overrun</span>
                        )}
                        {contract.flags.budget_escalation && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">Budget Escalation</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No contracts found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsList;