# 🚀 Vercel Frontend Deployment Guide

Complete step-by-step guide to deploy your React frontend on Vercel.

---

## 📋 Prerequisites

- [ ] GitHub repository with your code
- [ ] Vercel account (free) - [Sign up here](https://vercel.com/signup)
- [ ] Backend deployed on Render (get the URL)

---

## 🎯 Quick Deploy (5 minutes)

### Step 1: Go to Vercel Dashboard

1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**

### Step 2: Import Repository

1. Click **"Import Git Repository"**
2. If not connected, click **"Connect GitHub"**
3. Authorize Vercel to access your repositories
4. Find your repository: `Hack4Delhi-bitHunter`
5. Click **"Import"**

### Step 3: Configure Project

**Framework Preset:**
- Auto-detected: **Create React App** ✅

**Root Directory:**
- Click **"Edit"**
- Enter: `frontend`
- Click **"Continue"**

**Build Settings:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `build` (auto-detected)
- Install Command: `npm install` (auto-detected)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_BACKEND_URL` | `https://your-backend.onrender.com` | Production |
| `REACT_APP_NAME` | `Sentinel Portal` | All |
| `REACT_APP_ENV` | `production` | Production |

**Important:** Replace `your-backend.onrender.com` with your actual Render URL!

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ Your app is live!

---

## 🔧 Detailed Configuration

### Project Settings

```yaml
Framework: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
Node Version: 18.x (default)
```

### Environment Variables

```bash
# Backend API URL (REQUIRED)
REACT_APP_BACKEND_URL=https://sentinel-backend.onrender.com

# Application Name (Optional)
REACT_APP_NAME=Sentinel Portal

# Environment (Optional)
REACT_APP_ENV=production
```

**⚠️ Critical:** 
- All React env vars MUST start with `REACT_APP_`
- No trailing slashes in URLs
- Use `https://` not `http://`

---

## 📊 Build Process

Vercel will:

1. **Clone your repository**
2. **Navigate to `frontend` directory**
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Build production bundle:**
   ```bash
   npm run build
   ```
5. **Deploy to CDN**
6. **Assign URL:** `https://your-app.vercel.app`

**Build time:** 2-3 minutes

---

## ✅ Verify Deployment

### Check Build Logs

1. Go to **"Deployments"** tab
2. Click on latest deployment
3. View **"Build Logs"**
4. Should see:
   ```
   ✓ Compiled successfully
   ✓ Build completed
   ```

### Test Your App

1. **Open your Vercel URL:**
   ```
   https://your-app.vercel.app
   ```

2. **Check landing page loads**

3. **Test navigation:**
   - `/` - Landing page
   - `/citizen` - Citizen portal
   - `/official/login` - Official login

4. **Open browser console (F12)**
   - Should see no errors
   - Check Network tab for API calls

---

## 🔗 Update Backend CORS

**Important:** After deployment, update your backend CORS settings!

### In Render Dashboard:

1. Go to your backend service
2. Click **"Environment"**
3. Find `CORS_ORIGINS`
4. Update to include your Vercel URLs:
   ```
   https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://your-app-*.vercel.app
   ```
5. Click **"Save Changes"**
6. Backend will auto-redeploy

**Why multiple URLs?**
- `your-app.vercel.app` - Production
- `your-app-git-main.vercel.app` - Main branch preview
- `your-app-*.vercel.app` - All preview deployments

---

## 🎨 Custom Domain (Optional)

### Add Your Domain

1. Go to **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain: `sentinel.yourdomain.com`
4. Follow DNS configuration instructions

### DNS Configuration

Add these records to your DNS provider:

**For subdomain (recommended):**
```
Type: CNAME
Name: sentinel
Value: cname.vercel-dns.com
```

**For root domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

### Update Backend CORS

After adding custom domain, update `CORS_ORIGINS`:
```
https://sentinel.yourdomain.com,https://your-app.vercel.app
```

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub!

### Production Deployments

**Trigger:** Push to `main` branch
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

**Result:** Deploys to `https://your-app.vercel.app`

### Preview Deployments

**Trigger:** Push to any other branch
```bash
git checkout -b feature-branch
git add .
git commit -m "New feature"
git push origin feature-branch
```

**Result:** Deploys to `https://your-app-git-feature-branch.vercel.app`

---

## 🐛 Troubleshooting

### Build Failed

**Error:** `npm ERR! missing script: build`

**Solution:**
```json
// Check frontend/package.json has:
{
  "scripts": {
    "build": "craco build"
  }
}
```

---

**Error:** `Module not found: Can't resolve 'X'`

**Solution:**
```bash
# Locally test build
cd frontend
npm install
npm run build

# If works locally, clear Vercel cache:
# Vercel Dashboard → Deployments → Redeploy (uncheck cache)
```

---

**Error:** `Build exceeded maximum duration`

**Solution:**
- Free tier: 45 minutes max
- Usually completes in 2-3 minutes
- If timeout, check for infinite loops in build scripts

---

### Runtime Errors

**Error:** `Failed to fetch` or `Network Error`

**Solution:**
1. Check `REACT_APP_BACKEND_URL` is correct
2. Verify backend is running
3. Check CORS configuration
4. Open browser console for details

---

**Error:** Blank page / White screen

**Solution:**
1. Check browser console for errors
2. Verify all routes are configured
3. Check `public/index.html` exists
4. Clear browser cache

---

**Error:** Environment variables not working

**Solution:**
1. Verify variables start with `REACT_APP_`
2. Redeploy after adding variables:
   - Deployments → Latest → Redeploy
   - Uncheck "Use existing Build Cache"
3. Check variables in build logs:
   ```
   REACT_APP_BACKEND_URL: https://...
   ```

---

### CORS Errors

**Error:** `Access-Control-Allow-Origin` blocked

**Solution:**
1. Update backend `CORS_ORIGINS` to include Vercel URL
2. No trailing slashes
3. Use `https://` not `http://`
4. Include all Vercel preview URLs

**Test CORS:**
```bash
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://your-backend.onrender.com/api/auth/login -v
```

---

## 📊 Performance Optimization

### Enable Edge Caching

Vercel automatically caches static assets on CDN.

### Optimize Images

```javascript
// Use optimized image formats
import logo from './logo.webp'; // Instead of .png

// Lazy load images
<img loading="lazy" src={logo} alt="Logo" />
```

### Code Splitting

```javascript
// Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

### Bundle Size

Check bundle size in build logs:
```
File sizes after gzip:
  50.2 KB  build/static/js/main.abc123.js
  1.2 KB   build/static/css/main.def456.css
```

**Target:** < 200 KB for main bundle

---

## 🔒 Security

### Environment Variables

- ✅ Never commit `.env` files
- ✅ Use Vercel's environment variables
- ✅ Different values for dev/prod
- ✅ Rotate secrets regularly

### HTTPS

- ✅ Vercel provides free SSL
- ✅ Automatic HTTPS redirect
- ✅ HTTP/2 enabled

### Headers

Vercel automatically sets security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

---

## 📈 Analytics (Optional)

### Vercel Analytics

1. Go to **"Analytics"** tab
2. Click **"Enable"**
3. Free tier: 100k events/month

### Google Analytics

Add to `public/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎯 Deployment Checklist

### Before Deploying

- [ ] Code pushed to GitHub
- [ ] Backend URL ready
- [ ] Environment variables documented
- [ ] Local build successful: `npm run build`
- [ ] No console errors locally

### During Deployment

- [ ] Vercel project created
- [ ] Root directory set to `frontend`
- [ ] Environment variables added
- [ ] Build successful
- [ ] No build errors in logs

### After Deployment

- [ ] App loads at Vercel URL
- [ ] All pages accessible
- [ ] API calls working
- [ ] No console errors
- [ ] Backend CORS updated
- [ ] Login/logout working
- [ ] All features tested

---

## 🚀 Production Checklist

### Performance

- [ ] Lighthouse score > 90
- [ ] Page load < 3 seconds
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Code splitting enabled

### SEO

- [ ] Meta tags configured
- [ ] Open Graph tags added
- [ ] Sitemap generated
- [ ] Robots.txt configured

### Monitoring

- [ ] Analytics enabled
- [ ] Error tracking setup (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring

---

## 📞 Support

### Vercel Resources

- [Documentation](https://vercel.com/docs)
- [Discord Community](https://vercel.com/discord)
- [Status Page](https://www.vercel-status.com/)
- [Support](https://vercel.com/support)

### Common Issues

- [Build Errors](https://vercel.com/docs/errors)
- [Deployment Issues](https://vercel.com/docs/deployments/troubleshoot)
- [Environment Variables](https://vercel.com/docs/environment-variables)

---

## 🎉 Success!

Your frontend is now live at:
```
https://your-app.vercel.app
```

**Next Steps:**
1. Test all features
2. Update backend CORS
3. Share with your team
4. Add custom domain (optional)
5. Enable analytics (optional)

---

## 📝 Quick Reference

### Vercel URLs

```
Production:  https://your-app.vercel.app
Preview:     https://your-app-git-branch.vercel.app
Dashboard:   https://vercel.com/dashboard
```

### Environment Variables

```bash
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=production
```

### Useful Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from CLI
cd frontend
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

---

**Your frontend is ready to deploy!** 🚀

Follow this guide and you'll have a live app in 5 minutes!
