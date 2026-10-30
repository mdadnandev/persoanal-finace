@echo off
echo ========================================================
echo   Launching Personal Finance Tracker (Full Stack)
echo ========================================================
start "FinTrack Backend (Spring Boot :8080)" cmd /k "%~dp0start-backend.bat"
start "FinTrack Frontend (React Vite :3000)" cmd /k "%~dp0start-frontend.bat"
echo Services are starting in separate windows!
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
