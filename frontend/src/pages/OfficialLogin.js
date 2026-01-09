import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const OfficialLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/official/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3FDFD] flex items-center justify-center px-4">
      <div className="absolute top-4 left-4">
        <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-[#E3FDFD] rounded-full mb-4">
              <Shield className="h-12 w-12 text-[#71C9CE]" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Official Portal</h1>
            <p className="text-slate-600 mt-2">Login to access fraud detection system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                data-testid="login-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
                placeholder="official@sentinel.gov.in"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                data-testid="login-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71C9CE] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              data-testid="login-submit-btn"
              disabled={loading}
              className="w-full py-3 bg-[#71C9CE] hover:bg-[#5BB8BE] text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 shadow-lg shadow-cyan-200/50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#E3FDFD] rounded-lg border border-[#A6E3E9]">
            <p className="text-sm text-slate-600 text-center">
              Demo Credentials:
              <br />
              <span className="font-mono font-medium text-slate-900">official@sentinel.gov.in / demo123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialLogin;