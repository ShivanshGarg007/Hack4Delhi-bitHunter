# 🔍 Frontend URL Configuration Guide

## Current Status

### ❌ ISSUE: `FRONTEND_URL` is defined but NOT BEING USED

Your `.env.production.example` has:
```dotenv
FRONTEND_URL=https://your-app.vercel.app
```

But in `backend/server.py` (line 358), the code uses:
```python
allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
```

**The backend is looking for `CORS_ORIGINS`, NOT `FRONTEND_URL`!**

---

## The Problem Explained

### What's Happening Now:
1. You defined `FRONTEND_URL` in `.env.production.example` ✅
2. But the backend code uses `CORS_ORIGINS` instead ❌
3. This means `FRONTEND_URL` is **never read or used** 🚫

### Why This Matters:
- When you deploy to Render, frontend requests will fail with CORS errors
- The backend won't know which URLs are allowed to access it
- Security issue: Currently allows all origins (`*`) if `CORS_ORIGINS` is not set

---

## Solution: Fix the Backend Configuration

### Option 1: Use `CORS_ORIGINS` (RECOMMENDED - Minimal Change)

**Update `.env.production.example`**:

```dotenv
# Backend Production Environment

# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
DB_NAME=bitHunter

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_BUCKET=citizen-reports

# CORS Configuration - Frontend URLs allowed to access backend
# For local: http://localhost:3000,http://localhost:5173
# For production: https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app

# Python
PYTHONUNBUFFERED=1
```

**And update `.env.example`**:

```dotenv
# Backend Environment Variables

# Server Configuration
PORT=8000
HOST=0.0.0.0

# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=fraud_detection_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256

# CORS Configuration - Allowed frontend origins
# Comma-separated list for multiple origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Supabase Configuration (for file uploads)
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_BUCKET=citizen-reports

# Environment
ENVIRONMENT=development
```

---

### Option 2: Use `FRONTEND_URL` (Better Architecture - Requires Code Change)

**Update `backend/server.py` (line 356-362)**:

Replace this:
```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
```

With this:
```python
# Get frontend URL(s) from environment
frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
cors_origins = [
    'http://localhost:3000',      # Local development
    'http://localhost:5173',       # Vite dev server
    frontend_url,                  # Production frontend
    'https://*.vercel.app'         # Any Vercel deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then use `FRONTEND_URL` in your `.env` files:
```dotenv
FRONTEND_URL=https://your-app.vercel.app
```

---

## Comparison: Which Option to Choose?

| Aspect | Option 1 (CORS_ORIGINS) | Option 2 (FRONTEND_URL) |
|--------|------------------------|------------------------|
| **Changes Required** | Update 2 env files | Update env files + code |
| **Flexibility** | Multiple origins possible | Easier to use |
| **Best For** | Production (single origin) | Development (multiple origins) |
| **Implementation Time** | 2 minutes | 5 minutes |
| **Recommended** | ✅ YES | Alternative |

---

## Recommended Solution: Use CORS_ORIGINS

### Step 1: Update `.env.production.example`

```dotenv
# Backend Production Environment
# Fill these in with your actual values before deploying

# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
DB_NAME=bitHunter

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256

# CORS - Add your Vercel frontend URL here
CORS_ORIGINS=https://your-app.vercel.app

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_BUCKET=citizen-reports

# Python
PYTHONUNBUFFERED=1
```

### Step 2: Update `.env.example`

```dotenv
# Backend Environment Variables

# Server Configuration
PORT=8000
HOST=0.0.0.0

# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=fraud_detection_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256

# CORS Configuration - Allowed frontend origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Supabase Configuration (for file uploads)
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_BUCKET=citizen-reports

# Environment
ENVIRONMENT=development
```

### Step 3: Update Render Environment Variables

When deploying to Render, add:
```
CORS_ORIGINS=https://bithunter-web.vercel.app
```
(Replace with your actual Vercel URL)

### Step 4: Commit Changes

```bash
cd backend
git add .env.example .env.production.example
git commit -m "Fix: Use CORS_ORIGINS for frontend URL configuration"
git push origin bitHunter
```

---

## Complete Environment Variables Checklist

### ✅ Variables Being Used Correctly

| Variable | Where Used | Purpose |
|----------|-----------|---------|
| `MONGO_URL` | server.py line 30 | Database connection |
| `DB_NAME` | server.py line 31 | Database name |
| `JWT_SECRET` | server.py line 38 | Token signing |
| `JWT_ALGORITHM` | server.py line 39 | Token algorithm |
| `SUPABASE_URL` | server.py line 42 | File storage URL |
| `SUPABASE_SERVICE_KEY` | server.py line 43 | File storage auth |
| `SUPABASE_BUCKET` | server.py line 44 | File storage bucket |
| **`CORS_ORIGINS`** | server.py line 358 | Frontend URL whitelist ✅ |

### ❌ Variables NOT Being Used

| Variable | Location | Issue |
|----------|----------|-------|
| `FRONTEND_URL` | .env.production.example | Defined but never used in code ❌ |

---

## How CORS Works

When your Vercel frontend makes a request to Render backend:

```
Frontend (Vercel)  →  Backend (Render)
https://your-app.vercel.app  →  https://bithunter-api.onrender.com

Browser checks: Is https://your-app.vercel.app in CORS_ORIGINS?
  ✅ YES → Request allowed
  ❌ NO → CORS error, request blocked
```

If `CORS_ORIGINS` is not set or is `*`, it allows all origins (security risk).

---

## Testing CORS Configuration

### Local Testing

```bash
# Start backend with local frontend URL
export CORS_ORIGINS=http://localhost:3000,http://localhost:5173
python3 -m uvicorn server:app --reload
```

### Production Testing

After deploying to Render:

```bash
# Test if Vercel frontend can access Render backend
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://bithunter-api.onrender.com/health
```

Should see response with:
```
access-control-allow-origin: https://your-app.vercel.app
```

---

## Final Recommendation

**Use Option 1 (CORS_ORIGINS)** because:

1. ✅ It's already implemented in the code
2. ✅ No code changes needed, just env file updates
3. ✅ Works with single or multiple origins
4. ✅ Standard practice for FastAPI + Starlette
5. ✅ Quick to set up (2 minutes)

**Action Items:**
- [ ] Update `.env.example` with `CORS_ORIGINS=http://localhost:3000,http://localhost:5173`
- [ ] Update `.env.production.example` with `CORS_ORIGINS=https://your-app.vercel.app`
- [ ] Delete or ignore `FRONTEND_URL` (not used)
- [ ] Commit and push changes
- [ ] When deploying to Render, set `CORS_ORIGINS` env variable
- [ ] Test CORS after deployment

