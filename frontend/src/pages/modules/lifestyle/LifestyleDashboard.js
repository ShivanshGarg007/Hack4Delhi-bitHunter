import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ScanLine, AlertTriangle, CheckCircle2, Users, Car, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LifestyleDashboard = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '1980-01-01',
    address: 'Delhi'
  });

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`${API}/lifestyle/stats`),
        axios.get(`${API}/lifestyle/history?limit=5`)
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Failed to fetch lifestyle data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter applicant name');
      return;
    }

    setScanning(true);
    setScanResult(null);

    try {
      const response = await axios.post(`${API}/lifestyle/scan`, formData);
      setScanResult(response.data);
      fetchData(); // Refresh stats
      
      if (response.data.integrity_status === 'CLEAN') {
        toast.success('Applicant is ELIGIBLE');
      } else if (response.data.integrity_status === 'CRITICAL FRAUD') {
        toast.error('CRITICAL FRAUD detected');
      } else {
        toast.warning('Review required for this applicant');
      }
    } catch (error) {
      console.error('Scan failed:', error);
      toast.error('Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CLEAN': return 'bg-green-500';
      case 'REVIEW REQUIRED': return 'bg-yellow-500';
      case 'CRITICAL FRAUD': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CLEAN': return <CheckCircle2 className="h-16 w-16 text-green-600" />;
      case 'REVIEW REQUIRED': return <AlertTriangle className="h-16 w-16 text-yellow-600" />;
      case 'CRITICAL FRAUD': return <AlertTriangle className="h-16 w-16 text-red-600" />;
      default: return null;
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
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-900">SATARK-360 Scanner</h1>
          <Badge className="bg-purple-500">PRO</Badge>
        </div>
        <p className="text-slate-600">AI-powered 360° lifestyle & asset mismatch detection</p>
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
            <CardTitle className="text-sm font-medium text-red-600">Critical Fraud</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats?.status_distribution?.critical_fraud || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Review Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats?.status_distribution?.review_required || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Clean</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats?.status_distribution?.clean || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scan Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ScanLine className="h-5 w-5" />
              <span>360° Profile Scan</span>
            </CardTitle>
            <CardDescription>Enter applicant details to scan Family, Assets & Lifestyle</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <Label htmlFor="name">Head of Family Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Rajesh Kumar"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Declared Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Full Address..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#71C9CE] hover:bg-[#5fb8bd]"
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scanning Authorities...
                  </>
                ) : (
                  <>
                    <ScanLine className="h-4 w-4 mr-2" />
                    Run Deep Scan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Scan Result */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Result</CardTitle>
            <CardDescription>AI-powered integrity assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult ? (
              <div className={`p-6 rounded-lg ${
                scanResult.integrity_status === 'CLEAN' ? 'bg-green-50' :
                scanResult.integrity_status === 'REVIEW REQUIRED' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className="flex flex-col items-center text-center mb-6">
                  {getStatusIcon(scanResult.integrity_status)}
                  <h3 className="text-2xl font-bold mt-4">{scanResult.integrity_status}</h3>
                  <p className="text-slate-600 mt-2">{scanResult.system_message}</p>
                </div>

                <div className="space-y-4">
                  {/* Risk Score */}
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-slate-600">Risk Score</span>
                    <span className="text-2xl font-bold">{scanResult.risk_score}/100</span>
                  </div>

                  {/* Family Cluster */}
                  {scanResult.family_cluster?.length > 0 && (
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-600">Family Cluster</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scanResult.family_cluster.map((member, i) => (
                          <Badge key={i} variant="secondary">{member}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assets Detected */}
                  {scanResult.assets_detected?.length > 0 && (
                    <div className="p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-slate-600">Assets Detected</span>
                      </div>
                      <ul className="space-y-1">
                        {scanResult.assets_detected.map((asset, i) => (
                          <li key={i} className="text-sm text-slate-700">{asset}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <ScanLine className="h-16 w-16 mx-auto mb-4" />
                <p>Enter applicant details and run a scan to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {history?.scans?.length > 0 ? (
            <div className="space-y-4">
              {history.scans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(scan.integrity_status)}`}></div>
                    <div>
                      <p className="font-medium text-slate-900">{scan.applicant_name}</p>
                      <p className="text-sm text-slate-500">
                        Scanned by {scan.scanned_by_name} • {new Date(scan.scanned_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(scan.integrity_status)}>
                      {scan.integrity_status}
                    </Badge>
                    <span className="text-sm font-medium">
                      Risk: {scan.risk_score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No scans recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LifestyleDashboard;
