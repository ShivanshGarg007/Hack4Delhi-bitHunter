import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, FileText, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#E3FDFD]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#71C9CE] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-10 w-10 text-[#71C9CE]" strokeWidth={1.5} />
              <span className="text-3xl font-bold text-slate-900 tracking-tight">Sentinel</span>
            </div>
          </nav>

          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center max-w-4xl space-y-12">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 leading-tight">
                  Public Integrity
                  <br />
                  <span className="text-[#71C9CE]">Powered by Truth</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  AI-powered fraud detection platform for government contracts and procurement.
                  Transparent. Accountable. Data-driven.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  data-testid="citizen-portal-btn"
                  onClick={() => navigate('/citizen')}
                  className="group relative bg-white hover:bg-[#CBF1F5] border-2 border-slate-100 hover:border-[#A6E3E9] rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-[#E3FDFD] rounded-lg group-hover:bg-[#A6E3E9] transition-colors duration-300">
                      <Users className="h-8 w-8 text-[#71C9CE]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Citizen Portal</h3>
                      <p className="text-sm text-slate-600">View projects, check transparency, report concerns</p>
                    </div>
                  </div>
                </button>

                <button
                  data-testid="official-portal-btn"
                  onClick={() => navigate('/official/login')}
                  className="group relative bg-[#71C9CE] hover:bg-[#5BB8BE] text-white rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-lg shadow-cyan-200/50"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                      <Shield className="h-8 w-8 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Official Portal</h3>
                      <p className="text-sm opacity-90">Fraud detection, analytics, audit management</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-200">
                <div className="text-center space-y-3">
                  <FileText className="h-8 w-8 text-[#71C9CE] mx-auto" strokeWidth={1.5} />
                  <h4 className="font-semibold text-slate-900">Transparent Data</h4>
                  <p className="text-sm text-slate-600">Real-time contract and procurement information</p>
                </div>
                <div className="text-center space-y-3">
                  <TrendingUp className="h-8 w-8 text-[#71C9CE] mx-auto" strokeWidth={1.5} />
                  <h4 className="font-semibold text-slate-900">AI Analysis</h4>
                  <p className="text-sm text-slate-600">Machine learning fraud detection with explanations</p>
                </div>
                <div className="text-center space-y-3">
                  <Users className="h-8 w-8 text-[#71C9CE] mx-auto" strokeWidth={1.5} />
                  <h4 className="font-semibold text-slate-900">Citizen Voice</h4>
                  <p className="text-sm text-slate-600">Anonymous reporting for ground-level insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;