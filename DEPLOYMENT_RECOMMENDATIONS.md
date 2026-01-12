# 🚀 Deployment Recommendations - bitHunter

## Tech Stack Analysis

### Frontend Stack
- **Framework**: React (Create React App with Craco)
- **Build Tool**: Craco (wraps Create React App)
- **CSS**: Tailwind CSS
- **Components**: Radix UI, Lucide Icons
- **HTTP Client**: Axios
- **State Management**: Context API
- **Build Output**: Static HTML/CSS/JS files in `/frontend/build` directory

### Backend Stack
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (with Motor async driver)
- **Authentication**: JWT tokens
- **Storage**: Supabase
- **Additional**: Pandas, Scikit-learn, DuckDB (for ML/analytics)
- **Server**: Uvicorn ASGI

---

## 🎯 RECOMMENDED DEPLOYMENT STRATEGY

### ✅ FRONTEND DEPLOYMENT (Static React App)

**Best Free Option: Vercel**
- **Cost**: Free tier (unlimited deployments, 100GB bandwidth/month)
- **Build Time**: Unlimited
- **Deployment Time**: ~1 minute
- **Performance**: CDN-powered, auto-scaling
- **Features**: 
  - Automatic deployments on Git push
  - Preview deployments for pull requests
  - Environment variables management
  - CORS headers support
  - Serverless functions (optional)

**Why Vercel?**
- Optimized for React applications
- One-click deployment from GitHub
- Automatic HTTPS
- Free SSL certificate
- Perfect for hackathon projects

**Alternative: Netlify**
- **Cost**: Free tier (100GB bandwidth/month)
- **Build Time**: 300 free minutes/month
- **Deployment Time**: ~2 minutes
- **Features**:
  - Git integration
  - Environment variables
  - Redirect rules
  - Forms handling
  - Edge functions

**Alternative: GitHub Pages**
- **Cost**: Completely free
- **Build Time**: Unlimited
- **Limitations**: Static only, limited configurations
- **Good for**: Documentation, portfolio sites

---

### ✅ BACKEND DEPLOYMENT (FastAPI + MongoDB)

**Best Free Option: Render (Formerly Render.com)**
- **Cost**: Free tier with 750 hours/month (covers ~2 instances)
- **Auto-scaling**: Included
- **Database**: Can run MongoDB on free tier
- **Build Time**: Unlimited
- **Features**:
  - Docker support (recommended)
  - Environment variables
  - Auto-deployments from Git
  - Automatic HTTPS
  - Health checks
  - 30-day inactivity spin-down

**Alternative: Railway.app**
- **Cost**: $5 free credits/month (usually enough for low-traffic projects)
- **Database**: Free MongoDB support
- **Build Time**: Unlimited
- **Features**:
  - Simple deployment
  - Auto-scaling
  - Environment variables
  - GitHub integration
  - Logs and monitoring

**Alternative: Koyeb**
- **Cost**: Free tier (2GB RAM, 1 vCPU)
- **Database**: Free managed PostgreSQL (not MongoDB)
- **Features**:
  - Docker support
  - Global load balancing
  - Auto-scaling
  - GitHub integration

**Alternative: Fly.io**
- **Cost**: Free tier (3 shared-cpu-1x 256MB VMs)
- **Database**: Free PostgreSQL
- **Features**:
  - Docker support
  - Global deployment
  - Easy scaling
  - Health checks

---

### ✅ DATABASE DEPLOYMENT (MongoDB)

**Best Free Option: MongoDB Atlas**
- **Cost**: Free tier with 512MB storage
- **Features**:
  - Cloud-hosted MongoDB
  - Automatic backups
  - Monitoring and alerts
  - Easy driver integration
  - HTTPS connection string
- **Limitations**: 
  - 512MB storage (suitable for dev/testing)
  - Shared cluster
  - No vertical scaling

**Alternative: Use backend provider's database**
- Render: Supports PostgreSQL (free tier available)
- Railway: Includes free MongoDB
- Koyeb: Includes free PostgreSQL

