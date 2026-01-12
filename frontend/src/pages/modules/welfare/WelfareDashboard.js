import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserSearch, AlertTriangle, CheckCircle2, Clock, ArrowRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WelfareDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/welfare/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch welfare stats:', error);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/welfare/history?limit=10`);
      setAnalysisResults(response.data);
    } catch (error) {
      console.error('Failed to fetch welfare history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, [fetchStats, fetchHistory]);

  const runBulkAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await axios.get(`${API}/welfare/analyze`);
      toast.success(`Analyzed ${response.data.total_analyzed} applicants`);
      fetchStats();
      fetchHistory();
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to run bulk analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskBadge = (status) => {
    switch (status) {
      case 'red':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'yellow':
        return <Badge variant="warning" className="bg-yellow-500">Medium Risk</Badge>;
      case 'green':
        return <Badge variant="success" className="bg-green-500">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#71C9CE]"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welfare Fraud Detection</h1>
        <p className="text-slate-600">Cross-reference welfare applicants against Vahan & Discom databases</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total_scans || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats?.risk_distribution?.high_risk || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats?.risk_distribution?.medium_risk || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats?.risk_distribution?.low_risk || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <Button
          onClick={runBulkAnalysis}
          disabled={analyzing}
          className="bg-[#71C9CE] hover:bg-[#5fb8bd]"
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Run Bulk Analysis
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/official/welfare/scan')}
        >
          <UserSearch className="h-4 w-4 mr-2" />
          Scan Individual
        </Button>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>Latest welfare applicant verification results</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResults?.scans?.length > 0 ? (
            <div className="space-y-4">
              {analysisResults.scans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      scan.risk_status === 'red' ? 'bg-red-100' :
                      scan.risk_status === 'yellow' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      {scan.risk_status === 'red' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : scan.risk_status === 'yellow' ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{scan.name}</p>
                      <p className="text-sm text-slate-500">
                        Declared Income: ₹{scan.declared_income?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getRiskBadge(scan.risk_status)}
                    {scan.flags?.length > 0 && (
                      <span className="text-sm text-slate-500">
                        {scan.flags.length} flag(s)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <UserSearch className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No scans yet. Run a bulk analysis or scan an individual applicant.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WelfareDashboard;
