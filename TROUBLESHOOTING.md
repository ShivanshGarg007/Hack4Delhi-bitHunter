# 🔧 Troubleshooting Guide

Common issues and solutions for Sentinel Platform deployment.

---

## 🚨 Critical Issues

### 1. Backend Won't Start

**Symptoms:**
- Render shows "Application failed to respond"
- Logs show "ModuleNotFoundError"
- Service keeps restarting

**Solutions:**

**A. Missing Dependencies**
```bash
# Check requirements.txt includes all packages
pip freeze > backend/requirements.txt
git add backend/requirements.txt
git commit -m "Update requirements"
git push
```

**B. Wrong Start Command**
```bash
# Correct command in Render:
uvicorn server:app --host 0.0.0.0 --port 10000

# NOT:
python server.py
uvicorn server:app  # Missing host/port
```

**C. Wrong Root Directory**
```
Render Settings → Root Directory: backend
NOT: . or / or Hack4Delhi-bitHunter
```

**D. Port Mismatch**
```bash
# Environment variable must match start command
PORT=10000

# Start command must use same port
--port 10000
```

---

### 2. Database Connection Failed

**Symptoms:**
- "Authentication failed"
- "Connection timeout"
- "Network error"

**Solutions:**

**A. Check Connection String**
```bash
# Format must be:
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Common mistakes:
❌ mongodb://... (missing +srv)
❌ <password> not replaced
❌ Special characters in password (URL encode them)
❌ Missing database name in MONGO_URL
```

**B. IP Whitelist**
```
MongoDB Atlas → Network Access
→ Should have: 0.0.0.0/0 (Allow from anywhere)
→ Or add Render's IP ranges
```

**C. Database User Permissions**
```
MongoDB Atlas → Database Access
→ User should have "Atlas admin" or "Read and write to any database"
```

**D. Test Connection Locally**
```bash
# Update local .env with production MONGO_URL
python backend/server.py

# If works locally but not on Render:
→ Check environment variables in Render
→ Check for typos
→ Check for hidden characters
```

---

### 3. CORS Errors

**Symptoms:**
- Browser console: "CORS policy blocked"
- "Access-Control-Allow-Origin" error
- Frontend can't reach backend

**Solutions:**

**A. Update CORS_ORIGINS**
```bash
# In Render environment variables:
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://your-app-*.vercel.app

# Common mistakes:
❌ http:// instead of https://
❌ Trailing slash: https://app.vercel.app/
❌ Missing Vercel preview URLs
❌ Using * in production (security risk)
```

**B. Check Backend URL in Frontend**
```bash
# Vercel environment variables:
REACT_APP_BACKEND_URL=https://sentinel-backend.onrender.com

# Common mistakes:
❌ http:// instead of https://
❌ Trailing slash
❌ localhost URL
❌ Wrong domain
```

**C. Verify CORS Middleware**
```python
# In server.py, should have:
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**D. Test CORS**
```bash
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://sentinel-backend.onrender.com/api/auth/login -v
```

---

### 4. JWT Authentication Issues

**Symptoms:**
- "Invalid token"
- "Token expired"
- Can't stay logged in
- 401 Unauthorized errors

**Solutions:**

**A. Check JWT_SECRET**
```bash
# Must be same across all environments
# Generate new one:
openssl rand -hex 32

# Update in Render environment variables
JWT_SECRET=<your-32-char-secret>
JWT_ALGORITHM=HS256
```

**B. Clear Browser Storage**
```javascript
// Open browser console (F12) and run:
localStorage.clear()
sessionStorage.clear()

// Then login again
```

**C. Check Token Expiration**
```python
# In backend/core/auth.py:
TOKEN_EXPIRE_DAYS = 7  # Tokens expire after 7 days

# If you want longer:
TOKEN_EXPIRE_DAYS = 30
```

**D. Verify Authorization Header**
```javascript
// Frontend should send:
Authorization: Bearer <token>

// NOT:
Authorization: <token>
Authorization: JWT <token>
```

---

## ⚠️ Common Issues

### 5. Frontend Build Failed

**Symptoms:**
- Vercel deployment fails
- "Module not found" errors
- Build logs show errors

**Solutions:**

**A. Check package.json**
```json
{
  "scripts": {
    "build": "craco build",  // Must exist
    "start": "craco start"
  }
}
```

**B. Install Missing Dependencies**
```bash
cd frontend
npm install
npm run build  # Test locally

# If works locally:
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**C. Check Root Directory**
```
Vercel Settings → Root Directory: frontend
NOT: . or / or Hack4Delhi-bitHunter
```

