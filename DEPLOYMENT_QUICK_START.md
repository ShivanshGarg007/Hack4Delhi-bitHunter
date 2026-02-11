# ⚡ Quick Start Deployment Guide

**5-minute setup for Sentinel Platform**

---

## 🎯 What You Need

1. GitHub account + repo pushed
2. MongoDB Atlas account (free)
3. Supabase account (free)
4. Render account (free)
5. Vercel account (free)

---

## 📋 Step-by-Step (30 minutes total)

### 1️⃣ MongoDB Atlas (5 min)

```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create FREE cluster (M0)
3. Database Access → Add User → Save password
4. Network Access → Allow 0.0.0.0/0
5. Connect → Get connection string
   mongodb+srv://user:password@cluster.mongodb.net/
6. Create database: fraud_detection_db
```

**Save:** Connection string

---

### 2️⃣ Supabase (3 min)

```
1. Go to: https://supabase.com
2. New Project → sentinel-storage
3. Storage → New Bucket → citizen-reports (private)
4. Settings → API → Copy:
   - Project URL
   - service_role key (secret!)
```

**Save:** URL + service_role key

---

### 3️⃣ Backend on Render (10 min)

```
1. Go to: https://dashboard.render.com
2. New → Web Service → Connect GitHub repo
3. Settings:
   - Name: sentinel-backend
   - Root Directory: backend
   - Runtime: Python 3
   - Build: pip install -r requirements.txt
   - Start: uvicorn server:app --host 0.0.0.0 --port 10000
   - Instance: Free
```

**Environment Variables:**
```bash
PORT=10000
HOST=0.0.0.0
MONGO_URL=mongodb+srv://...              # From step 1
DB_NAME=fraud_detection_db
JWT_SECRET=<generate-random-32-chars>    # openssl rand -hex 32
JWT_ALGORITHM=HS256
CORS_ORIGINS=*                           # Update after Vercel
SUPABASE_URL=https://xxx.supabase.co     # From step 2
SUPABASE_SERVICE_KEY=eyJhbG...           # From step 2
SUPABASE_BUCKET=citizen-reports
ENVIRONMENT=production
```

```
4. Create Web Service → Wait for deploy
5. Copy URL: https://sentinel-backend.onrender.com
```

**Save:** Backend URL

---

### 4️⃣ Seed Database (2 min)

**Option A - Render Shell:**
```bash
cd backend
python seed_delhi_data.py
```

**Option B - Local:**
```bash
# Update local .env with production MONGO_URL
python backend/seed_delhi_data.py
```

---

### 5️⃣ Frontend on Vercel (5 min)

```
1. Go to: https://vercel.com/dashboard
2. New Project → Import GitHub repo
3. Settings:
   - Framework: Create React App
   - Root Directory: frontend
   - Build: npm run build (auto)
   - Output: build (auto)
```

**Environment Variables:**
```bash
REACT_APP_BACKEND_URL=https://sentinel-backend.onrender.com
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=production
```

```
4. Deploy → Wait for build
5. Copy URL: https://your-app.vercel.app
```

**Save:** Frontend URL

---

### 6️⃣ Update CORS (2 min)

```
1. Go back to Render dashboard
2. Your backend service → Environment
3. Update CORS_ORIGINS:
   https://your-app.vercel.app,https://your-app-*.vercel.app
4. Save → Auto redeploys
```

---

### 7️⃣ Create Admin User (1 min)

```bash
curl -X POST https://sentinel-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sentinel.gov.in",
    "password": "YourSecurePassword123!",
    "full_name": "Admin User"
  }'
```

---

### 8️⃣ Test Everything (2 min)

```
✅ Frontend: https://your-app.vercel.app
✅ Backend API: https://sentinel-backend.onrender.com/docs
✅ Login: /official/login
✅ Dashboard: /official/dashboard
✅ Welfare: /official/welfare
✅ Ledger: /official/ledger
✅ Lifestyle: /official/lifestyle
```

---

## 🎉 Done!

Your app is live at: `https://your-app.vercel.app`

---

## 🐛 Quick Fixes

**CORS Error?**
```
→ Check CORS_ORIGINS in Render includes Vercel URL
→ No trailing slashes
→ Redeploy backend
```

**Database Error?**
```
→ Check MONGO_URL is correct
→ Check IP whitelist (0.0.0.0/0)
→ Test connection locally
```

**Build Failed?**
```
→ Check root directory is set correctly
→ Check requirements.txt / package.json
→ Review build logs
```

**Cold Start (15s delay)?**
```
→ Normal on Render free tier
→ Upgrade to paid tier to fix
```

---

## 📞 Need Help?

See full guide: `DEPLOYMENT_GUIDE.md`

---

## 🔑 Environment Variables Cheat Sheet

### Backend (Render)
```env
PORT=10000
HOST=0.0.0.0
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=fraud_detection_db
JWT_SECRET=<32-char-random-string>
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

## 🚀 Performance Tips

**Free Tier Limitations:**
- Render: Sleeps after 15 min inactivity (15s cold start)
- MongoDB: 512MB storage limit
- Vercel: 100GB bandwidth/month

**Upgrade Path:**
1. Render: $7/month (no sleep)
2. MongoDB: $9/month (2GB + backups)
3. Vercel: Free tier usually sufficient

---

**Time to deploy: ~30 minutes**
**Cost: $0 (free tiers)**
**Scalability: Ready for production**

✨ Happy deploying!
