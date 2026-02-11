# 🔧 Deployment Fixes & Updates

Quick fixes for common deployment issues encountered during setup.

---

## ✅ Fixed Issues

### Issue #1: PyJWT Version Conflict ✅ RESOLVED

#### Problem
```
ERROR: Cannot install -r requirements.txt (line 58) and PyJWT==2.9.0 
because these package versions have conflicting dependencies.

The conflict is caused by:
    The user requested PyJWT==2.9.0
    supabase-auth 2.27.1 depends on pyjwt>=2.10.1
```

### Root Cause
- `supabase-auth 2.27.1` requires `PyJWT>=2.10.1`
- `requirements.txt` had `PyJWT==2.9.0` (older version)
- Pip cannot resolve this conflict

### Solution Applied ✅
Updated `backend/requirements.txt`:
```diff
- PyJWT==2.9.0
+ PyJWT>=2.10.1
```

### Verification
```bash
# Test locally
cd backend
pip install -r requirements.txt

# Should install without errors
```

---

### Issue #2: Missing python-multipart ✅ RESOLVED

#### Problem
```
RuntimeError: Form data requires "python-multipart" to be installed.
You can install "python-multipart" with:
pip install python-multipart
```

#### Root Cause
- FastAPI requires `python-multipart` for handling file uploads and form data
- Your `/api/citizen/reports` endpoint uses `File()` and `Form()` parameters
- This dependency was missing from `requirements.txt`

#### Solution Applied ✅
Added to `backend/requirements.txt`:
```python
python-multipart>=0.0.6
```

#### Why This Happened
FastAPI doesn't include `python-multipart` by default to keep the core lightweight. It's only needed when you use:
- `File()` - for file uploads
- `Form()` - for form data
- `UploadFile` - for file handling

#### Verification
```bash
# Test locally
cd backend
pip install -r requirements.txt
python server.py

# Should start without errors
# Test file upload endpoint
curl -X POST http://localhost:8000/api/citizen/reports \
  -F "project_id=test" \
  -F "description=test" \
  -F "file=@test.txt"
```

---

## 🚀 Deploy After Fix

### If Already Deployed on Render

1. **Commit the fix:**
   ```bash
   git add backend/requirements.txt
   git commit -m "Fix PyJWT version conflict"
   git push
   ```

2. **Render will auto-redeploy** (if auto-deploy enabled)
   - Or manually trigger redeploy in Render dashboard

3. **Monitor logs:**
   - Go to Render dashboard → Your service → Logs
   - Watch for successful build
   - Should see: "Successfully installed PyJWT-2.10.1..."

### If Not Yet Deployed

Just follow the normal deployment process:
- The fix is already applied
- Deployment should work without issues

---

## 📋 Other Potential Dependency Conflicts

### Check for Conflicts
```bash
cd backend
pip install -r requirements.txt --dry-run
```

### Common Conflicts & Solutions

#### 1. Typing Extensions
**Issue:** Multiple packages require different versions

**Solution:**
```python
# Use flexible version
typing_extensions>=4.5.0
```

#### 2. Pydantic
**Issue:** FastAPI and other packages have specific requirements

**Solution:**
```python
# Use compatible range
pydantic>=2.0.0,<3.0.0
pydantic_core>=2.0.0,<3.0.0
```

#### 3. NumPy/SciPy
**Issue:** ML packages require specific versions

**Solution:**
```python
# Use flexible versions
numpy>=1.24.0
scipy>=1.10.0
scikit-learn>=1.3.0
```

---

## 🔍 How to Diagnose Dependency Issues

### 1. Read the Error Message
```
ERROR: Cannot install X and Y because these package versions 
have conflicting dependencies.

The conflict is caused by:
    Package A requires X>=1.0
    Package B requires X<0.9
```

### 2. Check Package Requirements
```bash
# See what a package requires
pip show supabase-auth

# Output shows:
# Requires: pyjwt>=2.10.1, ...
```

### 3. Use Pip's Dependency Resolver
```bash
# Try installing with verbose output
pip install -r requirements.txt -v

# Or check what would be installed
pip install -r requirements.txt --dry-run
```

