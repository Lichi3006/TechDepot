Write-Host "========================================="
Write-Host "[*] BUILDING TECHDEPOT (STANDALONE)"
Write-Host "========================================="

# 1. Compile Frontend
Write-Host "`n[1/3] Compiling Frontend (React)..."
cd td-frontend
npm ci --silent --no-audit --no-fund
npm run build --silent
cd ..

# 2. Move Frontend to Backend
Write-Host "`n[2/3] Injecting Frontend into Spring Boot..."
$staticDir = "td-backend/src/main/resources/static"
if (Test-Path $staticDir) {
    Remove-Item -Recurse -Force $staticDir
}
New-Item -ItemType Directory -Force -Path $staticDir | Out-Null
Copy-Item -Recurse -Force "td-frontend/dist/*" $staticDir

# 3. Package Backend
Write-Host "`n[3/3] Packaging Executable (Java)..."

$keystorePath = "td-backend/src/main/resources/keystore.p12"
if (-Not (Test-Path $keystorePath)) {
    Write-Host "  -> Generating self-signed SSL certificate for HTTPS..."
    keytool -genkeypair -alias techdepot -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore $keystorePath -validity 3650 -storepass "TechDepotSSL" -dname "CN=localhost, OU=Dev, O=TechDepot, L=City, S=State, C=US"
}

$propsPath = "td-backend/src/main/resources/application.properties"
$examplePath = "td-backend/src/main/resources/application.properties.example"
if (-Not (Test-Path $propsPath)) {
    Write-Host "  -> Auto-generating application.properties from template..."
    Copy-Item $examplePath $propsPath
}

cd td-backend
./mvnw clean package -DskipTests
cd ..

# Copy the final file to the root for convenience
Copy-Item "td-backend/target/*.jar" "TechDepot-Portable.jar"

Write-Host "`n========================================="
Write-Host "[OK] BUILD COMPLETED"
Write-Host "The final file is: TechDepot-Portable.jar"
Write-Host "========================================="
