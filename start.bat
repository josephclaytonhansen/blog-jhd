@echo off
REM Quick Start Script for Blog Application (Windows)
REM This script helps you get started quickly with the Docker setup

echo 🚀 Blog Application Quick Start
echo ===============================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your actual values before continuing!
    echo    Important: Set GITHUB_TOKEN, JWT_SECRET, and other required values
    pause
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "nginx\logs" mkdir "nginx\logs"
if not exist "backups" mkdir "backups"
if not exist "mongodb\init" mkdir "mongodb\init"

echo.
echo Select deployment mode:
echo 1) Development (with hot reload)
echo 2) Production (optimized build)
echo 3) Build automation only
echo 4) Commit automation only

set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" (
    echo 🔨 Starting in development mode...
    docker-compose up -d --build
    echo ✅ Development environment started!
    echo    Frontend: http://localhost:5173
    echo    Backend API: http://localhost:3720
    echo    MongoDB: localhost:27017
) else if "%choice%"=="2" (
    echo 🏭 Starting in production mode...
    docker-compose --profile production up -d --build
    echo ✅ Production environment started!
    echo    Application: http://localhost
    echo    HTTPS: https://localhost (if SSL configured)
) else if "%choice%"=="3" (
    echo 🤖 Running build automation...
    docker-compose --profile buildbot up --build buildbot
    echo ✅ Build automation completed!
) else if "%choice%"=="4" (
    echo 📝 Running commit automation...
    docker-compose --profile commit up --build commit-bot
    echo ✅ Commit automation completed!
) else (
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo 📊 Container Status:
docker-compose ps

echo.
echo 📋 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart: docker-compose restart
echo    Update: git pull ^&^& docker-compose up -d --build

echo.
echo 🎉 Setup complete! Check the logs if you encounter any issues.
pause