# Deployment Guide - Sentinel Portal

This guide provides instructions for deploying the Sentinel Portal application to production.

## Environment Variables

All configuration is managed through environment variables. No hardcoded values exist in the codebase.

### Backend Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=8000
HOST=0.0.0.0

# Database
MONGO_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/
DB_NAME=fraud_detection_db

# JWT Authentication
JWT_SECRET=your-secure-secret-key-min-32-characters
JWT_ALGORITHM=HS256

# CORS (Frontend URL)
CORS_ORIGINS=https://your-frontend-url.com

# Supabase File Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_BUCKET=citizen-reports

# Environment
ENVIRONMENT=production
```

### Frontend Configuration

Create a `.env.local` file in the `frontend/` directory with:

```env
REACT_APP_BACKEND_URL=https://your-api-url.com
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=production
```

## Deployment Steps

### Option 1: Docker Deployment (Recommended)

Create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=${MONGO_URL}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGINS=${CORS_ORIGINS}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - SUPABASE_BUCKET=${SUPABASE_BUCKET}
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
      - REACT_APP_ENV=production
    depends_on:
      - backend
    restart: always
```

Deploy with:
```bash
docker-compose up -d
```

### Option 2: Traditional Server Deployment

#### Backend (Python/FastAPI)

```bash
# Clone repository
git clone <your-repo>
cd bitHunter/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with production values
nano .env

# Run with Gunicorn (for production)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 server:app
```

#### Frontend (React)

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local with production values
echo "REACT_APP_BACKEND_URL=https://your-api.com" > .env.local

# Build for production
npm run build

# Deploy build/ folder to your hosting (Netlify, Vercel, AWS S3, etc.)
```

## Environment Variables for Different Stages

### Development
```env
REACT_APP_BACKEND_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

### Staging
```env
REACT_APP_BACKEND_URL=https://api-staging.yourdomain.com
CORS_ORIGINS=https://staging.yourdomain.com
ENVIRONMENT=staging
```

### Production
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
CORS_ORIGINS=https://yourdomain.com
ENVIRONMENT=production
```

## Important Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Update `JWT_SECRET`** - Generate a secure key for production
3. **Update `CORS_ORIGINS`** - Restrict to your frontend domain only
4. **Use HTTPS** - Always use HTTPS in production
5. **MongoDB Atlas** - Ensure IP whitelist includes your server's IP
6. **Supabase** - Configure storage bucket permissions appropriately

## Verification

After deployment:

1. Check Backend Health:
   ```bash
   curl https://your-api.com/api/auth/me
   # Should return 401 (needs authentication)
   ```

2. Check Frontend:
   - Navigate to https://yourdomain.com
   - Open browser console (F12)
   - Check that network requests go to the correct backend URL

3. Check Logs:
   - Backend logs via your server logging system
   - Frontend logs via browser console

## Troubleshooting

### CORS Errors
- Update `CORS_ORIGINS` to match your frontend URL exactly
- Include protocol (http/https)
- Check for trailing slashes

### API Connection Errors
- Verify `REACT_APP_BACKEND_URL` in frontend .env
- Check backend is running and accessible
- Verify firewall rules allow traffic on port 8000

### MongoDB Connection Errors
- Verify `MONGO_URL` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are properly encoded (special characters in URLs)

## Support

For deployment issues, check:
1. `.env.example` files for all required variables
2. Application logs on your server
3. Browser console for frontend errors
