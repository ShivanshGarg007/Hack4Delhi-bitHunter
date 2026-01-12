# Sentinel Portal - Setup & Deployment Guide

Complete guide for running and deploying the Sentinel Portal application.

## Quick Start (Local Development)

### Prerequisites
- Python 3.8+ with pip
- Node.js 14+ with npm
- MongoDB Atlas account
- Supabase account

### Using Startup Scripts

#### Linux/macOS
```bash
cd bitHUnter
chmod +x start.sh stop.sh
./start.sh
```

The script will:
- Clean up any existing processes
- Start Backend on **http://localhost:8000**
- Start Frontend on **http://localhost:3000**
- Display logs location

#### Windows
```cmd
cd bitHUnter
start.bat
```

Two terminal windows will open automatically.

### Manual Startup

#### Option 1: Start Both Services (Linux/macOS)
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # or: python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm install  # if first time
PORT=3000 npm start
```

#### Option 2: Start Both Services (Windows)
```cmd
REM Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000

REM Terminal 2 - Frontend
cd frontend
npm install
set PORT=3000
npm start
```

## Configuration

### No Hardcoded Localhost!

All configuration uses environment variables for easy deployment:

#### Frontend Configuration (`.env.local`)
```env
# Backend API URL - Change for deployment
REACT_APP_BACKEND_URL=http://localhost:8000

# Additional options
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=development
```

#### Backend Configuration (`.env`)
```env
# Server
PORT=8000
HOST=0.0.0.0

# Database
MONGO_URL=mongodb+srv://...
DB_NAME=fraud_detection_db

# Authentication
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256

# CORS - Frontend URL
CORS_ORIGINS=http://localhost:3000

# File Storage
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
SUPABASE_BUCKET=citizen-reports
```

## Service URLs & Ports

| Service | Local | Port | Status |
|---------|-------|------|--------|
| Frontend | http://localhost:3000 | 3000 | ✓ |
| Backend API | http://localhost:8000 | 8000 | ✓ |
| API Docs | http://localhost:8000/docs | 8000 | ✓ |
| Redoc | http://localhost:8000/redoc | 8000 | ✓ |

## Accessing the Application

1. **Open Browser**: Navigate to **http://localhost:3000**
2. **Backend API Docs**: http://localhost:8000/docs (Swagger UI)
3. **Console Logs**: Check browser F12 → Console tab

## Deployment Configuration

### For Production Deployment

#### Backend
```env
PORT=8000
HOST=0.0.0.0
MONGO_URL=<your-production-mongodb-url>
DB_NAME=fraud_detection_db
JWT_SECRET=<generate-secure-key-min-32-chars>
CORS_ORIGINS=https://yourdomain.com
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_KEY=<your-service-key>
SUPABASE_BUCKET=citizen-reports
ENVIRONMENT=production
```

#### Frontend
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=production
```

### Environment-Specific Variables

#### Development
```env
REACT_APP_BACKEND_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:3000
```

#### Staging
```env
REACT_APP_BACKEND_URL=https://api-staging.yourdomain.com
CORS_ORIGINS=https://staging.yourdomain.com
```

#### Production
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

## Docker Deployment

### Build and Run with Docker

```bash
# Build images
docker build -t sentinel-backend ./backend
docker build -t sentinel-frontend ./frontend

# Run containers
docker run -d \
  -p 8000:8000 \
  --env-file backend/.env \
  --name sentinel-backend \
  sentinel-backend

docker run -d \
  -p 3000:3000 \
  --env-file frontend/.env.local \
  --name sentinel-frontend \
  sentinel-frontend
```

### Using Docker Compose

```bash
docker-compose up -d
```

## Troubleshooting

### Port Already in Use

**Error**: `address already in use`

**Solution**:
```bash
# Linux/macOS
lsof -i :8000  # Find process
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### CORS Errors in Browser

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: 
1. Check `CORS_ORIGINS` in backend `.env`
2. Ensure it matches your frontend URL exactly
3. Include protocol: `http://localhost:3000`

### Backend Not Responding

**Check**:
```bash
# Backend logs
tail -f /tmp/backend.log

# Verify port
netstat -tlnp | grep 8000

# Test connection
curl http://localhost:8000/openapi.json
```

### Frontend Not Loading

**Check**:
```bash
# Frontend logs
tail -f /tmp/frontend.log

# Verify port
netstat -tlnp | grep 3000

# Check environment variable
echo $REACT_APP_BACKEND_URL
```

## API Testing

### Test Backend Health
```bash
curl http://localhost:8000/openapi.json
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Integrated Modules

The application includes 3 integrated fraud detection modules:

- **Welfare Checker** (`/api/welfare/*`) - Welfare fraud detection
- **PDS Ledger** (`/api/ledger/*`) - Blockchain transaction ledger  
- **Lifestyle Scanner** (`/api/lifestyle/*`) - 360° profile scanning

See `INTEGRATION_PLAN.md` for detailed module documentation.

## File Structure

```
bitHUnter/
├── backend/
│   ├── .env                 # Configuration (not in git)
│   ├── .env.example         # Template for .env
│   ├── requirements.txt     # Python dependencies
│   ├── server.py           # FastAPI application
│   ├── core/               # Shared utilities
│   ├── routes/             # API route modules
│   ├── services/           # Business logic
│   └── data/               # CSV data files
│
├── frontend/
│   ├── .env.local          # Configuration (not in git)
│   ├── .env.example        # Template for .env
│   ├── package.json        # Node dependencies
│   ├── public/             # Static files
│   └── src/
│       ├── App.js          # Main component
│       ├── components/     # UI components
│       ├── pages/          # Page components
│       ├── contexts/       # React contexts
│       └── hooks/          # Custom hooks
│
├── start.sh               # Linux/macOS startup script
├── start.bat              # Windows startup script
├── stop.sh                # Linux/macOS stop script
├── stop.bat               # Windows stop script
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## Support & Documentation

- **API Documentation**: http://localhost:8000/docs
- **Integration Details**: See `INTEGRATION_PLAN.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **GitHub Issues**: Report bugs and feature requests

## Important Security Notes

⚠️ **Before Production Deployment**:

1. ✓ Change `JWT_SECRET` to a secure random value
2. ✓ Update `CORS_ORIGINS` to your production domain
3. ✓ Use HTTPS for all production URLs
4. ✓ Secure MongoDB credentials
5. ✓ Rotate Supabase API keys
6. ✓ Never commit `.env` files to git
7. ✓ Use environment variables on your hosting platform

## License

This project is part of the Hack4Delhi initiative.
