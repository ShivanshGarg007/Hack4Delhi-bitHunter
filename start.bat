@echo off
REM Sentinel Portal - Startup Script for Windows
REM Starts both backend (port 8000) and frontend (port 3000)

setlocal enabledelayedexpansion

echo ================================
echo Sentinel Portal - Local Setup
echo ================================

REM Kill existing processes on ports 8000 and 3000
echo Cleaning up existing processes...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq uvicorn*" 2>nul || echo.
taskkill /F /IM node.exe 2>nul || echo.
timeout /t 2 /nobreak

REM Start Backend
echo Starting Backend Server (Port 8000)...
cd /d "%~dp0backend"

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and start backend
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
start "Sentinel Backend" cmd /k "venv\Scripts\uvicorn.exe server:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend Server (Port 3000)...
cd /d "%~dp0frontend"

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install -q
)

REM Start frontend
set PORT=3000
start "Sentinel Frontend" cmd /k "npm start"

timeout /t 5 /nobreak

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo API Docs: http://localhost:8000/docs
echo.
echo To stop services, close the opened windows.
echo.
pause
