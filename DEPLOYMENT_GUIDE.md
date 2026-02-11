# 🚀 Deployment Guide - Sentinel: Public Integrity Platform

Complete step-by-step guide for deploying the Sentinel platform with:
- **Frontend**: Vercel
- **Backend + ML**: Render

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Storage Setup (Supabase)](#storage-setup-supabase)
6. [Backend Deployment (Render)](#backend-deployment-render)
7. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
8. [Post-Deployment Setup](#post-deployment-setup)
9. [Testing & Verification](#testing--verification)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Sentinel** is a comprehensive fraud detection platform for government operations with three integrated modules:

### Core Features
- **Contract & Vendor Management**: Track government contracts and vendor performance
- **Citizen Reporting**: Allow citizens to report suspicious activities
- **Fraud Risk Scoring**: ML-powered anomaly detection

### Integrated Fraud Detection Modules
1. **Welfare Fraud Detection** (`/api/welfare/*`)
   - ML model trained on 1,050+ financial intelligence records
   - Cross-checks against Vahan (vehicle registry) and Discom (electricity) databases
   - Risk classification: Red/Yellow/Green

2. **PDS Ledger** (`/api/ledger/*`)
   - Blockchain-based Public Distribution System tracking
   - Tamper-proof transaction ledger
   - Integrity verification

3. **Lifestyle Mismatch Detection** (`/api/lifestyle/*`)
   - 360° profile scanning
   - AI-powered identity resolution
   - Family cluster analysis
   - Asset detection

### Tech Stack
- **Frontend**: React 18, TailwindCSS, Radix UI, React Router
- **Backend**: FastAPI (Python 3.11), Motor (async MongoDB)
- **ML/AI**: Scikit-learn, XGBoost, Pandas, DuckDB, Splink
- **Database**: MongoDB Atlas
- **Storage**: Supabase (file uploads)
- **Auth**: JWT with bcrypt

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] GitHub account (for code repository)
- [ ] Vercel account (free tier works)
- [ ] Render account (free tier works)
- [ ] MongoDB Atlas account (free tier: 512MB)
- [ ] Supabase account (free tier works)
- [ ] Git installed locally
- [ ] Node.js 18+ installed (for local testing)
- [ ] Python 3.11+ installed (for local testing)

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │
│   React App     │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Render        │
│   (Backend)     │
│   FastAPI       │
│   + ML Models   │
└────┬───────┬────┘
     │       │
     │       └──────────┐
     │                  │
┌────▼────────┐  ┌──────▼──────┐
│  MongoDB    │  │  Supabase   │
│  Atlas      │  │  Storage    │
│  (Database) │  │  (Files)    │
└─────────────┘  └─────────────┘
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **FREE** tier (M0 Sandbox)
5. Choose a cloud provider and region (closest to your users)
6. Cluster Name: `sentinel-cluster` (or any name)
7. Click **"Create"**

### Step 2: Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `sentinel_admin` (or your choice)
5. Password: Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### Step 3: Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to Render's IP ranges
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go back to **"Database"** in sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Driver: **Python**, Version: **3.12 or later**
5. Copy the connection string:
   ```
   mongodb+srv://sentinel_admin:<password>@sentinel-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. **SAVE THIS** - you'll need it for environment variables

### Step 5: Create Database

1. Click **"Browse Collections"**
2. Click **"Add My Own Data"**
3. Database name: `fraud_detection_db`
4. Collection name: `users`
5. Click **"Create"**

---

## 📦 Storage Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Organization: Select or create one
5. Project name: `sentinel-storage`
6. Database Password: Generate and **SAVE IT**
7. Region: Choose closest to your users
8. Click **"Create new project"** (takes 2-3 minutes)

### Step 2: Create Storage Bucket

1. In left sidebar, click **"Storage"**
2. Click **"Create a new bucket"**
3. Name: `citizen-reports`
4. Public bucket: **OFF** (keep private)
5. Click **"Create bucket"**

### Step 3: Configure Bucket Policies

1. Click on the `citizen-reports` bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Template: **"Allow public read access"** (if you want reports viewable)
   - Or keep private and use signed URLs
5. Click **"Review"** then **"Save policy"**

### Step 4: Get API Credentials

1. Click **"Settings"** (gear icon) in sidebar
2. Click **"API"**
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key (for frontend - optional)
   - **service_role** key (for backend - **KEEP SECRET**)
4. **SAVE THESE** - you'll need them for environment variables

---

## 🖥️ Backend Deployment (Render)

### Step 1: Prepare Repository

1. Push your code to GitHub if not already done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `YOUR_USERNAME/YOUR_REPO`

### Step 3: Configure Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `sentinel-backend` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**:
  ```bash
  pip install --upgrade pip && pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  uvicorn server:app --host 0.0.0.0 --port 10000
  ```

**Instance Type:**
- Select **Free** (or paid for better performance)
  - ⚠️ Free tier sleeps after 15 min of inactivity

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `10000` | Render default |
| `HOST` | `0.0.0.0` | Listen on all interfaces |
| `MONGO_URL` | `mongodb+srv://...` | From MongoDB Atlas Step 4 |
| `DB_NAME` | `fraud_detection_db` | Your database name |
| `JWT_SECRET` | Generate random string | Use: `openssl rand -hex 32` |
| `JWT_ALGORITHM` | `HS256` | Standard |
| `CORS_ORIGINS` | `https://your-app.vercel.app` | Update after Vercel deployment |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | From Supabase Step 4 |
| `SUPABASE_SERVICE_KEY` | `eyJhbGc...` | From Supabase Step 4 (service_role) |
| `SUPABASE_BUCKET` | `citizen-reports` | Your bucket name |
| `ENVIRONMENT` | `production` | Environment flag |

**To generate JWT_SECRET** (run locally):
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Monitor logs for any errors
4. Once deployed, you'll get a URL: `https://sentinel-backend.onrender.com`
5. **SAVE THIS URL** - you'll need it for frontend

### Step 6: Verify Backend Deployment

1. Open your backend URL in browser: `https://sentinel-backend.onrender.com`
2. You should see: `{"detail":"Not Found"}` (this is normal - root path not defined)
3. Try: `https://sentinel-backend.onrender.com/docs`
4. You should see the FastAPI Swagger documentation
5. ✅ Backend is live!

### Step 7: Seed Database with Initial Data

**Option A: Using Render Shell**
1. In Render dashboard, go to your service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd backend
   python seed_delhi_data.py
   ```

**Option B: Using API endpoint (create one)**
1. Add this to your `server.py`:
   ```python
   @app.post("/api/admin/seed-data")
   async def seed_database():
       from seed_delhi_data import main as seed_main
       await seed_main()
       return {"message": "Database seeded successfully"}
   ```
2. Call it once via Swagger UI or curl

**Option C: Run locally and connect to production DB**
1. Update your local `.env` with production `MONGO_URL`
2. Run: `python backend/seed_delhi_data.py`
3. Restore local `.env` after seeding

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Ensure your frontend code is in the `frontend` directory
2. Make sure `package.json` has correct build scripts:
   ```json
   {
     "scripts": {
       "start": "craco start",
       "build": "craco build",
       "test": "craco test"
     }
   }
   ```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: sentinel-frontend
# - Directory: ./
# - Override settings? No

# For production deployment
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_BACKEND_URL` | `https://sentinel-backend.onrender.com` | Production |
| `REACT_APP_NAME` | `Sentinel Portal` | All |
| `REACT_APP_ENV` | `production` | Production |

4. Click **"Save"**

### Step 4: Redeploy with Environment Variables

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment → **"Redeploy"**
3. Check **"Use existing Build Cache"**: OFF
4. Click **"Redeploy"**

### Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Update `CORS_ORIGINS` variable:
   ```
   https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://your-app-*.vercel.app
   ```
   Replace `your-app` with your actual Vercel project name
5. Click **"Save Changes"**
6. Service will automatically redeploy

### Step 6: Verify Frontend Deployment

1. Open your Vercel URL: `https://your-app.vercel.app`
2. You should see the landing page
3. Try navigating to different pages
4. ✅ Frontend is live!

---

## 🔧 Post-Deployment Setup

### 1. Create Admin User

**Option A: Using API directly**

```bash
curl -X POST https://sentinel-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sentinel.gov.in",
    "password": "YourSecurePassword123!",
    "full_name": "System Administrator"
  }'
```

**Option B: Using frontend**
1. Go to `https://your-app.vercel.app/official/login`
2. Click "Register" (if you have a register link)
3. Or use the API endpoint above

### 2. Test Authentication Flow

1. Go to: `https://your-app.vercel.app/official/login`
2. Login with your admin credentials
3. You should be redirected to the dashboard
4. ✅ Authentication working!

### 3. Verify All Modules

Test each integrated module:

**Welfare Fraud Detection:**
- Navigate to: `/official/welfare`
- Click "Analyze All Applicants"
- Should see risk distribution (Red/Yellow/Green)

**PDS Ledger:**
- Navigate to: `/official/ledger`
- Should see blockchain blocks
- Try "Verify Integrity" button

**Lifestyle Mismatch:**
- Navigate to: `/official/lifestyle`
- Try scanning an applicant
- Should see 360° profile results

### 4. Configure Custom Domain (Optional)

**For Vercel:**
1. Go to project **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `CORS_ORIGINS` in Render to include new domain

**For Render:**
1. Go to service **"Settings"** → **"Custom Domain"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `REACT_APP_BACKEND_URL` in Vercel

---

## 🧪 Testing & Verification

### Health Checks

**Backend Health:**
```bash
curl https://sentinel-backend.onrender.com/docs
# Should return Swagger UI HTML
```

**Database Connection:**
```bash
curl https://sentinel-backend.onrender.com/api/official/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Should return dashboard data
```

### Functional Testing Checklist

- [ ] Landing page loads
- [ ] Citizen portal accessible
- [ ] Official login works
- [ ] Dashboard displays statistics
- [ ] Contract list loads
- [ ] Vendor list loads
- [ ] Welfare module works
- [ ] Ledger module works
- [ ] Lifestyle module works
- [ ] Citizen report submission works
- [ ] File upload works (Supabase)
- [ ] Logout works

### Performance Testing

**Backend Response Time:**
```bash
curl -w "@-" -o /dev/null -s https://sentinel-backend.onrender.com/api/official/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
         time_total:  %{time_total}\n
EOF
```

**Expected Response Times:**
- First request (cold start on free tier): 10-30 seconds
- Subsequent requests: < 2 seconds
- Frontend load: < 3 seconds

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend: "Module not found" errors

**Problem:** Missing dependencies in `requirements.txt`

**Solution:**
```bash
# Locally, regenerate requirements
pip freeze > backend/requirements.txt

# Commit and push
git add backend/requirements.txt
git commit -m "Update requirements"
git push

# Redeploy on Render
```

#### 2. Frontend: "Network Error" or CORS issues

**Problem:** Backend CORS not configured correctly

**Solution:**
1. Check `CORS_ORIGINS` in Render includes your Vercel domain
2. Format: `https://app.vercel.app,https://app-*.vercel.app`
3. No trailing slashes
4. Redeploy backend after changes

#### 3. Database: "Authentication failed"

**Problem:** MongoDB connection string incorrect

**Solution:**
1. Verify `MONGO_URL` in Render environment variables
2. Check password doesn't contain special characters (URL encode if needed)
3. Verify IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
4. Test connection locally with same credentials

#### 4. Supabase: "File upload failed"

**Problem:** Incorrect Supabase credentials or bucket permissions

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in Render
2. Check bucket name matches `SUPABASE_BUCKET`
3. Verify bucket policies allow uploads
4. Check service_role key (not anon key) is used

#### 5. Render: "Application failed to respond"

**Problem:** Port configuration or startup command incorrect

**Solution:**
1. Verify `PORT=10000` in environment variables
2. Check start command: `uvicorn server:app --host 0.0.0.0 --port 10000`
3. Check logs for Python errors
4. Verify `backend` is set as root directory

#### 6. Vercel: "Build failed"

**Problem:** Build command or dependencies issue

**Solution:**
1. Check `frontend` is set as root directory
2. Verify `package.json` has `build` script
3. Check for missing dependencies in `package.json`
4. Review build logs for specific errors
5. Try building locally: `cd frontend && npm run build`

#### 7. JWT: "Token expired" or "Invalid token"

**Problem:** JWT secret mismatch or token expiration

**Solution:**
1. Verify `JWT_SECRET` is same across all environments
2. Check `JWT_ALGORITHM=HS256`
3. Clear browser localStorage and login again
4. Token expires after 7 days (configurable in `core/auth.py`)

#### 8. ML Model: "Model not found"

**Problem:** ML model file not included in deployment

**Solution:**
1. Ensure `backend/services/models/welfare_fraud_model.pkl` exists
2. If not, train model locally:
   ```bash
   cd backend
   python services/welfare_ml_model.py
   ```
3. Commit and push model file
4. Or train on first request (auto-trains if missing)

### Logs & Debugging

**Render Logs:**
1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. Filter by severity: Error, Warning, Info
4. Download logs if needed

**Vercel Logs:**
1. Go to your project in Vercel dashboard
2. Click **"Deployments"**
3. Click on a deployment
4. View **"Build Logs"** or **"Function Logs"**

**MongoDB Logs:**
1. Go to MongoDB Atlas
2. Click **"Monitoring"** tab
3. View slow queries, connection stats

**Browser Console:**
1. Open DevTools (F12)
2. Check **Console** tab for errors
3. Check **Network** tab for failed requests
4. Look for CORS errors or 401/403 responses

### Performance Optimization

**Backend (Render):**
- Upgrade to paid tier to avoid cold starts
- Enable persistent disk for model caching
- Use connection pooling for MongoDB
- Add Redis for caching (optional)

**Frontend (Vercel):**
- Enable Edge caching
- Optimize images (use Next.js Image if migrating)
- Code splitting (React.lazy)
- Enable compression

**Database (MongoDB):**
- Create indexes on frequently queried fields:
  ```javascript
  db.contracts.createIndex({ "fraud_risk_score": -1 })
  db.contracts.createIndex({ "status": 1 })
  db.welfare_scans.createIndex({ "risk_status": 1 })
  ```
- Upgrade to M2/M5 tier for better performance

---

## 📊 Monitoring & Maintenance

### Uptime Monitoring

Use free services like:
- [UptimeRobot](https://uptimerobot.com/) - Monitor both frontend and backend
- [Pingdom](https://www.pingdom.com/) - Free tier available
- [StatusCake](https://www.statuscake.com/) - Free monitoring

**Setup:**
1. Add your Vercel URL
2. Add your Render URL + `/docs` endpoint
3. Set check interval: 5 minutes
4. Configure email alerts

### Error Tracking

**Backend:**
- Use [Sentry](https://sentry.io/) for error tracking
- Add to `requirements.txt`: `sentry-sdk[fastapi]`
- Initialize in `server.py`:
  ```python
  import sentry_sdk
  sentry_sdk.init(dsn="YOUR_DSN", traces_sample_rate=1.0)
  ```

**Frontend:**
- Use [Sentry for React](https://docs.sentry.io/platforms/javascript/guides/react/)
- Add to `package.json`: `@sentry/react`
- Initialize in `index.js`

### Backup Strategy

**Database Backups:**
1. MongoDB Atlas auto-backups (free tier: daily)
2. Manual export:
   ```bash
   mongodump --uri="mongodb+srv://..." --out=./backup
   ```

**Code Backups:**
- GitHub repository (already done)
- Tag releases: `git tag v1.0.0 && git push --tags`

### Update Procedure

1. **Test locally** with production environment variables
2. **Commit changes** to GitHub
3. **Deploy backend** (Render auto-deploys on push)
4. **Deploy frontend** (Vercel auto-deploys on push)
5. **Verify** all modules working
6. **Rollback** if issues (use Render/Vercel deployment history)

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use strong, random `JWT_SECRET` (32+ characters)
- ✅ Rotate secrets periodically (every 90 days)
- ✅ Use different secrets for dev/staging/prod

### Database Security
- ✅ Use strong MongoDB password
- ✅ Restrict IP access (not 0.0.0.0/0 in production)
- ✅ Enable MongoDB encryption at rest
- ✅ Regular backups

### API Security
- ✅ Rate limiting (add middleware)
- ✅ Input validation (Pydantic models)
- ✅ SQL injection prevention (using Motor ORM)
- ✅ XSS prevention (React auto-escapes)

### HTTPS
- ✅ Vercel provides free SSL
- ✅ Render provides free SSL
- ✅ Force HTTPS redirects

---

## 📞 Support & Resources

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- [FastAPI Discord](https://discord.gg/fastapi)
- [React Discord](https://discord.gg/react)
- [MongoDB Community](https://www.mongodb.com/community/forums/)

### Useful Commands

**Check backend health:**
```bash
curl https://sentinel-backend.onrender.com/docs
```

**Test authentication:**
```bash
curl -X POST https://sentinel-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sentinel.gov.in","password":"your_password"}'
```

**View MongoDB collections:**
```bash
mongosh "mongodb+srv://..." --eval "db.getCollectionNames()"
```

**Clear browser cache:**
- Chrome: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Safari: Cmd+Option+E

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Supabase project created
- [ ] Environment variables documented
- [ ] Local testing completed

### Backend Deployment
- [ ] Render service created
- [ ] Environment variables configured
- [ ] Build successful
- [ ] `/docs` endpoint accessible
- [ ] Database connection verified
- [ ] Initial data seeded

### Frontend Deployment
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Landing page loads
- [ ] API calls working

### Post-Deployment
- [ ] Admin user created
- [ ] All modules tested
- [ ] CORS configured correctly
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## 🎉 Congratulations!

Your Sentinel platform is now live! 

**Access your application:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://sentinel-backend.onrender.com`
- API Docs: `https://sentinel-backend.onrender.com/docs`

**Next Steps:**
1. Share the URL with your team
2. Set up monitoring and alerts
3. Configure custom domains
4. Plan for scaling (upgrade tiers as needed)
5. Implement additional features

---

## 📝 Quick Reference

### URLs
```
Frontend:     https://your-app.vercel.app
Backend:      https://sentinel-backend.onrender.com
API Docs:     https://sentinel-backend.onrender.com/docs
MongoDB:      https://cloud.mongodb.com
Supabase:     https://app.supabase.com
Render:       https://dashboard.render.com
Vercel:       https://vercel.com/dashboard
```

### Default Credentials
```
Email:    admin@sentinel.gov.in
Password: (set during registration)
```

### Key Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
GET    /api/auth/me                - Get current user
GET    /api/official/dashboard     - Dashboard stats
GET    /api/welfare/analyze        - Analyze welfare applicants
POST   /api/welfare/scan           - Scan individual applicant
GET    /api/ledger/blocks          - Get blockchain ledger
POST   /api/ledger/transaction     - Add transaction
POST   /api/lifestyle/scan         - 360° profile scan
```

---

**Made with ❤️ for Hack4Delhi**

*Last Updated: 2026*
