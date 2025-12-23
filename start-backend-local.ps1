# PowerShell script to start Backend locally (requires MongoDB to be running)

Write-Host "🚀 Starting Pokemon Backend (Local Mode)..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "🔍 Checking MongoDB connection..." -ForegroundColor Cyan
try {
    $mongo = New-Object System.Net.Sockets.TcpClient
    $mongo.Connect("localhost", 27017)
    $mongo.Close()
    Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB is NOT running on port 27017" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start MongoDB first:" -ForegroundColor Yellow
    Write-Host "  Option 1: Start Docker Desktop and run: docker-compose up -d mongodb" -ForegroundColor White
    Write-Host "  Option 2: Start MongoDB service locally" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""

# Navigate to backend directory
Set-Location backend

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Cyan
    @"
MONGO_URI=mongodb://localhost:27017/pokemon
PORT=3000
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Starting backend server..." -ForegroundColor Cyan
Write-Host ""

# Start the backend
npm start

