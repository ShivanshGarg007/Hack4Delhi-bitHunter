# 🛡️ Sentinel - Public Integrity Platform

> AI-powered fraud detection system for government operations

**Team:** bitHunter  
**Event:** Hack4Delhi 2026  
**Status:** Ready for deployment ✅

---

## 🎯 Quick Links

### 🚀 Deploy Now
- **[5-Minute Frontend Deploy](./VERCEL_QUICK_START.md)** - Deploy to Vercel
- **[3-Minute Backend Fix](./QUICK_FIX_NOW.md)** - Fix port issue
- **[Complete Guide](./DEPLOYMENT_GUIDE.md)** - Full deployment

### 📚 Documentation
- **[Deployment Summary](./COMPLETE_DEPLOYMENT_SUMMARY.md)** - Overview
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Track progress

---

## 🌟 Features

### Core Platform
- 📊 **Contract Management** - Track government contracts
- 👥 **Vendor Monitoring** - Analyze vendor performance
- 📢 **Citizen Reporting** - Public complaint system
- 🎯 **Fraud Risk Scoring** - ML-powered detection

### Integrated Modules

#### 1. Welfare Fraud Detection
- ML model trained on 1,050+ financial records
- Cross-checks: Vahan (vehicles) + Discom (electricity)
- Risk classification: Red/Yellow/Green
- Real-time scanning

#### 2. PDS Ledger (Blockchain)
- Tamper-proof transaction tracking
- SHA-256 hash verification
- Public Distribution System monitoring
- Integrity verification

#### 3. Lifestyle Mismatch Detection
- 360° profile scanning
- AI-powered entity resolution (Splink)
- Family cluster analysis
- Asset detection

---

## 🏗️ Architecture

```
Frontend (Vercel)  →  Backend (Render)  →  MongoDB Atlas
                                        →  Supabase Storage
```

**Tech Stack:**
- Frontend: React 18, TailwindCSS, Radix UI
- Backend: FastAPI, Python 3.11, Motor
- ML/AI: Scikit-learn, XGBoost, Splink
- Database: MongoDB Atlas
- Storage: Supabase

---

## 🚀 Quick Start

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)
- Supabase account (free)

### Deploy in 3 Steps

#### 1. Fix Backend (3 minutes)
```bash
# Commit dependency fixes
git add backend/requirements.txt
git commit -m "Fix deployment dependencies"
git push origin main

# Then update Render:
# Settings → Start Command → uvicorn server:app --host 0.0.0.0 --port $PORT
# Environment → Delete PORT variable
```

**Guide:** [QUICK_FIX_NOW.md](./QUICK_FIX_NOW.md)

#### 2. Deploy Frontend (5 minutes)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import repository
3. Root directory: `frontend`
4. Add env vars:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.onrender.com
   ```
5. Deploy!

**Guide:** [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)

#### 3. Update CORS (1 minute)
```bash
# In Render → Environment → CORS_ORIGINS:
https://your-app.vercel.app,https://your-app-*.vercel.app
```

**Total Time:** ~10 minutes  
**Total Cost:** $0 (free tier)

---

## 📊 Project Structure

```
Hack4Delhi-bitHunter/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   └── contexts/        # React contexts
│   └── package.json
│
├── backend/                  # FastAPI backend
│   ├── core/                # Core utilities
│   │   ├── auth.py          # Authentication
│   │   └── database.py      # DB connection
│   ├── routes/              # API routes
│   │   ├── welfare.py       # Welfare fraud
│   │   ├── ledger.py        # PDS ledger
│   │   └── lifestyle.py     # Lifestyle mismatch
│   ├── services/            # Business logic
│   │   └── welfare_ml_model.py  # ML model
│   ├── data/                # CSV datasets
│   ├── server.py            # Main server
│   └── requirements.txt
│
└── docs/                     # Documentation
    ├── DEPLOYMENT_GUIDE.md
    ├── VERCEL_QUICK_START.md
    └── TROUBLESHOOTING.md
