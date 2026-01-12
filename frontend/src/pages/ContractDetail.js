import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, TrendingUp, Calendar, DollarSign, User, MapPin, FileCheck, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchContract = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/official/contracts/${id}`);
      setContract(response.data);
    } catch (error) {
      console.error('Failed to fetch contract:', error);
      toast.error('Failed to load contract details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  const handleAuditAction = async (e) => {
    e.preventDefault();
    if (!actionType) {
      toast.error('Please select an action');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/official/contracts/${id}/audit-action`, {
        action: actionType,
        notes: notes
      });
      toast.success('Audit action recorded successfully');
      setActionType('');
      setNotes('');
      fetchContract();
    } catch (error) {
      console.error('Failed to record audit action:', error);
      toast.error('Failed to record audit action');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center">
        <p className="text-slate-600">Contract not found</p>
      </div>
    );
  }

  const fraudExplanations = contract.fraud_explanations || [];

  return (
    <div className="min-h-screen bg-[#E3FDFD]">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/official/contracts')} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Contracts</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{contract.project_name}</h1>
                <p className="text-slate-600">{contract.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Fraud Risk Score</p>
                <p className={`text-4xl font-bold ${getRiskColor(contract.fraud_risk_score)}`}>
                  {contract.fraud_risk_score}
                </p>
                <p className="text-sm font-medium text-slate-600 mt-1">{contract.risk_level} Risk</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">Contract Value</span>
                </div>
                <p className="text-xl font-bold text-slate-900">₹{(contract.contract_value / 10000000).toFixed(2)} Cr</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Contractor</span>
                </div>
                <p className="text-base font-bold text-slate-900 truncate">{contract.contractor_name}</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-base font-bold text-slate-900 capitalize">{contract.status}</p>
              </div>

              <div className="bg-[#CBF1F5] rounded-lg p-4">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <FileCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Audit Status</span>
                </div>
                <p className="text-base font-bold text-slate-900 capitalize">{contract.audit_status}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Risk Explanation</h2>
            <div className="space-y-3">
              {fraudExplanations.length > 0 ? (
                fraudExplanations.map((explanation, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-[#E3FDFD] rounded-lg border border-[#A6E3E9]">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-900">{explanation}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">No specific risk factors identified</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contract Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="text-base font-medium text-slate-900">{contract.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <p className="text-base font-medium text-slate-900">{contract.location?.city}, {contract.location?.state}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Start Date</p>
                  <p className="text-base font-medium text-slate-900">{formatDate(contract.start_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Expected Completion</p>
                  <p className="text-base font-medium text-slate-900">{formatDate(contract.expected_completion)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Number of Bidders</p>
                  <p className="text-base font-medium text-slate-900">{contract.bidder_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Vendor Information</h2>
              {contract.vendor_details ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Company Name</p>
                    <p className="text-base font-medium text-slate-900">{contract.vendor_details.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Registration Number</p>
                    <p className="text-base font-medium text-slate-900">{contract.vendor_details.registration_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Vendor Risk Score</p>
                    <p className={`text-lg font-bold ${getRiskColor(contract.vendor_details.risk_score)}`}>
                      {contract.vendor_details.risk_score}/100
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/official/vendors/${contract.contractor_id}`)}
                    className="mt-4 px-4 py-2 bg-[#71C9CE] hover:bg-[#5BB8BE] text-white rounded-lg transition-colors duration-300"
                  >
                    View Vendor Details
                  </button>
                </div>
              ) : (
                <p className="text-slate-600">Vendor information not available</p>
              )}
            </div>
          </div>

          {contract.citizen_reports && contract.citizen_reports.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Citizen Reports ({contract.citizen_reports.length})</h2>
              <div className="space-y-3">
                {contract.citizen_reports.map((report) => (
                  <div key={report.id} className="p-4 bg-[#CBF1F5] rounded-lg border border-slate-100">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-slate-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-slate-900">{report.description}</p>
                        <p className="text-sm text-slate-500 mt-2">
                          {formatDate(report.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Record Audit Action</h2>
            <form onSubmit={handleAuditAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Action *</label>
                <select
                  data-testid="audit-action-select"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
                >
                  <option value="">Select an action</option>
                  <option value="send_for_audit">Send for Audit</option>
                  <option value="false_positive">Mark as False Positive</option>
                  <option value="under_investigation">Under Investigation</option>
                  <option value="cleared">Cleared</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
                  placeholder="Add any additional notes..."
                />
              </div>
              <button
                type="submit"
                data-testid="submit-audit-action-btn"
                disabled={submitting}
                className="px-6 py-2 bg-[#71C9CE] hover:bg-[#5BB8BE] text-white rounded-lg transition-colors duration-300 disabled:opacity-50"
              >
                {submitting ? 'Recording...' : 'Record Action'}
              </button>
            </form>

            {contract.audit_history && contract.audit_history.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Audit History</h3>
                <div className="space-y-2">
                  {contract.audit_history.map((action) => (
                    <div key={action.id} className="p-3 bg-[#E3FDFD] rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900 capitalize">{action.action.replace(/_/g, ' ')}</span>
                        <span className="text-slate-500">{formatDate(action.created_at)}</span>
                      </div>
                      <p className="text-slate-600 text-xs">By {action.officer_name}</p>
                      {action.notes && <p className="text-slate-700 mt-1">{action.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;