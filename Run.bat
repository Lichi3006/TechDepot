@echo off
echo Starting TechDepot...
echo ========================
echo The database will be created automatically in this folder.
echo Press CTRL+C to stop the server.
echo.
start http://localhost:8080
java -jar TechDepot-Portable.jar
pause