```

---

## 🔧 Development

### Local Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python server.py
# Runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Environment Variables

**Backend (.env):**
```bash
MONGO_URL=mongodb+srv://...
DB_NAME=fraud_detection_db
JWT_SECRET=your-secret-key
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-key
```

**Frontend (.env):**
```bash
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 📚 API Documentation

Once deployed, visit:
```
https://your-backend.onrender.com/docs
```

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Welfare Fraud:**
- `GET /api/welfare/analyze` - Analyze all applicants
- `POST /api/welfare/scan` - Scan individual
- `GET /api/welfare/stats` - Get statistics

**PDS Ledger:**
- `GET /api/ledger/blocks` - Get blockchain
- `POST /api/ledger/transaction` - Add transaction
- `GET /api/ledger/verify` - Verify integrity

**Lifestyle:**
- `POST /api/lifestyle/scan` - 360° scan
- `GET /api/lifestyle/history` - Scan history
- `GET /api/lifestyle/stats` - Statistics

---

## 🧪 Testing

### Run Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Test Coverage
- Unit tests for ML models
- Integration tests for API
- E2E tests for frontend

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ HTTPS enforced
- ✅ CORS configured
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS prevention

---

## 📈 Performance

### Metrics
- Page load: < 3 seconds
- API response: < 2 seconds
- ML inference: < 3 seconds
- Database queries: < 500ms

### Optimization
- Code splitting
- Lazy loading
- CDN caching
- Database indexing

---

## 🐛 Troubleshooting

### Common Issues

**Build Failed:**
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Verify dependencies
- Clear build cache

**CORS Error:**
- Update backend CORS_ORIGINS
- Include Vercel URL
- No trailing slashes

**Port Mismatch:**
- See [RENDER_PORT_FIX.md](./RENDER_PORT_FIX.md)
- Use `$PORT` in start command

---

## 💰 Cost

### Free Tier (Demo)
- Vercel: $0
- Render: $0 (sleeps after 15 min)
- MongoDB: $0 (512MB)
- Supabase: $0 (1GB)

**Total: $0/month** ✅

### Paid Tier (Production)
- Vercel: $0
- Render: $7/month
- MongoDB: $9/month
- Supabase: $25/month

**Total: ~$41/month**

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

This project is part of Hack4Delhi hackathon submission.

---

## 👥 Team bitHunter

**Hack4Delhi 2026 Participants**

---

## 🙏 Acknowledgments

- Hack4Delhi organizers
- Open source community
- FastAPI, React, and all dependencies

---

## 📞 Support

### Documentation
- [Complete Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Quick Start](./DEPLOYMENT_QUICK_START.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [API Documentation](https://your-backend.onrender.com/docs)

### Community
- Create an issue on GitHub
- Check troubleshooting guide
- Review deployment logs

---

## 🎯 Deployment Status

| Component | Status | Action |
|-----------|--------|--------|
| Backend Dependencies | ✅ Fixed | Commit & push |
| Backend Port Config | ⚠️ Needs fix | Update Render |
| Frontend | ⏳ Ready | Deploy to Vercel |
| Database | ⏳ Ready | Setup MongoDB |
| Storage | ⏳ Ready | Setup Supabase |

**Next Step:** [Fix backend port](./QUICK_FIX_NOW.md) → [Deploy frontend](./VERCEL_QUICK_START.md)

---

## 🚀 Get Started

**Ready to deploy?**

1. **[Fix Backend Port](./QUICK_FIX_NOW.md)** (3 min)
2. **[Deploy Frontend](./VERCEL_QUICK_START.md)** (5 min)
3. **[Complete Setup](./DEPLOYMENT_GUIDE.md)** (30 min)

---

## 🎉 Success!

Once deployed, your app will be live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`

---

**Built with ❤️ for Hack4Delhi 2026**

**Fighting fraud with AI and blockchain** 🛡️

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0  
**Status:** Production Ready ✅
