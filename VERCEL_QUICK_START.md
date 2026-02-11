# ⚡ Vercel Quick Start - 5 Minutes

Deploy your frontend to Vercel in 5 simple steps.

---

## 🚀 Step-by-Step

### 1️⃣ Go to Vercel (1 min)

1. Visit: [vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub
3. Click **"Import Project"**

---

### 2️⃣ Import Repository (1 min)

1. Find: `Hack4Delhi-bitHunter`
2. Click **"Import"**
3. **Root Directory:** Click "Edit" → Enter `frontend`
4. Click **"Continue"**

---

### 3️⃣ Configure Settings (2 min)

**Framework:** Create React App (auto-detected) ✅

**Build Settings:**
- Build Command: `npm run build` ✅
- Output Directory: `build` ✅
- Install Command: `npm install` ✅

**Environment Variables:** Click "Add" for each:

```bash
REACT_APP_BACKEND_URL = https://your-backend.onrender.com
REACT_APP_NAME = Sentinel Portal
REACT_APP_ENV = production
```

**⚠️ Replace `your-backend.onrender.com` with your actual Render URL!**

---

### 4️⃣ Deploy (1 min)

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ Done!

---

### 5️⃣ Update Backend CORS (1 min)

**In Render Dashboard:**

1. Go to your backend service
2. Click **"Environment"**
3. Find `CORS_ORIGINS`
4. Update to:
   ```
   https://your-app.vercel.app,https://your-app-*.vercel.app
   ```
5. Save (auto-redeploys)

---

## ✅ Test Your Deployment

**Open your Vercel URL:**
```
https://your-app.vercel.app
```

**Check:**
- [ ] Landing page loads
- [ ] No console errors (F12)
- [ ] Can navigate to `/citizen`
- [ ] Can navigate to `/official/login`
- [ ] Login works (if backend is ready)

---

## 🎯 Your URLs

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Backend (Render):**
```
https://your-backend.onrender.com
```

**API Docs:**
```
https://your-backend.onrender.com/docs
```

---

## 🐛 Quick Fixes

### Build Failed?

**Check:** `frontend/package.json` has:
```json
{
  "scripts": {
    "build": "craco build"
  }
}
```

**Solution:** Redeploy with cache cleared

---

### Blank Page?

**Check:** Browser console (F12) for errors

**Common causes:**
- Wrong `REACT_APP_BACKEND_URL`
- Missing environment variables
- CORS not configured

---

### API Calls Failing?

**Check:**
1. Backend is running: `https://your-backend.onrender.com/docs`
2. CORS includes Vercel URL
3. Environment variable is correct
4. Using `https://` not `http://`

---

## 📊 What Happens Next?

### Automatic Deployments

Every time you push to GitHub:
```bash
git add .
git commit -m "Update"
git push origin main
```

Vercel automatically:
1. Detects the push
2. Builds your app
3. Deploys to production
4. Updates your URL

**No manual deployment needed!** 🎉

---

## 🎨 Optional: Custom Domain

1. Go to Vercel → **Settings** → **Domains**
2. Add your domain
3. Follow DNS instructions
4. Update backend CORS with new domain

---

## 📚 Need More Help?

**Detailed Guide:**
→ [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Troubleshooting:**
→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Full Deployment:**
→ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## ✅ Checklist

- [ ] Vercel account created
- [ ] Repository imported
- [ ] Root directory set to `frontend`
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Backend CORS updated
- [ ] App tested and working

---

**Total Time: 5 minutes**

**Your app is now live!** 🚀

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Build completes without errors  
✅ App loads at Vercel URL  
✅ No console errors  
✅ Can navigate between pages  
✅ API calls work (if backend ready)  
✅ Login/logout works  

---

**Congratulations! Your frontend is deployed!** 🎊
