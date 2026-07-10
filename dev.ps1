# TechDepot - Unified Dev Runner
Write-Host ""
Write-Host "  ╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║   TechDepot - Entorno de Desarrollo        ║" -ForegroundColor Cyan
Write-Host "  ╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 0. Verificar SQL Server
Write-Host "[0/2] Verificando SQL Server..." -ForegroundColor Yellow

$sqlService = Get-Service -Name 'MSSQL$SQLEXPRESS' -ErrorAction SilentlyContinue
if (-not $sqlService) {
    $sqlService = Get-Service -Name 'MSSQLSERVER' -ErrorAction SilentlyContinue
}

if (-not $sqlService) {
    Write-Host "  [ERROR] No se encontro ninguna instancia de SQL Server instalada." -ForegroundColor Red
    Write-Host "  Instala SQL Server Express o Developer edition antes de continuar." -ForegroundColor Red
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

if ($sqlService.Status -ne 'Running') {
    Write-Host "  [WARN] SQL Server ($($sqlService.Name)) esta detenido. Intentando iniciar..." -ForegroundColor DarkYellow
    try {
        Start-Service -Name $sqlService.Name -ErrorAction Stop
        Write-Host "  [OK] SQL Server iniciado correctamente." -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] No se pudo iniciar SQL Server. Intenta ejecutar este script como Administrador." -ForegroundColor Red
        Write-Host "  Tambien puedes iniciar el servicio manualmente desde 'services.msc'." -ForegroundColor Red
        Write-Host ""
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} else {
    Write-Host "  [OK] SQL Server ($($sqlService.Name)) esta corriendo." -ForegroundColor Green
}

# Verificar SQL Browser (necesario para instancias nombradas sin TCP/IP fijo)
$browserService = Get-Service -Name 'SQLBrowser' -ErrorAction SilentlyContinue
if ($browserService -and $browserService.Status -ne 'Running') {
    Write-Host "  [WARN] SQL Server Browser esta detenido. Intentando iniciar..." -ForegroundColor DarkYellow
    try {
        Start-Service -Name 'SQLBrowser' -ErrorAction Stop
        Write-Host "  [OK] SQL Server Browser iniciado (necesario para instancias nombradas)." -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] No se pudo iniciar SQL Browser. Si usas una instancia nombrada (SQLEXPRESS)," -ForegroundColor DarkYellow
        Write-Host "         la conexion podria fallar. Inicialo manualmente desde 'services.msc'." -ForegroundColor DarkYellow
    }
}

Write-Host ""

# 1. Preparar Backend
Write-Host "[1/3] Preparando Backend (Spring Boot)..." -ForegroundColor Yellow
$propsPath = "td-backend/src/main/resources/application.properties"
$propsExample = "td-backend/src/main/resources/application.properties.example"
if (-not (Test-Path $propsPath)) {
    Write-Host "  [INFO] Creando application.properties a partir del ejemplo..." -ForegroundColor Cyan
    Copy-Item $propsExample $propsPath
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd td-backend; ./mvnw spring-boot:run"

# 2. Preparar Frontend
Write-Host "[2/3] Preparando Frontend (Vite)..." -ForegroundColor Yellow
if (-not (Test-Path "td-frontend/node_modules")) {
    Write-Host "  [INFO] Instalando dependencias de Node.js (esto puede tardar la primera vez)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-Wait", "-NoExit", "-Command", "cd td-frontend; npm install; exit" -Wait
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd td-frontend; npm run dev -- --host"

# 3. Listo
Write-Host ""
Write-Host "¡Todo listo! Se han abierto dos terminales independientes." -ForegroundColor Green
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "Podes cerrar esta ventana. Los procesos seguiran corriendo en las nuevas terminales."
