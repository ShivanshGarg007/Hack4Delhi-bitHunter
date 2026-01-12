# 🚀 QUICK REFERENCE - EXACT COMMANDS TO RUN

## Your Application Status RIGHT NOW

✅ **Backend**: Running on `http://localhost:8000`
✅ **Frontend**: Running on `http://localhost:3000`
✅ **Both services**: Running on specified ports

---

## To Run Your Application Locally

### EASIEST WAY - Use Startup Scripts

#### If you're on Linux or macOS:
```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter
./start.sh
```

#### If you're on Windows:
```cmd
cd C:\Path\To\bitHUnter
start.bat
```

Both will start both services automatically!

---

## To Stop Services

### Linux/macOS:
```bash
./stop.sh
```

### Windows:
```cmd
stop.bat
```

---

## Manual Method (If Scripts Don't Work)

### Terminal 1 - Backend

**Linux/macOS:**
```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000
```

**Windows:**
```cmd
cd C:\Path\To\bitHUnter\backend
venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend

**Linux/macOS:**
```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/frontend
PORT=3000 npm start
```

**Windows:**
```cmd
cd C:\Path\To\bitHUnter\frontend
set PORT=3000
npm start
```

---

## Access Your Application

- **Frontend**: Open browser → `http://localhost:3000`
- **Backend API**: Open browser → `http://localhost:8000`
- **API Docs (Swagger)**: Open browser → `http://localhost:8000/docs`
- **Alternative Docs (Redoc)**: Open browser → `http://localhost:8000/redoc`

---

## Configuration Files (Edit These for Deployment)

### For LOCAL Development (Already Set Up ✓):

**Backend** (`backend/.env`):
```env
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS="http://localhost:3000"
REACT_APP_BACKEND_URL=http://localhost:8000
```

**Frontend** (`frontend/.env.local`):
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### For PRODUCTION (Change These):

**Backend** (`backend/.env`):
```env
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS="https://yourdomain.com"    ← CHANGE THIS
MONGO_URL="your-production-mongodb-url"  ← CHANGE THIS
JWT_SECRET="production-secret-key"       ← CHANGE THIS
```

**Frontend** (`frontend/.env.local`):
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com  ← CHANGE THIS
REACT_APP_ENV=production
```

---

## Files You'll Need to Know

### Main Documentation:
1. `README_SETUP.md` - How to set up locally
2. `FINAL_SUMMARY.md` - This summary (you're reading it!)
3. `DEPLOYMENT.md` - How to deploy
4. `PLATFORM_DEPLOYMENT.md` - Specific platform instructions

### Configuration:
1. `backend/.env` - Backend config (CHANGE for production)
2. `frontend/.env.local` - Frontend config (CHANGE for production)

### Scripts:
1. `start.sh` / `start.bat` - Start everything
2. `stop.sh` / `stop.bat` - Stop everything

---

## Logs Location

When you start the services, logs are saved to:
- **Backend log**: `/tmp/backend.log`
- **Frontend log**: `/tmp/frontend.log`

To view:
```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs  
tail -f /tmp/frontend.log
```

---

## What Changes For Deployment?

### ONLY 2 Lines Need to Change:

1. **Frontend**: Update `REACT_APP_BACKEND_URL` to your production API URL
2. **Backend**: Update `CORS_ORIGINS` to your production frontend domain

**That's it! Same code works everywhere.**

---

## Ports Used

- **Port 3000**: Frontend (React)
- **Port 8000**: Backend (FastAPI)

These are already configured. Don't change them unless you update `.env` files.

---

## If Something Goes Wrong

### Backend won't start?
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill the process using port 8000
kill -9 <PID>

# Then start backend again
```

### Frontend won't start?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process using port 3000
kill -9 <PID>

# Then start frontend again
```

### Can't connect frontend to backend?
1. Check that backend is running: `curl http://localhost:8000/openapi.json`
2. Check that `REACT_APP_BACKEND_URL` is correct
3. Check browser console (F12) for errors

### CORS error?
Check that `CORS_ORIGINS` in `backend/.env` includes your frontend URL

---

## Deployment Checklist

Before deploying, follow these steps:

### 1. Update Backend Config
```bash
# Edit backend/.env
# Change: CORS_ORIGINS to your frontend domain
# Change: MONGO_URL to production database
# Change: JWT_SECRET to a secure value
# Change: SUPABASE settings if using file uploads
```

### 2. Update Frontend Config
```bash
# Edit frontend/.env.local
# Change: REACT_APP_BACKEND_URL to your API domain
```

### 3. Push to Deployment Platform
```bash
# Follow instructions for your platform:
# - Docker? Use docker-compose
# - Heroku? Use git push heroku main
# - AWS? Use AWS CLI or console
# - Others? See PLATFORM_DEPLOYMENT.md
```

### 4. Verify
```bash
# Test backend: https://yourdomain.com/api/docs
# Test frontend: https://yourdomain.com
# Check browser console for errors
```

---

## One More Thing...

**IMPORTANT FOR PRODUCTION:**
- ⚠️ Change `JWT_SECRET` to a secure random value
- ⚠️ Update `CORS_ORIGINS` to your domain
- ⚠️ Update `REACT_APP_BACKEND_URL` to your API
- ⚠️ Use HTTPS (not HTTP)
- ⚠️ Never commit `.env` files

---

## Quick Links

| What | Where |
|------|-------|
| **Frontend Local** | http://localhost:3000 |
| **Backend Local** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |
| **Config Frontend** | `frontend/.env.local` |
| **Config Backend** | `backend/.env` |
| **Startup Script** | `./start.sh` (or `start.bat` on Windows) |

---

## That's All You Need!

Your application is:
- ✅ Running locally
- ✅ Properly configured
- ✅ Ready for deployment
- ✅ Fully documented

Just:
1. Run `./start.sh` (or `start.bat` on Windows)
2. Visit `http://localhost:3000`
3. See your app working!

For deployment, only change 2 environment variables and push to your hosting platform.

**Happy coding! 🚀**
