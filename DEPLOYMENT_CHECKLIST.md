# ✅ Deployment Checklist

Print this and check off items as you complete them.

---

## 📦 Pre-Deployment

### Code Preparation
- [ ] All code committed to GitHub
- [ ] `.env` files NOT committed (in `.gitignore`)
- [ ] `requirements.txt` up to date
- [ ] `package.json` dependencies complete
- [ ] ML model trained and committed
- [ ] Local testing passed
- [ ] No console errors in browser
- [ ] No Python errors locally

### Documentation
- [ ] README.md updated
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment guide reviewed

---

## 🗄️ Database Setup (MongoDB Atlas)

### Account & Cluster
- [ ] MongoDB Atlas account created
- [ ] Free tier (M0) cluster created
- [ ] Cluster name: `sentinel-cluster`
- [ ] Region selected (closest to users)

### Security
- [ ] Database user created
- [ ] Username: `_________________`
- [ ] Password saved securely: ✅
- [ ] User has "Atlas admin" privileges
- [ ] Network access: 0.0.0.0/0 allowed

### Database
- [ ] Database created: `fraud_detection_db`
- [ ] Connection string copied
- [ ] Connection string format verified:
  ```
  mongodb+srv://user:pass@cluster.mongodb.net/
  ```
- [ ] Connection tested locally

**Connection String:**
```
_____________________________________________
```

---

## 📦 Storage Setup (Supabase)

### Project
- [ ] Supabase account created
- [ ] Project created: `sentinel-storage`
- [ ] Project password saved: ✅
- [ ] Region selected

### Storage
- [ ] Bucket created: `citizen-reports`
- [ ] Bucket is private (not public)
- [ ] Upload policy configured

### API Keys
- [ ] Project URL copied
- [ ] service_role key copied (NOT anon key)
- [ ] Keys saved securely: ✅

**Supabase URL:**
```
_____________________________________________
```

**Service Role Key:**
```
_____________________________________________
```

---

## 🖥️ Backend Deployment (Render)

### Service Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web Service created
- [ ] Service name: `sentinel-backend`

### Configuration
- [ ] Runtime: Python 3
- [ ] Root Directory: `backend`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn server:app --host 0.0.0.0 --port 10000`
- [ ] Instance Type: Free (or paid)

### Environment Variables
- [ ] `PORT` = `10000`
- [ ] `HOST` = `0.0.0.0`
- [ ] `MONGO_URL` = (from MongoDB Atlas)
- [ ] `DB_NAME` = `fraud_detection_db`
- [ ] `JWT_SECRET` = (generated 32-char random)
- [ ] `JWT_ALGORITHM` = `HS256`
- [ ] `CORS_ORIGINS` = `*` (update after Vercel)
- [ ] `SUPABASE_URL` = (from Supabase)
- [ ] `SUPABASE_SERVICE_KEY` = (from Supabase)
- [ ] `SUPABASE_BUCKET` = `citizen-reports`
- [ ] `ENVIRONMENT` = `production`

### Deployment
- [ ] Service created
- [ ] Build successful (check logs)
- [ ] Service running
- [ ] No errors in logs

### Verification
- [ ] Backend URL accessible
- [ ] `/docs` endpoint works
- [ ] Swagger UI loads

**Backend URL:**
```
_____________________________________________
```

---

## 🌐 Frontend Deployment (Vercel)

### Project Setup
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project created
- [ ] Project name: `sentinel-frontend`

### Configuration
- [ ] Framework: Create React App
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build` (auto)
- [ ] Output Directory: `build` (auto)

### Environment Variables
- [ ] `REACT_APP_BACKEND_URL` = (from Render)
- [ ] `REACT_APP_NAME` = `Sentinel Portal`
- [ ] `REACT_APP_ENV` = `production`

### Deployment
- [ ] Project deployed
- [ ] Build successful
- [ ] No build errors

### Verification
- [ ] Frontend URL accessible
- [ ] Landing page loads
- [ ] No console errors
- [ ] Assets loading correctly

**Frontend URL:**
```
_____________________________________________
```

---

## 🔗 Integration

### CORS Configuration
- [ ] Vercel URL copied
- [ ] Render environment updated
- [ ] `CORS_ORIGINS` includes:
  - `https://your-app.vercel.app`
  - `https://your-app-*.vercel.app`
- [ ] Backend redeployed
- [ ] CORS working (no browser errors)

### API Connection
- [ ] Frontend can reach backend
- [ ] No CORS errors in console
- [ ] API calls successful
- [ ] Network tab shows 200 responses

---

## 💾 Database Seeding

### Seed Data
- [ ] Seed script ready: `seed_delhi_data.py`
- [ ] Method chosen:
  - [ ] Render Shell
  - [ ] Local with production DB
  - [ ] API endpoint
- [ ] Seed script executed
- [ ] No errors during seeding

### Verification
- [ ] Collections created:
  - [ ] `users`
  - [ ] `contracts`
  - [ ] `vendors`
  - [ ] `citizen_reports`
  - [ ] `welfare_scans`
  - [ ] `pds_ledger`
  - [ ] `lifestyle_scans`
- [ ] Data visible in MongoDB Atlas
- [ ] Dashboard shows statistics

---

## 👤 User Setup

### Admin Account
- [ ] Admin user created
- [ ] Email: `_________________`
- [ ] Password saved securely: ✅
- [ ] Login successful
- [ ] Dashboard accessible

### Test Accounts (Optional)
- [ ] Test user 1 created
- [ ] Test user 2 created
- [ ] Different roles tested

---

## 🧪 Testing