**D. Clear Build Cache**
```
Vercel → Deployments → Latest → Redeploy
→ Uncheck "Use existing Build Cache"
```

---

### 6. Supabase File Upload Failed

**Symptoms:**
- "File upload failed" error
- 403 Forbidden
- Files not appearing in bucket

**Solutions:**

**A. Check Credentials**
```bash
# In Render environment variables:
SUPABASE_URL=https://xxxxx.supabase.co  # No trailing slash
SUPABASE_SERVICE_KEY=eyJhbG...          # service_role key, NOT anon key
SUPABASE_BUCKET=citizen-reports         # Exact bucket name
```

**B. Check Bucket Permissions**
```
Supabase → Storage → citizen-reports → Policies
→ Should have upload policy
→ Or make bucket public (not recommended)
```

**C. Test Upload Locally**
```python
from supabase import create_client
client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Try upload
with open('test.txt', 'rb') as f:
    res = client.storage.from_('citizen-reports').upload('test.txt', f)
    print(res)
```

---

### 7. ML Model Not Found

**Symptoms:**
- "Model file not found"
- Welfare fraud detection fails
- 500 Internal Server Error

**Solutions:**

**A. Train Model**
```bash
cd backend
python services/welfare_ml_model.py

# This creates: services/models/welfare_fraud_model.pkl
```

**B. Commit Model File**
```bash
git add backend/services/models/welfare_fraud_model.pkl
git commit -m "Add trained ML model"
git push
```

**C. Auto-Train on First Request**
```python
# Model auto-trains if missing
# Just wait for first request (may take 30s)
```

**D. Check File Size**
```bash
# If model file > 100MB:
→ Use Git LFS
→ Or train on Render after deployment
```

---

### 8. Slow Performance / Cold Starts

**Symptoms:**
- First request takes 15-30 seconds
- Subsequent requests fast
- Happens after inactivity

**Solutions:**

**A. Render Free Tier Limitation**
```
Free tier sleeps after 15 minutes of inactivity
→ First request wakes it up (cold start)
→ Solution: Upgrade to paid tier ($7/month)
```

**B. Keep-Alive Ping**
```bash
# Use cron job to ping every 10 minutes
# UptimeRobot (free) or similar service
# Ping: https://sentinel-backend.onrender.com/docs
```

**C. Optimize Startup**
```python
# In server.py, lazy load heavy imports
# Don't import ML models at startup
# Load on first use
```

---

### 9. Database Seeding Failed

**Symptoms:**
- No data in dashboard
- Empty collections
- Seed script errors

**Solutions:**

**A. Run Seed Script**
```bash
# Option 1: Render Shell
cd backend
python seed_delhi_data.py

# Option 2: Locally with production DB
# Update .env with production MONGO_URL
python backend/seed_delhi_data.py
```

**B. Check Database Connection**
```bash
# Verify MONGO_URL and DB_NAME are correct
# Test connection:
mongosh "mongodb+srv://..." --eval "db.getCollectionNames()"
```

**C. Manual Seeding via API**
```python
# Add endpoint to server.py:
@app.post("/api/admin/seed")
async def seed_data():
    from seed_delhi_data import main as seed_main
    await seed_main()
    return {"message": "Seeded"}

# Call once via Swagger UI
```

---

### 10. Environment Variables Not Working

**Symptoms:**
- "Environment variable not found"
- Using default values
- Features not working

**Solutions:**

**A. Check Variable Names**
```bash
# Must match exactly (case-sensitive)
REACT_APP_BACKEND_URL  # ✅
React_App_Backend_Url  # ❌
BACKEND_URL            # ❌ (missing REACT_APP_ prefix)
```

**B. Redeploy After Adding Variables**
```
Render: Auto-redeploys when env vars change
Vercel: Must manually redeploy
→ Deployments → Redeploy (without cache)
```

**C. Check Variable Scope**
```
Vercel: Production / Preview / Development
→ Make sure set for correct environment
```

**D. Verify in Logs**
```python
# Add debug logging in server.py:
print(f"MONGO_URL: {os.environ.get('MONGO_URL', 'NOT SET')}")
print(f"JWT_SECRET: {'SET' if os.environ.get('JWT_SECRET') else 'NOT SET'}")
```

---

## 🔍 Debugging Tools

### Check Backend Health

```bash
# Basic health check
curl https://sentinel-backend.onrender.com/docs

# Test authentication
curl -X POST https://sentinel-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sentinel.gov.in","password":"your_password"}'

# Test protected endpoint
curl https://sentinel-backend.onrender.com/api/official/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Frontend

```javascript
// Open browser console (F12)

// Check environment variables
console.log(process.env.REACT_APP_BACKEND_URL)

