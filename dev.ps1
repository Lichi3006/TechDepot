# TechDepot - Unified Dev Runner
Write-Host "--- TechDepot: Iniciando Entorno de Desarrollo ---" -ForegroundColor Cyan

# 1. Lanzar Backend
Write-Host "[1/2] Lanzando Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd td-backend; ./mvnw spring-boot:run"

# 2. Lanzar Frontend
Write-Host "[2/2] Lanzando Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd td-frontend; npm run dev"

Write-Host ""
Write-Host "¡Todo listo! Se han abierto dos terminales independientes." -ForegroundColor Green
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "Podes cerrar esta ventana. Los procesos seguiran corriendo en las nuevas terminales."