---

### ✅ FILE STORAGE (Supabase)

**Best Free Option: Supabase**
- **Cost**: Free tier with 1GB storage
- **Features**:
  - Already integrated in your code
  - PostgreSQL database
  - File storage (perfect for citizen reports)
  - Real-time updates
  - Row Level Security (RLS)
- **Status**: Your code already uses Supabase!

---

## 📋 RECOMMENDED DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    RECOMMENDED SETUP                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  FRONTEND: Vercel                                        │
│  ├─ Repository: GitHub                                  │
│  ├─ Auto-deploy on push                                 │
│  ├─ Build: yarn build                                   │
│  ├─ Output: /frontend/build → CDN                       │
│  └─ Domain: your-app.vercel.app                         │
│                                                           │
│  BACKEND: Render                                         │
│  ├─ Repository: GitHub                                  │
│  ├─ Build: Docker (Dockerfile required)                 │
│  ├─ Start: uvicorn server:app --host 0.0.0.0           │
│  ├─ Port: 10000 (Render default)                        │
│  └─ Domain: your-api.onrender.com                       │
│                                                           │
│  DATABASE: MongoDB Atlas                                │
│  ├─ Free tier 512MB                                     │
│  ├─ Connection string in MONGO_URL env var              │
│  └─ Connected via Motor (async driver)                  │
│                                                           │
│  STORAGE: Supabase                                       │
│  ├─ Already integrated                                  │
│  ├─ Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY        │
│  └─ Bucket: citizen-reports                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 SETUP INSTRUCTIONS

### Step 1: Prepare Frontend for Vercel

**1.1 Create `.env.production` file**
```bash
cd frontend
echo "REACT_APP_API_URL=https://your-api.onrender.com" > .env.production
```

**1.2 Vercel Configuration (optional)**
```bash
# Create vercel.json in root directory
cat > vercel.json << 'EOF'
{
  "buildCommand": "cd frontend && yarn build",
  "outputDirectory": "frontend/build",
  "env": {
    "REACT_APP_API_URL": "https://your-api.onrender.com"
  }
}
EOF
```

**1.3 Update Frontend API Calls**
In `frontend/src/contexts/AuthContext.js` or axios config:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

### Step 2: Prepare Backend for Render

**2.1 Create `Dockerfile`** in backend directory:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 10000

# Run Uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "10000"]
```

**2.2 Create `render.yaml`** in root directory:
```yaml
services:
  - type: web
    name: bithunter-api
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn server:app --host 0.0.0.0 --port 10000"
    envVars:
      - key: MONGO_URL
        scope: all
      - key: DB_NAME
        scope: all
      - key: JWT_SECRET
        scope: all
      - key: JWT_ALGORITHM
        scope: all
      - key: SUPABASE_URL
        scope: all
      - key: SUPABASE_SERVICE_KEY
        scope: all
      - key: SUPABASE_BUCKET
        scope: all
```

**2.3 Update CORS in `backend/server.py`**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-app.vercel.app",  # Add Vercel URL
        "https://*.vercel.app"           # Allow all preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Step 3: MongoDB Atlas Setup

**3.1 Create Free Tier Cluster**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster
4. Create a database user
5. Add IP whitelist: 0.0.0.0/0 (for cloud deployment)
6. Get connection string

**3.2 Update MONGO_URL**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

---

### Step 4: Deploy to Vercel

**4.1 Push to GitHub**
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

**4.2 Connect to Vercel**
1. Go to https://vercel.com
2. Click "New Project"
3. Import repository from GitHub
4. Select `/frontend` as root directory
5. Add environment variable: `REACT_APP_API_URL=https://your-api.onrender.com`
6. Click "Deploy"

**Vercel URL**: `https://your-project-name.vercel.app`

---

### Step 5: Deploy to Render

