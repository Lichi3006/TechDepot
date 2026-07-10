@echo off
echo --- TechDepot: Iniciando Entorno de Desarrollo ---
echo.

:: Verificar SQL Server
echo [0/2] Verificando SQL Server...
sc query MSSQL$SQLEXPRESS >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=4" %%a in ('sc query MSSQL$SQLEXPRESS ^| findstr STATE') do (
        if "%%a"=="RUNNING" (
            echo   [OK] SQL Server ^(SQLEXPRESS^) esta corriendo.
        ) else (
            echo   [WARN] SQL Server esta detenido. Intentando iniciar...
            net start MSSQL$SQLEXPRESS >nul 2>&1
            if %errorlevel% equ 0 (
                echo   [OK] SQL Server iniciado correctamente.
            ) else (
                echo   [ERROR] No se pudo iniciar SQL Server. Ejecuta como Administrador.
                pause
                exit /b 1
            )
        )
    )
) else (
    sc query MSSQLSERVER >nul 2>&1
    if %errorlevel% equ 0 (
        echo   [OK] SQL Server ^(instancia por defecto^) encontrado.
    ) else (
        echo   [ERROR] No se encontro ninguna instancia de SQL Server.
        pause
        exit /b 1
    )
)

:: Iniciar SQL Browser si esta detenido
sc query SQLBrowser >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=4" %%a in ('sc query SQLBrowser ^| findstr STATE') do (
        if not "%%a"=="RUNNING" (
            echo   [INFO] Iniciando SQL Server Browser...
            net start SQLBrowser >nul 2>&1
        )
    )
)

echo.
echo [1/2] Lanzando Backend...
start powershell -NoExit -Command "cd td-backend; ./mvnw spring-boot:run"
echo [2/2] Lanzando Frontend...
start powershell -NoExit -Command "cd td-frontend; npm run dev -- --host"
echo.
echo Backend y Frontend lanzados en ventanas separadas.