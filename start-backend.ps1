# PowerShell script to start MongoDB and Backend

Write-Host "🚀 Starting Pokemon Backend Services..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop first, then run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Start MongoDB
Write-Host "📦 Starting MongoDB..." -ForegroundColor Cyan
docker-compose up -d mongodb

Start-Sleep -Seconds 3

# Check if MongoDB is ready
$mongoReady = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $mongo = New-Object System.Net.Sockets.TcpClient
        $mongo.Connect("localhost", 27017)
        $mongo.Close()
        $mongoReady = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

if ($mongoReady) {
    Write-Host "✅ MongoDB is ready" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB might still be starting..." -ForegroundColor Yellow
}

Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend..." -ForegroundColor Cyan
docker-compose up -d --build backend

Start-Sleep -Seconds 3

# Check backend status
Write-Host ""
Write-Host "🔍 Checking backend status..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Backend is running! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Backend API: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📡 Search endpoint: http://localhost:3000/api/pokemon/search" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Backend might still be starting. Check logs with: docker-compose logs backend" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Done! Services are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f backend" -ForegroundColor White
Write-Host ""
Write-Host "To stop services:" -ForegroundColor Cyan
Write-Host "  docker-compose down" -ForegroundColor White