**5.1 Connect to Render**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Select repository
5. Configuration:
   - **Name**: `bithunter-api`
   - **Runtime**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn server:app --host 0.0.0.0 --port 10000`
   - **Instance Type**: Free

**5.2 Add Environment Variables**
In Render dashboard → Environment:
```
MONGO_URL=mongodb+srv://...
DB_NAME=bitHunter
JWT_SECRET=your-secret-key-change-this
JWT_ALGORITHM=HS256
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-key
SUPABASE_BUCKET=citizen-reports
```

**5.3 Deploy**
- Click "Create Web Service"
- Render auto-deploys from GitHub push

**Render URL**: `https://bithunter-api.onrender.com`

---

## 📊 COST BREAKDOWN (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Frontend | 100GB bandwidth | **FREE** ✅ |
| Render Backend | 750 hrs/month | **FREE** ✅ (with spin-down) |
| MongoDB Atlas | 512MB storage | **FREE** ✅ |
| Supabase Storage | 1GB | **FREE** ✅ |
| **TOTAL** | | **$0/month** ✅ |

**Caveats:**
- Render free tier spins down after 15 minutes of inactivity (first request takes 30 seconds)
- MongoDB Atlas limited to 512MB (sufficient for dev/testing)
- Supabase limited to 1GB storage

**Upgrade Path**: If you exceed limits:
- Render: $7/month for hobby dyno (always on, 512MB RAM)
- MongoDB: $57/month for M0 (more storage) or use Vercel's serverless functions
- Supabase: $25/month for starter tier (100GB storage)

---

## ⚠️ IMPORTANT CHECKLIST

- [ ] Create `.env.production` for frontend with API URL
- [ ] Create `Dockerfile` for backend
- [ ] Update CORS origins in backend/server.py
- [ ] Set up MongoDB Atlas (free tier)
- [ ] Get Supabase API keys
- [ ] Update environment variables in deployment platforms
- [ ] Test API endpoints after deployment
- [ ] Set up GitHub Actions for CI/CD (optional)

---

## 🚦 MONITORING & LOGS

### Vercel
- Dashboard: https://vercel.com/dashboard
- Logs: Deployments → Function logs
- Analytics: Build and deployment metrics

### Render
- Dashboard: https://dashboard.render.com
- Logs: Service → Logs tab
- Metrics: CPU, Memory, Requests

### MongoDB Atlas
- Metrics: Atlas Dashboard → Metrics
- Logs: Database Activity Stream

---

## 🔗 QUICK LINKS

- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Supabase Console**: https://app.supabase.com

---

## ✨ ALTERNATIVE: All-in-One Solutions

If you prefer a simpler setup, consider:

### Railway.app (Recommended Alternative)
```bash
# Single dashboard for frontend + backend + database
# $5 free credits (usually enough)
# Simpler than Render
```

### PaaS Stack:
1. **Railway** for Backend
2. **Vercel** for Frontend
3. **MongoDB Atlas** for Database

---

## 📝 FINAL RECOMMENDATION

**For quick hackathon deployment:**

```
✅ Frontend:  Vercel (easiest, fastest, free)
✅ Backend:   Render (free tier, Docker support)
✅ Database:  MongoDB Atlas (free tier)
✅ Storage:   Supabase (already integrated, free)
```

**Total Setup Time**: 30-45 minutes
**Total Cost**: $0
**Expected Uptime**: 99.5%
**Ease of Use**: ⭐⭐⭐⭐⭐

---

## 🎉 DEPLOYMENT CHECKLIST

1. **GitHub Repository** (already done ✅)
2. **Environment Variables** (create .env files)
3. **Frontend Build** (yarn build)
4. **Backend Dockerfile** (create Dockerfile)
5. **Vercel Connection** (1 click)
6. **Render Connection** (1 click)
7. **MongoDB Atlas** (10 minutes)
8. **Update API URLs** (2 files)
9. **CORS Configuration** (1 file)
10. **Test Deployment** (5 minutes)

**Total Estimated Time**: 1 hour
**Difficulty Level**: Beginner-friendly ⭐⭐

