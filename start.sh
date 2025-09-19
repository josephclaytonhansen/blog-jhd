#!/bin/bash

# Quick Start Script for Blog Application
# This script helps you get started quickly with the Docker setup

set -e

echo "🚀 Blog Application Quick Start"
echo "==============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual values before continuing!"
    echo "   Important: Set GITHUB_TOKEN, JWT_SECRET, and other required values"
    read -p "Press Enter after you've edited the .env file..."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/logs
mkdir -p backups
mkdir -p mongodb/init

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh 2>/dev/null || true

# Choose deployment mode
echo ""
echo "Select deployment mode:"
echo "1) Development (with hot reload)"
echo "2) Production (optimized build)"
echo "3) Build automation only"
echo "4) Commit automation only"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🔨 Starting in development mode..."
        docker-compose up -d --build
        echo "✅ Development environment started!"
        echo "   Frontend: http://localhost:5173"
        echo "   Backend API: http://localhost:3720"
        echo "   MongoDB: localhost:27017"
        ;;
    2)
        echo "🏭 Starting in production mode..."
        docker-compose --profile production up -d --build
        echo "✅ Production environment started!"
        echo "   Application: http://localhost"
        echo "   HTTPS: https://localhost (if SSL configured)"
        ;;
    3)
        echo "🤖 Running build automation..."
        docker-compose --profile buildbot up --build buildbot
        echo "✅ Build automation completed!"
        ;;
    4)
        echo "📝 Running commit automation..."
        docker-compose --profile commit up --build commit-bot
        echo "✅ Commit automation completed!"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Show running containers
echo ""
echo "📊 Container Status:"
docker-compose ps

# Show logs command
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Update: git pull && docker-compose up -d --build"

echo ""
echo "🎉 Setup complete! Check the logs if you encounter any issues."