// Check localStorage
console.log(localStorage.getItem('token'))

// Test API call
fetch(process.env.REACT_APP_BACKEND_URL + '/docs')
  .then(r => console.log('Backend reachable:', r.ok))
  .catch(e => console.error('Backend error:', e))
```

### Check Database

```bash
# Connect to MongoDB
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/fraud_detection_db"

# List collections
show collections

# Count documents
db.users.countDocuments()
db.contracts.countDocuments()
db.welfare_scans.countDocuments()

# Find one document
db.users.findOne()
```

### Check Logs

**Render:**
```
Dashboard → Your Service → Logs
→ Filter by: Error, Warning, Info
→ Search for specific errors
→ Download logs if needed
```

**Vercel:**
```
Dashboard → Your Project → Deployments → Latest
→ Build Logs (for build errors)
→ Function Logs (for runtime errors)
```

**Browser:**
```
F12 → Console (JavaScript errors)
F12 → Network (API call failures)
F12 → Application → Local Storage (token issues)
```

---

## 📊 Performance Issues

### Slow API Responses

**Diagnosis:**
```bash
# Measure response time
curl -w "@-" -o /dev/null -s https://sentinel-backend.onrender.com/api/official/dashboard \
  -H "Authorization: Bearer TOKEN" <<'EOF'
time_total: %{time_total}s
EOF
```

**Solutions:**
1. Add database indexes
2. Optimize queries (use projections)
3. Add caching (Redis)
4. Upgrade Render tier
5. Use CDN for static assets

### High Memory Usage

**Diagnosis:**
```
Render → Metrics → Memory Usage
```

**Solutions:**
1. Reduce ML model size
2. Use lazy loading
3. Clear unused imports
4. Upgrade instance size

### Database Slow Queries

**Diagnosis:**
```
MongoDB Atlas → Performance Advisor
→ Shows slow queries
```

**Solutions:**
```javascript
// Add indexes
db.contracts.createIndex({ "fraud_risk_score": -1 })
db.contracts.createIndex({ "status": 1 })
db.welfare_scans.createIndex({ "risk_status": 1 })
db.welfare_scans.createIndex({ "scanned_at": -1 })
```

---

## 🆘 Emergency Procedures

### Rollback Deployment

**Render:**
```
Dashboard → Service → Deployments
→ Find previous working deployment
→ Click "..." → "Redeploy"
```

**Vercel:**
```
Dashboard → Project → Deployments
→ Find previous working deployment
→ Click "..." → "Promote to Production"
```

### Reset Database

```bash
# ⚠️ WARNING: This deletes all data!

# Connect to MongoDB
mongosh "mongodb+srv://..."

# Drop database
use fraud_detection_db
db.dropDatabase()

# Re-seed
python backend/seed_delhi_data.py
```

### Regenerate JWT Secret

```bash
# Generate new secret
openssl rand -hex 32

# Update in Render
# ⚠️ This logs out all users!

# Users must login again
```

---

## 📞 Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Review deployment logs
3. ✅ Test locally with production env vars
4. ✅ Search error message online
5. ✅ Check service status pages:
   - [Render Status](https://status.render.com/)
   - [Vercel Status](https://www.vercel-status.com/)
   - [MongoDB Status](https://status.mongodb.com/)

### Information to Provide

When asking for help, include:
- Error message (full text)
- Logs (backend + frontend)
- Environment (Render/Vercel/local)
- Steps to reproduce
- What you've tried
- Screenshots if applicable

### Resources

- [FastAPI Discord](https://discord.gg/fastapi)
- [Render Community](https://community.render.com/)
- [Vercel Discord](https://vercel.com/discord)
- [MongoDB Forums](https://www.mongodb.com/community/forums/)
- [Stack Overflow](https://stackoverflow.com/)

---

## ✅ Prevention Checklist

### Before Deploying

- [ ] Test locally with production-like env vars
- [ ] Run all tests
- [ ] Check for console errors
- [ ] Verify all dependencies in requirements.txt / package.json
- [ ] Review environment variables
- [ ] Backup database
- [ ] Tag release in Git

### After Deploying

- [ ] Verify all endpoints work
- [ ] Test authentication flow
- [ ] Check all modules (welfare, ledger, lifestyle)
- [ ] Monitor logs for errors
- [ ] Test file uploads
- [ ] Verify database connections
- [ ] Check performance metrics

### Regular Maintenance

- [ ] Monitor uptime (UptimeRobot)
- [ ] Review error logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Backup database weekly
- [ ] Review performance metrics
- [ ] Check for security updates

---

**Still stuck? See full deployment guide: `DEPLOYMENT_GUIDE.md`**
