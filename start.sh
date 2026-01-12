#!/bin/bash

# Sentinel Portal - Startup Script
# Starts both backend (port 8000) and frontend (port 3000)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$SCRIPT_DIR"

echo "================================"
echo "Sentinel Portal - Local Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill any existing processes on ports 8000 and 3000
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
pkill -f "uvicorn server:app" || true
pkill -f "react-scripts" || true
sleep 2

# Start Backend
echo -e "${YELLOW}Starting Backend Server (Port 8000)...${NC}"
cd "$PROJECT_DIR/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
pip install -q -r requirements.txt

# Start backend in background
nohup ./venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

sleep 3

# Start Frontend
echo -e "${YELLOW}Starting Frontend Server (Port 3000)...${NC}"
cd "$PROJECT_DIR/frontend"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install -q
fi

# Start frontend in background
PORT=3000 nohup npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

sleep 5

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Log files:"
echo "  Backend:  /tmp/backend.log"
echo "  Frontend: /tmp/frontend.log"
echo ""
echo "To stop services, run: ./stop.sh"
echo ""
