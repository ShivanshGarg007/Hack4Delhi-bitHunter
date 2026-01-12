# BitHunter - Startup Commands

## Quick Start

### Option 1: Run Backend and Frontend in Separate Terminals (Recommended)

#### Terminal 1 - Backend
```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/backend
./venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2 - Frontend
```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/frontend
PORT=3002 npm start
```

Then open your browser and go to: **http://localhost:3002**

---

### Option 2: Run Both in Background

```bash
# Kill any existing processes
pkill -9 -f "uvicorn\|react-scripts\|craco\|npm" 2>/dev/null

# Start Backend
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/backend
nohup ./venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 --reload > /tmp/backend.log 2>&1 &

# Start Frontend
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/frontend
PORT=3002 nohup npm start > /tmp/frontend.log 2>&1 &

# View logs
tail -f /tmp/backend.log   # Backend logs
tail -f /tmp/frontend.log  # Frontend logs
```

---

## Service URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3002 | 3002 |
| Backend API | http://localhost:8000 | 8000 |
| API Documentation | http://localhost:8000/docs | 8000 |

---

## Environment Configuration

### Backend (.env)
Located at: `backend/.env`
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `JWT_ALGORITHM` - Algorithm for JWT (default: HS256)
- `SUPABASE_URL` - Supabase URL
- `SUPABASE_SERVICE_KEY` - Supabase service key
- `CORS_ORIGINS` - Comma-separated CORS allowed origins

### Frontend (.env)
Located at: `frontend/.env`
- `REACT_APP_BACKEND_URL` - Backend API URL (default: http://localhost:8000)
- `WDS_SOCKET_PORT` - WebSocket port for hot reload
- `ENABLE_HEALTH_CHECK` - Enable health check endpoint

---

## Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Citizen Portal
- `GET /api/citizen/projects` - List projects
- `GET /api/citizen/projects/{project_id}` - Get project details
- `POST /api/citizen/report` - Submit fraud report

### Official Portal - Integrated Modules

#### Welfare Fraud Detection
- `GET /api/welfare/analyze` - Analyze all welfare applicants
- `POST /api/welfare/scan` - Scan individual applicant
- `GET /api/welfare/history` - Get scan history
- `GET /api/welfare/stats` - Get welfare statistics

#### PDS Blockchain Ledger
- `GET /api/ledger/blocks` - Get blockchain blocks
- `POST /api/ledger/transaction` - Add transaction
- `GET /api/ledger/verify` - Verify transaction
- `GET /api/ledger/stats` - Get ledger statistics

#### Lifestyle Mismatch Detection
- `POST /api/lifestyle/scan` - Scan identity and lifestyle
- `GET /api/lifestyle/history` - Get scan history
- `GET /api/lifestyle/stats` - Get lifestyle statistics

---

## Testing the Setup

### Check Backend Health
```bash
curl -s http://localhost:8000/api/citizen/projects | jq .
```

### Check Frontend
```bash
curl -s http://localhost:3002 | grep -o "<title>.*</title>"
```

### View API Documentation
Open: http://localhost:8000/docs

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Kill process on port 3002
lsof -ti:3002 | xargs kill -9 2>/dev/null
```

### Backend Won't Start
1. Ensure virtual environment is activated: `source backend/venv/bin/activate`
2. Check MongoDB connection: Verify `MONGO_URL` in `backend/.env`
3. View backend logs: `tail -f /tmp/backend.log`

### Frontend Won't Compile
1. Clear node modules: `rm -rf frontend/node_modules && npm install`
2. Check Node version: `node --version` (should be 16+)
3. View frontend logs: `tail -f /tmp/frontend.log`

### Backend API Not Responding
1. Check backend is running: `pgrep -f "uvicorn server:app"`
2. Check port 8000 is listening: `netstat -tlnp | grep 8000`
3. Restart backend and check logs

---

## Default Login Credentials

Once you have demo users set up:
- **Email**: Any registered email
- **Password**: Your chosen password

For testing, create a new account via the registration page.

---

## Features Available

### Citizen Portal
- View public projects
- Submit fraud reports
- Track report status

### Official Portal
- Dashboard with analytics
- Welfare fraud detection module
- PDS blockchain ledger verification
- 360° lifestyle mismatch detection
- Audit trail and reporting

---

## Need Help?

Check the logs:
```bash
tail -50 /tmp/backend.log   # Last 50 lines of backend logs
tail -50 /tmp/frontend.log  # Last 50 lines of frontend logs
```

Or view in real-time:
```bash
tail -f /tmp/backend.log    # Watch backend logs
tail -f /tmp/frontend.log   # Watch frontend logs
```
