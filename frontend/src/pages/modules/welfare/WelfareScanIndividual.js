'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const WelfareScanIndividual = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    applicant_id: '',
    name: '',
    dob: '',
    address: '',
    declared_income: '',
    asset_flag: 'Standard'
  });

  const assetOptions = [
    { value: 'Standard', label: 'Standard Assets' },
    { value: 'Mutual Funds > 5L', label: 'Mutual Funds > 5 Lakhs' },
    { value: 'Luxury Car', label: 'Luxury Car' },
    { value: 'Property > 50L', label: 'Property > 50 Lakhs' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssetChange = (value) => {
    setFormData(prev => ({
      ...prev,
      asset_flag: value
    }));
  };

  const handleScan = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.applicant_id || !formData.name || !formData.dob || !formData.address || !formData.declared_income) {
      toast.error('Please fill in all required fields');
      return;
    }

    setScanning(true);
    try {
      const response = await axios.post(`${API}/api/welfare/scan`, {
        applicant_id: formData.applicant_id,
        name: formData.name,
        dob: formData.dob,
        address: formData.address,
        declared_income: parseFloat(formData.declared_income),
        asset_flag: formData.asset_flag
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setResult(response.data);
      toast.success('Scan completed successfully');
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById('scan-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Scan failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to scan applicant');
    } finally {
      setScanning(false);
    }
  };

  const getRiskIcon = (status) => {
    switch (status) {
      case 'red':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'yellow':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'green':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return null;
    }
  };

  const getRiskColor = (status) => {
    switch (status) {
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50';
      case 'green':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Scan Individual Applicant</h1>
          <p className="text-slate-600">Verify welfare fraud risk using ML-trained model on financial intelligence data</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/official/welfare')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Details</CardTitle>
              <CardDescription>Enter applicant information for fraud risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScan} className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Applicant ID *
                    </label>
                    <Input
                      name="applicant_id"
                      placeholder="e.g., DLHI000001"
                      value={formData.applicant_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      placeholder="e.g., Raj Kumar Singh"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth *
                    </label>
                    <Input
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Declared Annual Income (₹) *
                    </label>
                    <Input
                      name="declared_income"
                      type="number"
                      placeholder="e.g., 300000"
                      value={formData.declared_income}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address *
                  </label>
                  <Input
                    name="address"
                    placeholder="e.g., 123 Main Street, Delhi"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Asset Type
                  </label>
                  <Select value={formData.asset_flag} onValueChange={handleAssetChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assetOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    Based on Vahan (vehicle) and property records
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={scanning}
                    className="flex-1 bg-[#71C9CE] hover:bg-[#5fb8bd]"
                  >
                    {scanning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Scanning...
                      </>
                    ) : (
                      'Scan Applicant'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        applicant_id: '',
                        name: '',
                        dob: '',
                        address: '',
                        declared_income: '',
                        asset_flag: 'Standard'
                      });
                      setResult(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div>
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-1">ML-Trained Model</h4>
                <p>Uses financial intelligence dataset with 1,050 records for accurate fraud detection</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Risk Factors</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Asset ownership (Vahan)</li>
                  <li>Income-asset mismatch</li>
                  <li>Age & demographics</li>
                  <li>Address patterns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Risk Levels</h4>
                <div className="space-y-1">
                  <p>🔴 <span className="font-semibold">Red (High):</span> Likely fraud</p>
                  <p>🟡 <span className="font-semibold">Yellow (Medium):</span> Suspicious</p>
                  <p>🟢 <span className="font-semibold">Green (Low):</span> Safe</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scan Result */}
      {result && (
        <div id="scan-result" className="mt-8">
          <Card className={`border-2 ${getRiskColor(result.risk_status)}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRiskIcon(result.risk_status)}
                  <div>
                    <CardTitle className="text-xl">{result.name}</CardTitle>
                    <CardDescription>ID: {result.applicant_id} | Risk Status: {result.risk_status.toUpperCase()}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={result.risk_status === 'red' ? 'destructive' : result.risk_status === 'yellow' ? 'warning' : 'success'}
                  className="text-base px-4 py-2"
                >
                  {result.risk_status === 'red' ? 'HIGH RISK' : result.risk_status === 'yellow' ? 'MEDIUM RISK' : 'LOW RISK'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Risk Score */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Fraud Probability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-900">
                      {(result.fraud_probability * 100).toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Age</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-900">
                      {result.feature_values?.age || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Declared Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{(result.declared_income / 100000).toFixed(1)}L
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Flags */}
              {result.flags && result.flags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Red Flags Detected ({result.flags.length})
                  </h3>
                  <div className="space-y-2">
                    {result.flags.map((flag, idx) => (
                      <Alert key={idx} className={`border-l-4 ${
                        flag.severity === 'high' ? 'border-l-red-600 bg-red-50' : 'border-l-yellow-600 bg-yellow-50'
                      }`}>
                        <AlertDescription>
                          <p className="font-semibold text-slate-900 capitalize">
                            {flag.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{flag.details}</p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Features */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Model Feature Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  {result.feature_values && Object.entries(result.feature_values).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-lg font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <Alert className={`border-l-4 ${
                result.risk_status === 'red' ? 'border-l-red-600 bg-red-50' :
                result.risk_status === 'yellow' ? 'border-l-yellow-600 bg-yellow-50' :
                'border-l-green-600 bg-green-50'
              }`}>
                <AlertDescription>
                  <p className="font-semibold text-slate-900 mb-1">Recommendation</p>
                  {result.risk_status === 'red' && (
                    <p className="text-sm text-slate-600">⛔ Reject welfare application. High fraud risk detected. Recommend for detailed investigation.</p>
                  )}
                  {result.risk_status === 'yellow' && (
                    <p className="text-sm text-slate-600">⚠️ Manual review required. Some anomalies detected. Recommend cross-verification with authorities.</p>
                  )}
                  {result.risk_status === 'green' && (
                    <p className="text-sm text-slate-600">✓ Application appears legitimate. Can proceed with standard processing.</p>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WelfareScanIndividual;
