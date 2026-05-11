@echo off
echo --- TechDepot: Iniciando Entorno de Desarrollo ---
start powershell -NoExit -Command "cd td-backend; ./mvnw spring-boot:run"
start powershell -NoExit -Command "cd td-frontend; npm run dev"
echo Backend y Frontend lanzados en ventanas separadas.
pause