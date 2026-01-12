# Deployment Guide - Platform Specific Instructions

Choose your deployment platform and follow the instructions.

---

## 🐳 Docker (Any Platform)

### Build Images
```bash
cd bitHUnter

# Build backend
docker build -t sentinel-backend ./backend

# Build frontend
docker build -t sentinel-frontend ./frontend
```

### Create `docker-compose.yml`
```yaml
version: '3.8'

services:
  backend:
    image: sentinel-backend
    ports:
      - "8000:8000"
    environment:
      PORT: 8000
      HOST: 0.0.0.0
      MONGO_URL: ${MONGO_URL}
      DB_NAME: fraud_detection_db
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGINS: ${CORS_ORIGINS}
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY}
      SUPABASE_BUCKET: citizen-reports
    restart: always
    networks:
      - sentinel-network

  frontend:
    image: sentinel-frontend
    ports:
      - "3000:3000"
    build:
      context: ./frontend
      args:
        REACT_APP_BACKEND_URL: ${REACT_APP_BACKEND_URL}
        REACT_APP_ENV: production
    depends_on:
      - backend
    restart: always
    networks:
      - sentinel-network

networks:
  sentinel-network:
    driver: bridge
```

### Create `.env` file
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=fraud_detection_db
JWT_SECRET=your-secure-secret-key-minimum-32-characters
CORS_ORIGINS=https://yourdomain.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### Run
```bash
docker-compose up -d
```

---

## ☁️ Heroku

### Prerequisites
- Heroku CLI installed
- Heroku account

### Create Two Apps

**Backend App:**
```bash
heroku create your-app-backend
heroku addons:create mongolab
```

**Frontend App:**
```bash
heroku create your-app-frontend
```

### Configure Backend

```bash
heroku config:set -a your-app-backend \
  PORT=8000 \
  HOST=0.0.0.0 \
  MONGO_URL=$(heroku config:get MONGODB_URI -a your-app-backend) \
  DB_NAME=fraud_detection_db \
  JWT_SECRET=your-secure-secret-key \
  CORS_ORIGINS=https://your-app-frontend.herokuapp.com \
  SUPABASE_URL=https://your-project.supabase.co \
  SUPABASE_SERVICE_KEY=your-key \
  SUPABASE_BUCKET=citizen-reports
```

### Configure Frontend

```bash
heroku config:set -a your-app-frontend \
  REACT_APP_BACKEND_URL=https://your-app-backend.herokuapp.com \
  REACT_APP_ENV=production
```

### Create `Procfile` (backend)
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Deploy
```bash
# Deploy backend
cd backend
git push heroku main

# Deploy frontend
cd ../frontend
git push heroku main
```

---

## 🔷 AWS

### Option 1: Elastic Beanstalk

**Backend:**
```bash
cd backend

# Create EB environment
eb create sentinel-backend --instance-type t3.small

# Set environment variables
eb setenv \
  PORT=8000 \
  MONGO_URL=mongodb+srv://... \
  CORS_ORIGINS=https://yourdomain.com \
  JWT_SECRET=your-secret-key

# Deploy
eb deploy
```

**Frontend:**
```bash
cd frontend

# Build
npm run build

# Upload to S3 and CloudFront
aws s3 sync build/ s3://your-bucket/ --delete
```

### Option 2: ECS (Fargate)

```bash
# Push images to ECR
aws ecr create-repository --repository-name sentinel-backend
aws ecr create-repository --repository-name sentinel-frontend

docker tag sentinel-backend:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/sentinel-backend:latest

docker push \
  123456789.dkr.ecr.us-east-1.amazonaws.com/sentinel-backend:latest
```

---

## 🚀 Google Cloud Platform

### Cloud Run

**Backend:**
```bash
cd backend

# Deploy
gcloud run deploy sentinel-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URL=mongodb+srv://...
```

