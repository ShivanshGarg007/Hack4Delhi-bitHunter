# Environment Variables Configuration

## Overview

The Sentinel Portal uses **environment variables exclusively** for configuration. No hardcoded localhost or URLs exist in the codebase, making it deployment-ready.

## Frontend Environment Variables

### Location: `frontend/.env.local`

| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_BACKEND_URL` | Backend API base URL | `http://localhost:8000` (dev) or `https://api.yourdomain.com` (prod) |
| `REACT_APP_NAME` | Application display name | `Sentinel Portal` |
| `REACT_APP_ENV` | Environment identifier | `development`, `staging`, `production` |

### How It's Used

All frontend components use the same pattern:

```javascript
// frontend/src/pages/OfficialDashboard.js
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// All API calls use this variable
axios.get(`${API}/official/dashboard`);
```

**Files using `REACT_APP_BACKEND_URL`**:
- `src/contexts/AuthContext.js`
- `src/pages/OfficialDashboard.js`
- `src/pages/CitizenPortal.js`
- `src/pages/VendorsList.js`
- `src/pages/VendorDetail.js`
- `src/pages/ContractsList.js`
- `src/pages/ContractDetail.js`
- `src/pages/ProjectDetail.js`
- `src/pages/modules/welfare/WelfareDashboard.js`
- `src/pages/modules/ledger/LedgerDashboard.js`
- `src/pages/modules/lifestyle/LifestyleDashboard.js`

## Backend Environment Variables

### Location: `backend/.env`

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `PORT` | Yes | - | Server port (e.g., `8000`) |
| `HOST` | Yes | - | Server host (e.g., `0.0.0.0`) |
| `MONGO_URL` | Yes | - | MongoDB connection string |
| `DB_NAME` | Yes | - | Database name |
| `JWT_SECRET` | Yes | - | JWT signing secret (min 32 chars) |
| `JWT_ALGORITHM` | Yes | `HS256` | JWT algorithm |
| `CORS_ORIGINS` | Yes | - | Allowed frontend URLs (comma-separated) |
| `SUPABASE_URL` | Yes | - | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes | - | Supabase service role key |
| `SUPABASE_BUCKET` | Yes | `citizen-reports` | Supabase storage bucket |
| `ENVIRONMENT` | No | `development` | Environment identifier |

### How It's Used

Backend reads environment variables in `server.py`:

```python
# backend/server.py
mongo_url = os.environ['MONGO_URL']
db = client[os.environ['DB_NAME']]
JWT_SECRET = os.environ.get('JWT_SECRET')
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
```

CORS configuration automatically uses environment variable:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Configuration Templates

### Development (.env files)

**Frontend**: `frontend/.env.local`
```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=development
```

**Backend**: `backend/.env`
```env
PORT=8000
HOST=0.0.0.0
MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net/"
DB_NAME="fraud_detection_db"
JWT_SECRET="dev-secret-key-12345678901234567890"
JWT_ALGORITHM="HS256"
CORS_ORIGINS="http://localhost:3000"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your-key"
SUPABASE_BUCKET="citizen-reports"
ENVIRONMENT="development"
```

### Production (.env files)

**Frontend**: `frontend/.env.local`
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
REACT_APP_NAME=Sentinel Portal
REACT_APP_ENV=production
```

**Backend**: `backend/.env`
```env
PORT=8000
HOST=0.0.0.0
MONGO_URL="mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/"
DB_NAME="fraud_detection_db_prod"
JWT_SECRET="generate-secure-random-key-min-32-characters"
JWT_ALGORITHM="HS256"
CORS_ORIGINS="https://yourdomain.com"
SUPABASE_URL="https://prod-project.supabase.co"
SUPABASE_SERVICE_KEY="prod-service-key"
SUPABASE_BUCKET="citizen-reports-prod"
ENVIRONMENT="production"
```

## Startup Commands

### Local Development

```bash
# Terminal 1: Backend
cd backend
PORT=8000 uvicorn server:app --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
PORT=3000 npm start
```

Environment variables are automatically loaded from `.env` and `.env.local` files.

### Docker Deployment

```bash
# Pass environment variables to containers
docker run -d \
  -p 8000:8000 \
  --env MONGO_URL="mongodb+srv://..." \
  --env CORS_ORIGINS="https://yourdomain.com" \
  --env-file backend/.env \
  sentinel-backend

docker run -d \
  -p 3000:3000 \
  --env REACT_APP_BACKEND_URL="https://api.yourdomain.com" \
  --env-file frontend/.env.local \
  sentinel-frontend
```

### Cloud Deployment (AWS, Google Cloud, Azure)

Set environment variables in your deployment platform:
- AWS: Use Parameter Store or Secrets Manager
- Google Cloud: Use Cloud Build variables or Cloud Run configuration
- Azure: Use Key Vault or App Configuration

## Security Best Practices

### ✓ DO:
- Use environment variables for all configuration
- Keep `.env` files in `.gitignore` (never commit them)
- Use strong random `JWT_SECRET` for production
- Rotate secrets regularly
- Use HTTPS for production URLs
- Restrict `CORS_ORIGINS` to your domain only

### ✗ DON'T:
- Hardcode URLs, secrets, or credentials
- Commit `.env` files to version control
- Use the same secrets across environments
- Store credentials in comments or code
- Use `*` for `CORS_ORIGINS` in production

## Verification Checklist

Before deploying to production:

- [ ] No `localhost` references in code (use environment variables)
- [ ] `.env` files are in `.gitignore`
- [ ] All required environment variables are documented
- [ ] `.env.example` files are committed (as templates)
- [ ] `CORS_ORIGINS` is set to your production domain
- [ ] `JWT_SECRET` is a strong random value
- [ ] Backend and frontend URLs match across environments
- [ ] HTTPS is enabled for production URLs
- [ ] All credentials are securely managed

## Example Environment Variable Flow

```
User wants to deploy to production at api.yourdomain.com

1. Set environment variables on hosting platform:
   REACT_APP_BACKEND_URL=https://api.yourdomain.com
   CORS_ORIGINS=https://yourdomain.com

2. Deploy code (same code as development - no changes!)

3. Application automatically uses production URLs:
   Frontend → uses REACT_APP_BACKEND_URL from environment
   Backend → uses CORS_ORIGINS from environment

4. No code changes needed for different environments!
```

## Troubleshooting Environment Variables

### Frontend not connecting to backend?
```bash
# Check frontend environment variable
echo $REACT_APP_BACKEND_URL

# Should output the correct backend URL
# If empty, check that .env.local exists and has the variable
```

### CORS errors in browser?
```bash
# Check backend CORS configuration
# Verify CORS_ORIGINS matches your frontend URL exactly
# Include protocol (http:// or https://)
```

### Port conflicts?
```bash
# Change PORT in .env before starting:
PORT=9000  # for backend
PORT=3001  # for frontend
```

## Additional Resources

- See `README_SETUP.md` for startup instructions
- See `DEPLOYMENT.md` for production deployment guide
- See `.env.example` files for all available variables
