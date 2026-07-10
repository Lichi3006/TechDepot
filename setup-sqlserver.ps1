# =============================================
# TechDepot - SQL Server Setup Script
# =============================================
# Este script configura SQL Server Express para aceptar conexiones TCP/IP
# en el puerto 1433, que es lo que necesita el backend de Spring Boot.
#
# IMPORTANTE: Ejecutar como Administrador.
# =============================================

param(
    [int]$Port = 1433
)

Write-Host ""
Write-Host "  ----------------------------------------------" -ForegroundColor Cyan
Write-Host "      TechDepot - SQL Server Setup              " -ForegroundColor Cyan
Write-Host "  ----------------------------------------------" -ForegroundColor Cyan
Write-Host ""

# --- Verificar permisos de Administrador ---
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "  [ERROR] Este script necesita permisos de Administrador." -ForegroundColor Red
    Write-Host "  Haz clic derecho en PowerShell -> 'Ejecutar como administrador' e intentalo de nuevo." -ForegroundColor Red
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# --- Detectar instancia de SQL Server ---
Write-Host "[1/4] Detectando instancia de SQL Server..." -ForegroundColor Yellow

$instanceName = $null
$serviceName = $null
$regPath = $null

# Buscar SQLEXPRESS
$svc = Get-Service -Name 'MSSQL$SQLEXPRESS' -ErrorAction SilentlyContinue
if ($svc) {
    $instanceName = "SQLEXPRESS"
    $serviceName = "MSSQL`$SQLEXPRESS"
    # Buscar la ruta del registro dinamicamente
    $regBase = Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server" -ErrorAction SilentlyContinue |
        Where-Object { $_.PSChildName -match "MSSQL\d+\.$instanceName" } |
        Select-Object -First 1
    if ($regBase) {
        $regPath = "$($regBase.PSPath)\MSSQLServer\SuperSocketNetLib\Tcp\IPAll"
    }
}

# Buscar instancia por defecto si no hay Express
if (-not $instanceName) {
    $svc = Get-Service -Name 'MSSQLSERVER' -ErrorAction SilentlyContinue
    if ($svc) {
        $instanceName = "MSSQLSERVER"
        $serviceName = "MSSQLSERVER"
        $regBase = Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server" -ErrorAction SilentlyContinue |
            Where-Object { $_.PSChildName -match "MSSQL\d+\.MSSQLSERVER" } |
            Select-Object -First 1
        if ($regBase) {
            $regPath = "$($regBase.PSPath)\MSSQLServer\SuperSocketNetLib\Tcp\IPAll"
        }
    }
}

