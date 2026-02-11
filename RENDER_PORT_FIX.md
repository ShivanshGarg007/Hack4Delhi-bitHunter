# 🔧 Render Port Configuration Fix

## ❌ Current Issue

Your server is running but Render can't connect to it:

```
Uvicorn running on http://0.0.0.0:10000
==> Continuing to scan for open port 8000 (from PORT environment variable)...
```

**Problem:** Mismatch between:
- Server listening on: **port 10000**
- Render expecting: **port 8000** (from PORT env var)

---

## ✅ Solution: Use Render's PORT Variable

Render automatically sets the `PORT` environment variable. Your app should use it.

### Option 1: Update Start Command (Recommended)

**In Render Dashboard:**

1. Go to your service
2. Click **"Settings"**
3. Find **"Start Command"**
4. Change from:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 10000
   ```
   To:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port $PORT
   ```
5. Click **"Save Changes"**
6. Service will auto-redeploy

### Option 2: Remove PORT Environment Variable

**In Render Dashboard:**

1. Go to your service
2. Click **"Environment"**
3. Find `PORT` variable
4. **Delete it** (Render will use default)
5. Update start command to:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 10000
   ```
6. Click **"Save Changes"**

---

## 🎯 Recommended Configuration

### Environment Variables (Render)

**Remove or update:**
```bash
# ❌ Don't set PORT manually
PORT=10000

# ✅ Let Render set it automatically (or don't include this variable)
```

### Start Command (Render)

**Use Render's PORT variable:**
```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

**Or use a fixed port and remove PORT env var:**
```bash
uvicorn server:app --host 0.0.0.0 --port 10000
```

---

## 🔍 Why This Happens

Render's free tier uses dynamic port allocation:
- Render sets `PORT` environment variable
- Your app must listen on that port
- Render's load balancer forwards traffic to that port

**Best Practice:** Always use `$PORT` in your start command on Render.

---

## ✅ After Fixing

You should see:
```
Uvicorn running on http://0.0.0.0:10000
==> Your service is live 🎉
```

No more "Continuing to scan for open port" messages!

---

## 📝 Complete Render Configuration

### Build Command
```bash
pip install --upgrade pip && pip install -r requirements.txt
```

### Start Command
```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Environment Variables
```bash
# Don't set PORT - let Render handle it
HOST=0.0.0.0
MONGO_URL=mongodb+srv://...
DB_NAME=fraud_detection_db
JWT_SECRET=<your-secret>
JWT_ALGORITHM=HS256
CORS_ORIGINS=https://your-app.vercel.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...
SUPABASE_BUCKET=citizen-reports
ENVIRONMENT=production
```

---

## 🆘 If Still Not Working

### Check Logs
```
Render Dashboard → Your Service → Logs
```

Look for:
- `Uvicorn running on http://0.0.0.0:XXXX`
- `Application startup complete`
- No error messages

### Test Endpoint
```bash
curl https://your-backend.onrender.com/docs
```

Should return FastAPI Swagger UI HTML.

---

## ✅ Summary

**Problem:** Port mismatch  
**Solution:** Use `--port $PORT` in start command  
**Status:** Easy fix, redeploy needed

---

**Apply this fix and your deployment will work!** 🚀
