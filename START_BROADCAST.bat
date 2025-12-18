@echo off
REM iRacing Broadcast Overlay Launcher for Windows
REM Double-click this file to start the broadcast overlay application

echo.
echo ============================================================
echo       iRacing Broadcast Overlay Application Launcher
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher from https://www.python.org/
    echo.
    pause
    exit /b 1
)

echo Checking Python version...
python --version

echo.
echo Starting broadcast overlay server...
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the application
python start_broadcast.py

pause
