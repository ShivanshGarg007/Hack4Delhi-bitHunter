# 🚀 Step-by-Step Deployment Guide

## Overview
This guide walks you through deploying bitHunter to production using **free services**:
- **Frontend**: Vercel
- **Backend**: Render  
- **Database**: MongoDB Atlas
- **Storage**: Supabase (already integrated)

**Total Cost**: $0/month
**Estimated Time**: 45-60 minutes

---

## PART 1: PRE-DEPLOYMENT SETUP (5 minutes)

### 1.1 Verify GitHub Repository is Up to Date

```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter
git status
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 1.2 Verify All Configuration Files Exist

```bash
# Check these files were created:
ls -la backend/Dockerfile              # Backend container config
ls -la vercel.json                     # Frontend deployment config
ls -la render.yaml                     # Backend deployment config
ls -la frontend/.env.production.example  # Frontend env template
ls -la backend/.env.production.example   # Backend env template
```

---

## PART 2: DATABASE SETUP (10 minutes)

### 2.1 Create MongoDB Atlas Account

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Sign Up"**
3. Fill in email and create account
4. Verify email
5. Complete welcome survey (can skip non-required fields)

### 2.2 Create Free Cluster

1. Click **"Create"** button
2. Select **"M0 Free"** tier
3. **Cloud Provider**: AWS or Google Cloud
4. **Region**: Choose closest to India (Mumbai is ideal)
5. **Cluster Name**: `bithunter-free`
6. Click **"Create Cluster"** (takes 1-3 minutes)

### 2.3 Create Database User

1. In Atlas dashboard → **"Security"** → **"Database Access"**
2. Click **"+ Add New Database User"**
3. **Username**: `bithunter_user`
4. **Password**: Create strong password (copy it!)
5. **User Privilege**: Select "Built-in Role" → **"Atlas admin"**
6. Click **"Add User"**

### 2.4 Set Network Access

1. Go to **"Security"** → **"Network Access"**
2. Click **"+ Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
4. Click **"Confirm"**

⚠️ **Note**: In production, you'd restrict IPs. For free tier + Render, allow anywhere is fine.

### 2.5 Get Connection String

1. Go to **"Clusters"** → Click **"Connect"** button
2. Select **"Connect your application"**
3. **Driver**: Python
4. **Version**: 3.6 or later
5. Copy the connection string
6. **Replace values**:
   - `<username>` → `bithunter_user`
   - `<password>` → Your password from step 2.3
   - `<dbname>` → `bitHunter`

**Example**:
```
mongodb+srv://bithunter_user:MyPassword123@bithunter-free.abc123.mongodb.net/bitHunter?retryWrites=true&w=majority
```

**Keep this safe!** You'll need it in the next steps.

---

## PART 3: FRONTEND DEPLOYMENT TO VERCEL (15 minutes)

### 3.1 Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Select **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. Complete setup

### 3.2 Create Vercel Project

1. Click **"New Project"** button
2. Find your `ShivanshGarg007/Hack4Delhi-bitHunter` repository
3. Click **"Import"**
4. **Configure Project**:
   - **Framework**: Auto-detect should show "Create React App" ✅
   - **Root Directory**: Select `frontend/` from dropdown
   - **Build Command**: `yarn build` (should auto-fill)
   - **Output Directory**: `build` (should auto-fill)

### 3.3 Add Environment Variables (IMPORTANT!)

1. Scroll down to **"Environment Variables"** section
2. Add these variables:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://bithunter-api.onrender.com` (we'll get this URL later)
   - **Scope**: `Production`, `Preview`, `Development`
3. Click **"Add"**

### 3.4 Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. You'll see:
   ```
   ✅ Deployment complete!
   Your app is live at: https://your-project-name.vercel.app
   ```

**Save your Vercel URL!** You'll need it for CORS setup.

### 3.5 Update Environment Variable (After Render is deployed)

1. Go to Vercel Dashboard
2. Click your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Edit `REACT_APP_API_URL`
5. Change value from placeholder to actual Render URL (from Part 4)
6. Click **"Save"**
7. Go to **"Deployments"** → Click on latest → **"Redeploy"**

---

## PART 4: BACKEND DEPLOYMENT TO RENDER (20 minutes)

### 4.1 Create Render Account

1. Go to **https://render.com**
2. Click **"Sign Up"**
3. Select **"Continue with GitHub"**
4. Authorize Render to access your repositories
5. Complete signup

### 4.2 Create Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. **Find and select repository**: `Hack4Delhi-bitHunter`
4. Click **"Connect"**

### 4.3 Configure Web Service

Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `bithunter-api` |
| **Environment** | `Python 3` |
| **Region** | `Singapore` or `Mumbai` (closest to India) |
| **Branch** | `bitHunter` |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port 10000` |
| **Instance Type** | `Free` |

### 4.4 Add Environment Variables

Click **"Advanced"** → **"Environment"**

Add these variables one by one:

```
MONGO_URL = mongodb+srv://bithunter_user:PASSWORD@cluster...
DB_NAME = bitHunter
JWT_SECRET = change-me-to-random-string-in-production
JWT_ALGORITHM = HS256
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_KEY = your-service-key
SUPABASE_BUCKET = citizen-reports
FRONTEND_URL = https://your-app.vercel.app
PYTHONUNBUFFERED = 1
```

### 4.5 Find Your Supabase Keys

1. Go to **https://app.supabase.com**
2. Click your project
3. Go to **"Settings"** → **"API"**
4. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **Service Role Secret** → Use as `SUPABASE_SERVICE_KEY`

### 4.6 Deploy

1. Click **"Create Web Service"**
2. Render auto-deploys from your GitHub repo
3. Watch logs:
   ```
   Building Docker image...
   Installing dependencies...
   Starting application...
   Server running on 0.0.0.0:10000
   ```
4. When you see ✅ **"Live"** status, deployment is done!
5. **Save your Render URL**: `https://bithunter-api.onrender.com`

### 4.7 Update Backend CORS

1. Go to `backend/server.py`
2. Find the CORS middleware section (around line 50-60)
3. Update `allow_origins` to include your Vercel URL:

```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-app.vercel.app",  # Add your Vercel URL here
    "https://*.vercel.app"
],
```

4. Commit and push:
```bash
git add backend/server.py
git commit -m "Update CORS for Vercel deployment"
git push origin main
```

5. Render auto-redeploys!

---

## PART 5: VERIFICATION (10 minutes)

### 5.1 Test Backend API

Open Render logs and verify:
```
✓ Application started
✓ Server running on 0.0.0.0:10000
```

Then test health endpoint:
```bash
curl https://bithunter-api.onrender.com/health
# Should return: {"status":"ok"}
```

### 5.2 Test Frontend

1. Go to `https://your-app.vercel.app`
2. You should see the landing page
3. Click "Official Login"
4. Try logging in with demo credentials:
   - **Email**: `official@sentinel.gov.in`
   - **Password**: `demo123`

### 5.3 Test Database Connection

1. After login, go to **"Contracts"** page
2. You should see a list of contracts
3. If empty, run seed script locally first:
   ```bash
   cd backend
   python3 seed_data.py
   ```

### 5.4 Check Logs

**Vercel Logs**:
- Dashboard → Project → Deployments → Click latest → Function logs

**Render Logs**:
- Dashboard → Service → Logs tab

---

## PART 6: TROUBLESHOOTING

### Issue: "Cannot connect to backend"
**Solution**:
1. Verify `REACT_APP_API_URL` is set in Vercel environment variables
2. Verify backend environment variables are correct in Render
3. Check CORS settings in `backend/server.py`

### Issue: "MongoDB connection failed"
**Solution**:
1. Verify connection string in Render (`MONGO_URL`)
2. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
3. Verify username and password in connection string

### Issue: "Supabase authentication failed"
**Solution**:
1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in Render
2. Get keys from Supabase dashboard → Settings → API

### Issue: "502 Bad Gateway" from Render
**Solution**:
1. Render free tier spins down after 15 minutes of inactivity
2. Wait 30 seconds for cold start
3. Check Render logs for errors
4. Verify all environment variables are set

### Issue: "Build failed on Vercel"
**Solution**:
1. Go to Vercel Deployments → Failed build
2. Check "Build Logs"
3. Common issues:
   - Missing dependencies: `yarn install`
   - Wrong root directory: Should be `frontend/`
   - Environment variables: Check they're set correctly

---

## PART 7: POST-DEPLOYMENT

### 7.1 Seed Database

Once everything is connected, seed your database:

```bash
cd backend
# Create admin user and demo data
python3 seed_data.py
```

### 7.2 Set Up Auto-Restart (Render)

1. Go to Render Dashboard → Service → Settings
2. Enable "Auto-Restart on Deploy"
3. This ensures fresh restarts on each push

### 7.3 Monitor Logs

**Render**: 
- Set up notifications for errors
- Check logs regularly

**Vercel**:
- Monitor build times
- Check function logs for errors

### 7.4 Plan for Scaling

**Current free tier covers**:
- ✅ Up to 100 daily active users
- ✅ 512MB MongoDB storage
- ✅ 1GB Supabase storage
- ✅ 750 hrs/month Render (with spin-down)

**If you exceed limits, consider**:
- Render: Upgrade to paid plan ($7/month)
- MongoDB: Upgrade to $57/month (or use cheaper alternative)
- Supabase: Upgrade to $25/month

---

## PART 8: FINAL CHECKLIST

### Pre-Deployment
- [ ] Repository pushed to GitHub
- [ ] All configuration files created
- [ ] .env variables collected

### Vercel
- [ ] Account created
- [ ] Repository connected
- [ ] Root directory set to `frontend/`
- [ ] Environment variables added
- [ ] Build successful
- [ ] Site live and accessible

### Render
- [ ] Account created
- [ ] Repository connected
- [ ] Root directory set to `backend/`
- [ ] All environment variables added
- [ ] Build successful
- [ ] Service shows "Live" status

### MongoDB Atlas
- [ ] Account created
- [ ] Cluster created (M0 Free)
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained

### Supabase
- [ ] API keys obtained
- [ ] Service key stored safely

### Integration
- [ ] Frontend connects to backend API
- [ ] Backend connects to MongoDB
- [ ] Backend connects to Supabase
- [ ] CORS properly configured
- [ ] Login works
- [ ] Can view contracts/vendors

---

## 🎉 SUCCESS!

Your application is now live and accessible globally!

**Endpoints**:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://bithunter-api.onrender.com
- **Database**: MongoDB Atlas (cloud-hosted)
- **Storage**: Supabase (cloud-hosted)

**Total Monthly Cost**: $0 ✅

**Performance**:
- Vercel: ~50-100ms latency (CDN)
- Render: ~200-400ms latency (depends on location)
- MongoDB: ~100-200ms (cloud database)

---

## 📞 SUPPORT

If you encounter issues:
1. Check service logs (Vercel, Render, MongoDB Atlas)
2. Verify environment variables are set correctly
3. Test API endpoints manually with curl
4. Check CORS settings
5. Review GitHub Actions for build errors

