# 📋 DEPLOYMENT QUICK REFERENCE

## Tech Stack Summary

```
Frontend:   React + Tailwind CSS + Radix UI (CRA with Craco)
Backend:    FastAPI + Python 3.11 + Uvicorn
Database:   MongoDB (Motor async driver)
Storage:    Supabase (already integrated)
Auth:       JWT tokens
```

---

## 🎯 RECOMMENDED FREE DEPLOYMENT SERVICES

| Component | Service | Cost | Setup Time |
|-----------|---------|------|------------|
| **Frontend** | Vercel | FREE | 5 min |
| **Backend** | Render | FREE | 10 min |
| **Database** | MongoDB Atlas | FREE | 10 min |
| **Storage** | Supabase | FREE | 2 min |
| **TOTAL** | - | **$0/mo** | **27 min** |

---

## 🚀 DEPLOYMENT FLOW

```
Step 1: GitHub Repository (already done ✅)
   ↓
Step 2: MongoDB Atlas Setup (10 min)
   ↓
Step 3: Deploy Frontend to Vercel (5 min)
   ↓
Step 4: Deploy Backend to Render (10 min)
   ↓
Step 5: Configure CORS & Env Vars (5 min)
   ↓
Step 6: Test & Verify (10 min)
   ↓
🎉 LIVE! Your app is on the internet
```

---

## 📁 FILES CREATED FOR DEPLOYMENT

```
✅ backend/Dockerfile                    - Container config
✅ vercel.json                          - Frontend deployment config
✅ render.yaml                          - Backend deployment config
✅ frontend/.env.production.example      - Frontend env template
✅ backend/.env.production.example       - Backend env template
✅ DEPLOYMENT_RECOMMENDATIONS.md         - Full guide with cost analysis
✅ DEPLOYMENT_STEP_BY_STEP.md           - Step-by-step instructions
✅ DEPLOYMENT_QUICK_REFERENCE.md        - This file!
```

---

## 🔑 IMPORTANT ENVIRONMENT VARIABLES

### Frontend (.env.production)
```
REACT_APP_API_URL=https://bithunter-api.onrender.com
```

### Backend (.env or Render dashboard)
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
DB_NAME=bitHunter
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-key
SUPABASE_BUCKET=citizen-reports
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🔗 SIGNUP LINKS

| Service | Link | Notes |
|---------|------|-------|
| **Vercel** | https://vercel.com | Sign up with GitHub |
| **Render** | https://render.com | Sign up with GitHub |
| **MongoDB Atlas** | https://www.mongodb.com/cloud/atlas | Free tier 512MB |
| **Supabase** | https://app.supabase.com | Already using it |

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Git repository up to date
- [ ] All files committed and pushed
- [ ] Configuration files created (Dockerfile, vercel.json, render.yaml)

### Vercel Setup
- [ ] Account created and connected to GitHub
- [ ] Repository imported
- [ ] Root directory set to `frontend/`
- [ ] Environment variable `REACT_APP_API_URL` added
- [ ] Build and deployment successful

### Render Setup
- [ ] Account created and connected to GitHub
- [ ] Web service created
- [ ] Root directory set to `backend/`
- [ ] All 8 environment variables added
- [ ] Build and deployment successful

### MongoDB Setup
- [ ] Free cluster created (M0)
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained and verified

### Integration
- [ ] CORS updated in backend/server.py
- [ ] Frontend environment variables updated
- [ ] Backend environment variables configured
- [ ] Frontend builds successfully
- [ ] Backend starts without errors

### Testing
- [ ] Frontend loads: https://your-app.vercel.app
- [ ] Login works with demo credentials
- [ ] Can view contracts/vendors
- [ ] API responds: curl https://bithunter-api.onrender.com/health
- [ ] Database connection verified

---

## 🚨 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| **502 Bad Gateway from Render** | Cold start (wait 30s), check env vars |
| **"Cannot connect to backend"** | Check REACT_APP_API_URL in Vercel |
| **MongoDB connection failed** | Verify connection string, check IP whitelist |
| **Build fails on Vercel** | Check root directory is `frontend/`, yarn installed |
| **Build fails on Render** | Check root directory is `backend/`, Python 3.11 available |
| **CORS errors** | Update allow_origins in backend/server.py |
| **Blank frontend** | Hard refresh (Ctrl+Shift+R), check console errors |

---

## 💰 COST CALCULATION

### Free Tier Limits
```
Vercel:        100GB bandwidth/month (plenty for MVP)
Render:        750 hours/month (covers 24/7 with spin-down)
MongoDB:       512MB storage (good for dev/testing)
Supabase:      1GB storage (good for file uploads)
```

### Sufficient For
- ✅ 100+ daily active users
- ✅ 1,000+ monthly visits
- ✅ Development & testing
- ✅ Hackathon projects
- ✅ MVP validation

### When to Upgrade
- ❌ If you exceed 100GB bandwidth/month → Consider Render Pro
- ❌ If you need always-on (no spin-down) → Render Hobby ($7/mo)
- ❌ If you exceed 512MB data → MongoDB $57/month
- ❌ If you exceed 1GB files → Supabase $25/month

---

## 🎓 LEARNING RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **FastAPI**: https://fastapi.tiangolo.com
- **React**: https://react.dev

---

## 📊 EXPECTED PERFORMANCE

| Metric | Value |
|--------|-------|
| **Frontend Load Time** | 1-3 seconds (first load) |
| **API Response Time** | 200-500ms |
| **Database Query Time** | 50-100ms |
| **Total Page Load** | 2-5 seconds |
| **Uptime** | 99%+ |
| **Concurrent Users** | 50-100 (free tier) |

---

## 🔐 SECURITY NOTES

### Pre-Production
- [ ] Change JWT_SECRET to random string
- [ ] Use strong MongoDB password
- [ ] Restrict MongoDB IP access (production)
- [ ] Enable HTTPS (auto with Vercel/Render)
- [ ] Set Supabase Row Level Security (RLS)

### After Launch
- [ ] Monitor logs for errors
- [ ] Set up error tracking (Sentry optional)
- [ ] Regular security updates
- [ ] Backup MongoDB regularly
- [ ] Monitor costs to prevent surprises

---

## 📞 DEPLOYMENT SUPPORT

**Vercel Issues**: https://vercel.com/support
**Render Issues**: https://render.com/support
**MongoDB Issues**: https://support.mongodb.com
**Supabase Issues**: https://supabase.com/support

---

## ⚡ NEXT STEPS AFTER DEPLOYMENT

1. **Seed Database**: Run `python3 backend/seed_data.py`
2. **Test Features**: Go through all pages, test login
3. **Monitor Logs**: Watch for errors in first 24 hours
4. **Set Up Analytics** (optional): Google Analytics, Sentry
5. **Configure Monitoring** (optional): Error tracking, performance monitoring
6. **Plan Scaling** (optional): Think about when to upgrade

---

## 🎉 COMPLETION

**Estimated Total Time**: 45-60 minutes
**Difficulty**: Beginner-friendly
**Cost**: $0/month
**Result**: Production-ready application live on the internet!

**Your app URLs**:
- Frontend: https://your-app.vercel.app
- Backend: https://bithunter-api.onrender.com
- Database: MongoDB Atlas (private)
- Storage: Supabase (private)

---

**Last Updated**: January 2026
**Status**: Ready for production deployment ✅