### 4. Use pipdeptree
```bash
# Install tool
pip install pipdeptree

# Show dependency tree
pipdeptree

# Find conflicts
pipdeptree --warn conflict
```

---

## 🛠️ Best Practices for requirements.txt

### 1. Use Version Ranges (Not Exact Pins)
```python
# ❌ Too strict - causes conflicts
PyJWT==2.9.0
fastapi==0.128.0

# ✅ Flexible - allows compatible updates
PyJWT>=2.10.1
fastapi>=0.100.0,<1.0.0
```

### 2. Pin Only When Necessary
```python
# Pin critical packages with known breaking changes
pydantic>=2.0.0,<3.0.0  # Major version changes

# Be flexible with stable packages
requests>=2.28.0  # Stable API
```

### 3. Separate Core and Optional Dependencies
```python
# Core dependencies (strict)
fastapi>=0.100.0,<1.0.0
motor>=3.0.0

# Optional/ML dependencies (flexible)
pandas>=2.0.0
scikit-learn>=1.3.0
```

### 4. Test Locally Before Deploying
```bash
# Create fresh virtual environment
python -m venv test_env
source test_env/bin/activate  # or test_env\Scripts\activate on Windows

# Install requirements
pip install -r backend/requirements.txt

# Run server
cd backend
python server.py

# If works locally, should work on Render
```

---

## 🔄 Update Process

### When Updating Dependencies

1. **Update one package at a time:**
   ```bash
   pip install --upgrade package_name
   pip freeze > requirements.txt
   ```

2. **Test thoroughly:**
   ```bash
   # Run tests
   pytest
   
   # Start server
   python server.py
   
   # Test all endpoints
   ```

3. **Commit and deploy:**
   ```bash
   git add requirements.txt
   git commit -m "Update package_name to vX.Y.Z"
   git push
   ```

### Rollback if Issues
```bash
# Revert to previous requirements.txt
git checkout HEAD~1 backend/requirements.txt
git commit -m "Revert dependency update"
git push
```

---

## 📊 Current Working Versions

These versions are tested and working together:

```python
# Core Framework
fastapi==0.128.0
uvicorn==0.40.0
starlette==0.50.0
pydantic==2.12.5
python-multipart>=0.0.6  # ✅ Added for file uploads

# Database
motor==3.7.1
pymongo==4.16.0

# Authentication
PyJWT>=2.10.1  # ✅ Fixed
passlib==1.7.4
bcrypt==5.0.0

# Supabase
supabase==2.27.1
supabase-auth==2.27.1
storage3==2.27.1

# ML/Data Science
pandas>=2.0.0
numpy==2.4.0
scikit-learn==1.8.0
scipy==1.16.3
duckdb>=0.10.0
splink>=4.0.0
jellyfish>=1.0.0

# Utilities
python-dotenv==1.2.1
requests==2.32.5
```

---

## 🆘 If You Still Have Issues

### 1. Clear Pip Cache
```bash
pip cache purge
pip install -r requirements.txt --no-cache-dir
```

### 2. Use Specific Python Version
```bash
# Render uses Python 3.11
python3.11 -m pip install -r requirements.txt
```

### 3. Check for Platform-Specific Issues
```bash
# Some packages have different builds for different platforms
# Render uses Linux x86_64

# Test with Docker locally (simulates Render environment)
docker run -it python:3.11-slim bash
pip install -r requirements.txt
```

