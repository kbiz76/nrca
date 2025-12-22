# Docker Compose Test Script for NRCA Demo (PowerShell)

Write-Host "🐳 Testing NRCA Demo Docker Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
try {
    $composeVersion = docker compose version 2>&1
    Write-Host "✅ Docker Compose is available: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Stop any existing containers
Write-Host "🧹 Cleaning up any existing containers..." -ForegroundColor Yellow
docker compose down 2>$null

# Build and start containers
Write-Host "🔨 Building and starting containers..." -ForegroundColor Yellow
docker compose up --build -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test backend health
Write-Host "🏥 Testing backend health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend health check failed" -ForegroundColor Red
    docker compose logs backend
    exit 1
}

# Test backend API
Write-Host "🧪 Testing backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/dashboard/summary?mode=stub" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend API is working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend API test failed" -ForegroundColor Red
    docker compose logs backend
    exit 1
}

# Test frontend
Write-Host "🌐 Testing frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend test failed" -ForegroundColor Red
    docker compose logs frontend
    exit 1
}

Write-Host ""
Write-Host "🎉 All tests passed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Access the application:" -ForegroundColor Cyan
Write-Host "   - Dashboard: http://localhost:3000/?mode=stub"
Write-Host "   - Integrations: http://localhost:3000/integrations?mode=stub"
Write-Host "   - API Docs: http://localhost:8000/docs"
Write-Host ""
Write-Host "📋 View logs: docker compose logs -f" -ForegroundColor Yellow
Write-Host "🛑 Stop containers: docker compose down" -ForegroundColor Yellow

