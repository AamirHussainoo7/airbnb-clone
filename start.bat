@echo off
echo Starting Airbnb Clone...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.

start "AIRBNB BACKEND" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 2 /nobreak > nul
start "AIRBNB FRONTEND" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Both servers are starting...
echo Open http://localhost:5173 in your browser
pause
