#!/bin/bash

# Sentinel Portal - Stop Script
# Stops both backend and frontend servers

echo "Stopping Sentinel Portal services..."

# Kill backend
echo "Stopping Backend Server..."
pkill -f "uvicorn server:app" || echo "Backend not running"

# Kill frontend
echo "Stopping Frontend Server..."
pkill -f "react-scripts" || echo "Frontend not running"

sleep 2

echo "All services stopped."