if (-not $instanceName) {
    Write-Host "  [ERROR] No se encontro ninguna instancia de SQL Server." -ForegroundColor Red
    Write-Host "  Instala SQL Server Express desde: https://www.microsoft.com/sql-server/sql-server-downloads" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "  [OK] Instancia encontrada: $instanceName" -ForegroundColor Green

# --- Configurar TCP/IP ---
Write-Host "[2/4] Configurando TCP/IP en el puerto $Port..." -ForegroundColor Yellow

if ($regPath) {
    try {
        # Asignar puerto estatico y desactivar puertos dinamicos
        Set-ItemProperty -Path $regPath -Name "TcpPort" -Value "$Port" -ErrorAction Stop
        Set-ItemProperty -Path $regPath -Name "TcpDynamicPorts" -Value "" -ErrorAction Stop
        
        # Habilitar el protocolo TCP/IP (muy importante, viene apagado por defecto)
        $tcpPath = $regPath.Replace("\IPAll", "")
        Set-ItemProperty -Path $tcpPath -Name "Enabled" -Value 1 -ErrorAction Stop
        
        Write-Host "  [OK] Puerto TCP/IP configurado y protocolo habilitado." -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] No se pudo configurar el puerto en el registro." -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} else {
    Write-Host "  [WARN] No se pudo encontrar la configuracion TCP/IP en el registro." -ForegroundColor DarkYellow
    Write-Host "  Configura TCP/IP manualmente en SQL Server Configuration Manager." -ForegroundColor DarkYellow
}

# --- Iniciar SQL Browser ---
Write-Host "[3/4] Configurando SQL Server Browser..." -ForegroundColor Yellow

$browser = Get-Service -Name 'SQLBrowser' -ErrorAction SilentlyContinue
if ($browser) {
    try {
        Set-Service -Name 'SQLBrowser' -StartupType Automatic -ErrorAction Stop
        if ($browser.Status -ne 'Running') {
            Start-Service -Name 'SQLBrowser' -ErrorAction Stop
        }
        Write-Host "  [OK] SQL Server Browser configurado e iniciado." -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] No se pudo iniciar SQL Browser: $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "  [INFO] SQL Server Browser no esta instalado (no es critico si usas puerto fijo)." -ForegroundColor Gray
}

# --- Reiniciar SQL Server ---
Write-Host "[4/4] Reiniciando SQL Server para aplicar cambios..." -ForegroundColor Yellow

try {
    Restart-Service -Name $serviceName -Force -ErrorAction Stop
    Start-Sleep -Seconds 2
    
    $svcCheck = Get-Service -Name $serviceName
    if ($svcCheck.Status -eq 'Running') {
        Write-Host "  [OK] SQL Server reiniciado correctamente." -ForegroundColor Green
    } else {
        Write-Host "  [WARN] SQL Server no parece estar corriendo. Verifica manualmente." -ForegroundColor DarkYellow
    }
} catch {
    Write-Host "  [ERROR] No se pudo reiniciar SQL Server: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# --- Verificar conectividad ---
Write-Host ""
Write-Host "  Verificando conexion..." -ForegroundColor Gray

$testResult = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
if ($testResult.TcpTestSucceeded) {
    # --- 6. Crear base de datos ---
    Write-Host "  [5/5] Preparando la base de datos..." -ForegroundColor Yellow
    if (Get-Command "sqlcmd" -ErrorAction SilentlyContinue) {
        Write-Host "  Ejecutando TechDepotTablesQuery.sql..." -ForegroundColor Cyan
        try {
            $sqlQueryPath = Join-Path $PSScriptRoot "database" "TechDepotTablesQuery.sql"
            if (Test-Path $sqlQueryPath) {
                # Execute with -f 65001 to ensure UTF-8 characters are inserted correctly
                sqlcmd -S "localhost,$Port" -E -i $sqlQueryPath -f 65001 -b -m 1 | Out-Null
                Write-Host "  [OK] Base de datos creada/actualizada exitosamente." -ForegroundColor Green
            } else {
                Write-Host "  [WARN] No se encontro el archivo de base de datos ($sqlQueryPath)." -ForegroundColor DarkYellow
            }
        } catch {
            Write-Host "  [ERROR] Hubo un problema al crear la base de datos." -ForegroundColor Red
            Write-Host "  Puedes crearla manualmente abriendo SSMS y ejecutando 'database/TechDepotTablesQuery.sql'." -ForegroundColor Red
        }
    } else {
        Write-Host "  [WARN] 'sqlcmd' no esta disponible. Crea la base de datos manualmente en SSMS usando 'database/TechDepotTablesQuery.sql'." -ForegroundColor DarkYellow
    }

    Write-Host ""
    Write-Host "  ╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "  ║                 ¡CONFIGURACION COMPLETADA!                 ║" -ForegroundColor Green
    Write-Host "  ║  SQL Server ya esta listo. Ahora puedes ejecutar:          ║" -ForegroundColor Green
    Write-Host "  ║  .\dev.ps1                                                 ║" -ForegroundColor Green
    Write-Host "  ╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "  [WARN] El puerto $Port no responde todavia." -ForegroundColor DarkYellow
    Write-Host "  SQL Server puede tardar unos segundos en arrancar." -ForegroundColor DarkYellow
    Write-Host "  Intenta de nuevo en unos momentos, o verifica en SQL Server Configuration Manager" -ForegroundColor DarkYellow
    Write-Host "  que TCP/IP este habilitado en 'Protocols for $instanceName'." -ForegroundColor DarkYellow
}

Write-Host ""
Read-Host "Presiona Enter para salir"
