#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project root
PROJECT_ROOT="/home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter"
cd "$PROJECT_ROOT"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  bitHunter Development Environment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo -e "${RED}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start backend in the background
echo -e "${GREEN}Starting Backend Server (port 8000)...${NC}"
cd "$PROJECT_ROOT/backend"
./venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started with PID $BACKEND_PID${NC}"
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}Failed to start backend!${NC}"
    cat /tmp/backend.log
    exit 1
fi

# Start frontend
echo -e "${GREEN}Starting Frontend Server (port 3000)...${NC}"
cd "$PROJECT_ROOT/frontend"
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started with PID $FRONTEND_PID${NC}"

sleep 4

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Backend running on http://localhost:8000${NC}"
echo -e "${GREEN}✓ Frontend running on http://localhost:3000${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Backend log:  tail -f /tmp/backend.log${NC}"
echo -e "${YELLOW}Frontend log: tail -f /tmp/frontend.log${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