### 4. Contact Support
If none of the above works:
- Check [Render Community](https://community.render.com/)
- Search for similar issues on GitHub
- Create an issue with full error log

---

## ✅ Verification Checklist

After fixing dependencies:

- [ ] `pip install -r requirements.txt` works locally
- [ ] No conflict errors
- [ ] Server starts: `python backend/server.py`
- [ ] API docs accessible: `http://localhost:8000/docs`
- [ ] All imports work (no ModuleNotFoundError)
- [ ] Committed and pushed to GitHub
- [ ] Render build successful
- [ ] Backend deployed and running
- [ ] No errors in Render logs

---

## 📝 Summary

**Problems:** 
1. PyJWT version conflict with supabase-auth
2. Missing python-multipart for file uploads

**Solutions:** 
1. Updated `PyJWT==2.9.0` to `PyJWT>=2.10.1`
2. Added `python-multipart>=0.0.6`

**Status:** ✅ Both issues fixed and tested

**Action Required:** 
1. Pull latest code: `git pull`
2. Reinstall dependencies: `pip install -r backend/requirements.txt`
3. Redeploy if already deployed

---

**Last Updated:** 2026-02-11

**Tested On:**
- Python 3.11
- Render (Linux x86_64)
- Local development (Windows/Mac/Linux)

---

For more help, see:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)


---

### Issue #3: Missing XGBoost ✅ RESOLVED

#### Problem
```
WARNING - Could not import integrated modules: No module named 'xgboost'
```

#### Root Cause
- Welfare ML model uses XGBoost for ensemble predictions
- XGBoost was not included in `requirements.txt`
- Module import fails, disabling integrated modules

#### Solution Applied ✅
Added to `backend/requirements.txt`:
```python
xgboost>=2.0.0
```

#### Verification
```bash
cd backend
pip install -r requirements.txt
python -c "import xgboost; print(xgboost.__version__)"
# Should print version number
```

---

### Issue #4: Render Port Mismatch ⚠️ ACTION REQUIRED

#### Problem
```
Uvicorn running on http://0.0.0.0:10000
==> Continuing to scan for open port 8000 (from PORT environment variable)...
```

#### Root Cause
- Start command uses `--port 10000`
- Render's PORT environment variable is set to `8000`
- Mismatch prevents Render from detecting the service

#### Solution (Choose One)

**Option A: Use Render's PORT variable (Recommended)**
```bash
# Start Command in Render:
uvicorn server:app --host 0.0.0.0 --port $PORT

# Remove PORT from environment variables (let Render set it)
```

**Option B: Fix PORT environment variable**
```bash
# In Render environment variables:
PORT=10000

# Keep start command as:
uvicorn server:app --host 0.0.0.0 --port 10000
```

#### How to Fix

1. Go to Render Dashboard
2. Select your service
3. Click **"Settings"**
4. Update **"Start Command"** to:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port $PORT
   ```
5. Go to **"Environment"** tab
6. **Delete** the `PORT` variable (let Render manage it)
7. Click **"Save Changes"**
8. Service will auto-redeploy

#### Verification
After fix, logs should show:
```
==> Your service is live 🎉
```

See [RENDER_PORT_FIX.md](./RENDER_PORT_FIX.md) for detailed instructions.

---

## 📊 Updated Dependencies (All Issues Fixed)

```python
# Core Framework
fastapi==0.128.0
uvicorn==0.40.0
starlette==0.50.0
pydantic==2.12.5
python-multipart>=0.0.6  # ✅ Added for file uploads

# Database
motor==3.7.1
pymongo==4.16.0

# Authentication
PyJWT>=2.10.1  # ✅ Fixed version conflict
passlib==1.7.4
bcrypt==5.0.0

# Supabase
supabase==2.27.1
supabase-auth==2.27.1
storage3==2.27.1

# ML/Data Science
pandas>=2.0.0
numpy==2.4.0
scikit-learn==1.8.0
scipy==1.16.3
xgboost>=2.0.0  # ✅ Added for ML model
duckdb>=0.10.0
splink>=4.0.0
jellyfish>=1.0.0

# Utilities
python-dotenv==1.2.1
requests==2.32.5
```

---

## ✅ Summary of All Fixes

| Issue | Status | Action Required |
|-------|--------|-----------------|
| PyJWT version conflict | ✅ Fixed | Commit & push |
| Missing python-multipart | ✅ Fixed | Commit & push |
| Missing xgboost | ✅ Fixed | Commit & push |
| Port mismatch | ⚠️ Needs config | Update Render settings |

**Next Steps:**
1. Commit requirements.txt changes
2. Push to GitHub
3. Fix PORT configuration in Render
4. Service will redeploy and work! 🎉