### Authentication
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Token persists on refresh
- [ ] Protected routes work
- [ ] Unauthorized access blocked

### Core Features
- [ ] Landing page loads
- [ ] Citizen portal accessible
- [ ] Official login works
- [ ] Dashboard displays data
- [ ] Contract list loads
- [ ] Contract details load
- [ ] Vendor list loads
- [ ] Vendor details load

### Integrated Modules
- [ ] Welfare module accessible
- [ ] Welfare analysis works
- [ ] Individual scan works
- [ ] Ledger module accessible
- [ ] Blockchain displays
- [ ] Transaction creation works
- [ ] Integrity verification works
- [ ] Lifestyle module accessible
- [ ] 360° scan works
- [ ] Scan history loads

### File Upload
- [ ] Citizen report form works
- [ ] File upload successful
- [ ] File appears in Supabase
- [ ] File URL accessible

### Performance
- [ ] Page load < 3 seconds
- [ ] API response < 2 seconds
- [ ] No memory leaks
- [ ] No console errors

---

## 🔒 Security

### Environment Variables
- [ ] No secrets in code
- [ ] No `.env` files committed
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] Strong database password
- [ ] Strong Supabase password

### Access Control
- [ ] MongoDB IP whitelist configured
- [ ] Supabase bucket private
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] JWT expiration set

### Best Practices
- [ ] Input validation working
- [ ] SQL injection prevented (using ORM)
- [ ] XSS prevented (React auto-escapes)
- [ ] Rate limiting considered
- [ ] Error messages don't leak info

---

## 📊 Monitoring

### Uptime Monitoring
- [ ] UptimeRobot account created
- [ ] Frontend monitored
- [ ] Backend monitored
- [ ] Email alerts configured
- [ ] Check interval: 5 minutes

### Error Tracking (Optional)
- [ ] Sentry account created
- [ ] Backend integrated
- [ ] Frontend integrated
- [ ] Error alerts configured

### Logs
- [ ] Render logs accessible
- [ ] Vercel logs accessible
- [ ] MongoDB logs accessible
- [ ] Log retention understood

---

## 🚀 Post-Deployment

### Documentation
- [ ] Deployment documented
- [ ] URLs documented
- [ ] Credentials saved securely
- [ ] Team notified

### Backup
- [ ] Database backup strategy defined
- [ ] MongoDB auto-backup enabled
- [ ] Code backed up (GitHub)
- [ ] Environment variables backed up

### Custom Domain (Optional)
- [ ] Domain purchased
- [ ] DNS configured for frontend
- [ ] DNS configured for backend
- [ ] SSL certificates active
- [ ] CORS updated for new domain

### Performance
- [ ] Lighthouse score checked
- [ ] Load time acceptable
- [ ] Mobile responsive
- [ ] Accessibility checked

---

## 📝 Final Verification

### URLs Working
- [ ] Frontend: `https://your-app.vercel.app`
- [ ] Backend: `https://sentinel-backend.onrender.com`
- [ ] API Docs: `https://sentinel-backend.onrender.com/docs`

### All Features Working
- [ ] User registration
- [ ] User login
- [ ] Dashboard
- [ ] Contracts
- [ ] Vendors
- [ ] Welfare fraud detection
- [ ] PDS ledger
- [ ] Lifestyle mismatch
- [ ] Citizen reports
- [ ] File uploads

### No Errors
- [ ] No console errors
- [ ] No API errors
- [ ] No database errors
- [ ] No CORS errors
- [ ] No authentication errors

---

## 🎉 Launch

### Communication
- [ ] Team notified
- [ ] Stakeholders informed
- [ ] Documentation shared
- [ ] Demo scheduled

### Monitoring
- [ ] First 24 hours monitored
- [ ] Error logs checked
- [ ] Performance metrics reviewed
- [ ] User feedback collected

### Next Steps
- [ ] Feature roadmap defined
- [ ] Maintenance schedule set
- [ ] Scaling plan documented
- [ ] Support process defined

---

## 📞 Emergency Contacts

**MongoDB Atlas:**
- URL: https://cloud.mongodb.com
- Support: https://www.mongodb.com/support

**Supabase:**
- URL: https://app.supabase.com
- Support: https://supabase.com/support

**Render:**
- URL: https://dashboard.render.com
- Support: https://render.com/support

**Vercel:**
- URL: https://vercel.com/dashboard
- Support: https://vercel.com/support

---

## 🔑 Credentials Reference

**MongoDB:**
- Username: `_________________`
- Password: `_________________`
- Connection: `_________________`

**Supabase:**
- Email: `_________________`
- Password: `_________________`
- Project URL: `_________________`
- Service Key: `_________________`

**Admin User:**
- Email: `_________________`
- Password: `_________________`

**JWT Secret:**
```
_____________________________________________
```

---

## 📅 Maintenance Schedule

### Daily
- [ ] Check uptime status
- [ ] Review error logs
- [ ] Monitor performance

### Weekly
- [ ] Review all logs
- [ ] Check database size
- [ ] Test all features
- [ ] Backup database

### Monthly
- [ ] Update dependencies
- [ ] Review security
- [ ] Check for updates
- [ ] Performance audit

### Quarterly
- [ ] Rotate secrets
- [ ] Security audit
- [ ] Capacity planning
- [ ] Cost review

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Version:** _______________

**Status:** ⬜ In Progress  ⬜ Complete  ⬜ Issues

**Notes:**
```
_____________________________________________
_____________________________________________
_____________________________________________
```

---

✅ **All items checked? Congratulations! Your app is live!** 🎉
