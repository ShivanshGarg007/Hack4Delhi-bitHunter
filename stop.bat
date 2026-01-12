@echo off
REM Sentinel Portal - Stop Script for Windows

echo Stopping Sentinel Portal services...
echo.

REM Kill backend
echo Stopping Backend Server...
taskkill /F /IM python.exe 2>nul || echo Backend not running

REM Kill frontend
echo Stopping Frontend Server...
taskkill /F /IM node.exe 2>nul || echo Frontend not running

timeout /t 2 /nobreak

echo All services stopped.
pause