**Frontend:**
```bash
cd frontend

# Build
npm run build

# Deploy to Cloud Storage + Cloud CDN
gsutil -m cp -r build/* gs://your-bucket/
```

---

## 💜 Azure

### App Service

**Backend:**
```bash
az appservice plan create \
  --name sentinel-plan \
  --resource-group my-group \
  --sku B1 --is-linux

az webapp create \
  --resource-group my-group \
  --plan sentinel-plan \
  --name sentinel-backend \
  --runtime "PYTHON|3.9"

# Set environment variables
az webapp config appsettings set \
  -g my-group \
  -n sentinel-backend \
  --settings \
    MONGO_URL=mongodb+srv://... \
    CORS_ORIGINS=https://yourdomain.com \
    JWT_SECRET=your-secret-key
```

---

## 🌐 Vercel (Frontend Only)

Vercel is best for frontend hosting:

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend

# Login
vercel login

# Deploy
vercel --prod

# During deployment, set environment variables:
# REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

Or via Vercel Dashboard:
1. Import your GitHub repo
2. Go to Settings → Environment Variables
3. Add `REACT_APP_BACKEND_URL=https://api.yourdomain.com`
4. Deploy

---

## 🔰 Netlify (Frontend Only)

```bash
# Install Netlify CLI
npm install -g netlify-cli

cd frontend

# Deploy
netlify deploy --prod --dir=build

# Set environment variables in Netlify Dashboard:
# REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

Or connect GitHub:
1. Connect repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `build`
4. Set env vars in Netlify Dashboard
5. Auto-deploy on push

---

## 🏠 Self-Hosted Server

### Linux Server Setup

**Prerequisites:**
- Ubuntu/Debian server
- Python 3.8+
- Node.js 14+
- Nginx
- SSL certificate (Let's Encrypt)

### Deploy Backend

```bash
# SSH into server
ssh user@your-server-ip

# Clone repo
git clone <your-repo>
cd bitHUnter/backend

# Setup Python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env
nano .env
# Add your production variables

# Create systemd service
sudo nano /etc/systemd/system/sentinel-backend.service
```

**Service file content:**
```ini
[Unit]
Description=Sentinel Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/home/user/bitHUnter/backend
ExecStart=/home/user/bitHUnter/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always
EnvironmentFile=/home/user/bitHUnter/backend/.env

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start sentinel-backend
sudo systemctl enable sentinel-backend
```

### Deploy Frontend

```bash
cd ../frontend

# Build
npm install
npm run build

# Copy to web root
sudo cp -r build/* /var/www/html/

# Or use Nginx to serve
sudo nano /etc/nginx/sites-available/sentinel
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    root /var/www/sentinel;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL with Let's Encrypt

```bash
sudo certbot certonly --nginx -d yourdomain.com
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible: `https://api.yourdomain.com/docs`
- [ ] Frontend is accessible: `https://yourdomain.com`
- [ ] Frontend connects to backend (check browser console)
- [ ] Database connection works
- [ ] File uploads work (test citizen report)
- [ ] Login/authentication works
- [ ] All integrated modules are accessible
- [ ] HTTPS is enabled
- [ ] CORS is working (no errors in console)
- [ ] Backups are configured
- [ ] Monitoring is enabled

---

## 🔧 Common Issues

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Update `CORS_ORIGINS` in backend to match your frontend URL

### MongoDB Connection Failed
```
ServerSelectionTimeoutError
```
**Solution**: Check IP whitelist in MongoDB Atlas includes your server IP

### Frontend Can't Connect to Backend
```
Failed to fetch from /api/...
```
**Solution**: Verify `REACT_APP_BACKEND_URL` environment variable is set correctly

### Port Already in Use
```
Address already in use
```
**Solution**: Change port in `.env` or kill existing process

---

## 📞 Support

- Check application logs
- Review browser console (F12)
- Check server logs (journalctl, tail /var/log/nginx/)
- Review environment variables are set correctly
