# 🚀 Sentinel Platform - Deployment Documentation

> Complete deployment guide for Vercel (Frontend) + Render (Backend + ML)

---

## 📚 Documentation Index

This repository contains comprehensive deployment documentation:

### 🎯 Quick Start
**[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)**
- 5-minute overview
- Essential steps only
- Perfect for experienced developers
- Time: ~30 minutes

### 📖 Complete Guide
**[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
- Detailed step-by-step instructions
- Architecture overview
- All configuration options
- Post-deployment setup
- Security best practices
- Monitoring setup

### ✅ Checklist
**[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**
- Printable checklist
- Track your progress
- Verify all steps completed
- Credentials reference sheet

### 🔧 Troubleshooting
**[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
- Common issues and solutions
- Debugging tools
- Emergency procedures
- Performance optimization

---

## 🎯 Project Overview

**Sentinel** is a comprehensive fraud detection platform for government operations with three integrated modules:

### Core Features
- Contract & Vendor Management
- Citizen Reporting System
- ML-Powered Fraud Risk Scoring

### Integrated Modules
1. **Welfare Fraud Detection** - ML model trained on 1,050+ records
2. **PDS Ledger** - Blockchain-based transaction tracking
3. **Lifestyle Mismatch Detection** - 360° profile scanning with AI

---

## 🏗️ Architecture

```
Frontend (Vercel)          Backend (Render)
    React App      →       FastAPI + ML Models
                                  ↓
                          ┌───────┴────────┐
                          ↓                ↓
                    MongoDB Atlas    Supabase
                     (Database)      (Storage)
```

---

## ⚡ Quick Start

### Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Supabase account (free)
- Render account (free)
- Vercel account (free)

### 5-Step Deployment

1. **Setup MongoDB Atlas** (5 min)
   - Create cluster
   - Get connection string

2. **Setup Supabase** (3 min)
   - Create project
   - Create storage bucket
   - Get API keys

3. **Deploy Backend on Render** (10 min)
   - Connect GitHub repo
   - Configure environment variables
   - Deploy

4. **Deploy Frontend on Vercel** (5 min)
   - Connect GitHub repo
   - Configure environment variables
   - Deploy

5. **Seed Database & Test** (7 min)
   - Run seed script
   - Create admin user
   - Verify all features

**Total Time: ~30 minutes**

See [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) for details.

---

## 📋 What You'll Need

### Services (All Free Tier)
- **MongoDB Atlas**: Database (512MB free)
- **Supabase**: File storage (1GB free)
- **Render**: Backend hosting (750 hours/month free)
- **Vercel**: Frontend hosting (100GB bandwidth free)

### Information to Collect
- MongoDB connection string
- Supabase URL + service_role key
- JWT secret (generate random 32 chars)
- Backend URL (from Render)
- Frontend URL (from Vercel)

---

## 🔑 Environment Variables

### Backend (Render)
```env
PORT=10000
HOST=0.0.0.0
MONGO_URL=mongodb+srv://...
DB_NAME=fraud_detection_db
JWT_SECRET=<32-char-random>
JWT_ALGORITHM=HS256
CORS_ORIGINS=https://your-app.vercel.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...
SUPABASE_BUCKET=citizen-reports
ENVIRONMENT=production
```

### Frontend (Vercel)
```env
REACT_APP_BACKEND_URL=https://sentinel-backend.onrender.com
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=production
```

---

## 🧪 Testing Your Deployment

### Quick Health Check
```bash
# Backend API docs
https://sentinel-backend.onrender.com/docs

# Frontend
https://your-app.vercel.app

# Login
https://your-app.vercel.app/official/login
```

### Feature Checklist
- [ ] Landing page loads
- [ ] User login works
- [ ] Dashboard displays data
- [ ] Welfare module works
- [ ] Ledger module works
- [ ] Lifestyle module works
- [ ] File upload works

---

## 🐛 Common Issues

### "CORS Error"
→ Update `CORS_ORIGINS` in Render to include Vercel URL

### "Database Connection Failed"
→ Check MongoDB IP whitelist (should be 0.0.0.0/0)

### "Cold Start (15s delay)"
→ Normal on Render free tier (upgrade to fix)

### "Build Failed"
→ Check root directory is set correctly

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

---

## 📊 Tech Stack

### Frontend
- React 18
- TailwindCSS
- Radix UI
- React Router
- Axios

### Backend
- FastAPI (Python 3.11)
- Motor (async MongoDB)
- JWT Authentication
- Pydantic validation

### ML/AI
- Scikit-learn
- XGBoost
- Pandas
- DuckDB
- Splink (entity resolution)

### Infrastructure
- MongoDB Atlas (database)
- Supabase (file storage)
- Render (backend hosting)
- Vercel (frontend hosting)

---

## 📁 Project Structure

```
Hack4Delhi-bitHunter/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   └── App.js           # Main app
│   ├── package.json
│   └── .env.example
│
├── backend/                  # FastAPI backend
│   ├── core/                # Core utilities
│   │   ├── auth.py          # Authentication
│   │   ├── database.py      # DB connection
│   │   └── logging.py       # Logging
│   ├── routes/              # API routes
│   │   ├── welfare.py       # Welfare fraud
│   │   ├── ledger.py        # PDS ledger
│   │   └── lifestyle.py     # Lifestyle mismatch
│   ├── services/            # Business logic
│   │   ├── welfare.py
│   │   ├── ledger.py
│   │   ├── lifestyle.py
│   │   └── welfare_ml_model.py  # ML model
│   ├── data/                # CSV datasets
│   ├── server.py            # Main server
│   ├── seed_delhi_data.py   # Data seeding
│   ├── requirements.txt
│   └── .env.example
│
└── docs/                     # Documentation
    ├── DEPLOYMENT_GUIDE.md
    ├── DEPLOYMENT_QUICK_START.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── TROUBLESHOOTING.md
```

---

## 🔒 Security

### Implemented
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ HTTPS enforced
- ✅ CORS configured
- ✅ Input validation
- ✅ SQL injection prevention (ORM)
- ✅ XSS prevention (React)

### Recommendations
- Rotate JWT secret every 90 days
- Use strong passwords
- Restrict MongoDB IP access in production
- Enable rate limiting
- Regular security audits

---

## 📈 Scaling

### Current Capacity (Free Tier)
- **Render**: 750 hours/month, 512MB RAM
- **MongoDB**: 512MB storage, shared cluster
- **Vercel**: 100GB bandwidth/month
- **Supabase**: 1GB storage, 2GB bandwidth

### Upgrade Path
1. **Render**: $7/month (no cold starts, 512MB RAM)
2. **MongoDB**: $9/month (2GB storage, backups)
3. **Vercel**: Usually free tier sufficient
4. **Supabase**: $25/month (8GB storage, 100GB bandwidth)

### Performance Optimization
- Add database indexes
- Enable caching (Redis)
- Use CDN for static assets
- Optimize ML model loading
- Connection pooling

---

## 🛠️ Maintenance

### Daily
- Monitor uptime (UptimeRobot)
- Check error logs

### Weekly
- Review all logs
- Test all features
- Backup database

### Monthly
- Update dependencies
- Security review
- Performance audit

### Quarterly
- Rotate secrets
- Capacity planning
- Cost review

---

## 📞 Support

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- [FastAPI Discord](https://discord.gg/fastapi)
- [React Discord](https://discord.gg/react)
- [MongoDB Forums](https://www.mongodb.com/community/forums/)

### Issues
If you encounter issues:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review deployment logs
3. Search error message online
4. Ask in community forums

---

## 🎯 Next Steps After Deployment

1. **Configure Monitoring**
   - Setup UptimeRobot
   - Configure error tracking (Sentry)
   - Setup alerts

2. **Custom Domain** (Optional)
   - Purchase domain
   - Configure DNS
   - Update CORS settings

3. **Performance Optimization**
   - Add database indexes
   - Enable caching
   - Optimize images

4. **Security Hardening**
   - Restrict MongoDB IP access
   - Enable rate limiting
   - Setup WAF (optional)

5. **Team Onboarding**
   - Share documentation
   - Create user accounts
   - Schedule training

---

## 📊 Monitoring URLs

After deployment, bookmark these:

```
Frontend:     https://your-app.vercel.app
Backend:      https://sentinel-backend.onrender.com
API Docs:     https://sentinel-backend.onrender.com/docs

MongoDB:      https://cloud.mongodb.com
Supabase:     https://app.supabase.com
Render:       https://dashboard.render.com
Vercel:       https://vercel.com/dashboard
```

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads without errors
- ✅ Backend API responds
- ✅ User can login
- ✅ Dashboard shows data
- ✅ All 3 modules work (welfare, ledger, lifestyle)
- ✅ File upload works
- ✅ No CORS errors
- ✅ No console errors
- ✅ Performance acceptable (< 3s page load)

---

## 📝 Version History

- **v1.0.0** (2026-02-11): Initial deployment documentation
  - Complete deployment guide
  - Quick start guide
  - Troubleshooting guide
  - Deployment checklist

---

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is part of Hack4Delhi hackathon submission.

---

## 👥 Team

**bitHunter Team**
- Hack4Delhi 2026 Participants

---

## 🙏 Acknowledgments

- Hack4Delhi organizers
- Open source community
- FastAPI, React, and all dependencies

---

## 📧 Contact

For questions or support:
- Create an issue on GitHub
- Check documentation first
- Review troubleshooting guide

---

**Ready to deploy? Start with [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)!**

🚀 Happy deploying!
