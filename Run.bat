@echo off
if not exist "TechDepot-Portable.jar" (
    echo [ERROR] TechDepot-Portable.jar not found!
    echo Please run build-standalone.ps1 first to compile the project.
    echo.
    pause
    exit /b
)
echo Starting TechDepot...
echo ========================
echo The database will be created automatically in this folder.
echo Press CTRL+C to stop the server.
echo.
start http://localhost:8080
java -jar TechDepot-Portable.jar
pause
