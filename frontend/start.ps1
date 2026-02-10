# Quick Start Script for Photo Retriever Frontend

Write-Host "🚀 Photo Retriever Frontend - Quick Start" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

# Check for .env.local file
if (!(Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✓ .env.local created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Please update NEXT_PUBLIC_API_URL in .env.local with your backend URL" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✓ .env.local exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available commands:" -ForegroundColor White
Write-Host "  npm run dev      - Start development server (http://localhost:3000)" -ForegroundColor Gray
Write-Host "  npm run build    - Build for production" -ForegroundColor Gray
Write-Host "  npm start        - Start production server" -ForegroundColor Gray
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host ""

npm run dev
