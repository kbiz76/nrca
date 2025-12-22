#!/bin/bash
# Docker Compose Test Script for NRCA Demo

set -e

echo "🐳 Testing NRCA Demo Docker Setup"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available."
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Stop any existing containers
echo "🧹 Cleaning up any existing containers..."
docker compose down 2>/dev/null || true

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Test backend health
echo "🏥 Testing backend health endpoint..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    docker compose logs backend
    exit 1
fi

# Test backend API
echo "🧪 Testing backend API..."
if curl -f http://localhost:8000/api/dashboard/summary?mode=stub > /dev/null 2>&1; then
    echo "✅ Backend API is working"
else
    echo "❌ Backend API test failed"
    docker compose logs backend
    exit 1
fi

# Test frontend
echo "🌐 Testing frontend..."
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend test failed"
    docker compose logs frontend
    exit 1
fi

echo ""
echo "🎉 All tests passed!"
echo ""
echo "📊 Access the application:"
echo "   - Dashboard: http://localhost:3000/?mode=stub"
echo "   - Integrations: http://localhost:3000/integrations?mode=stub"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "📋 View logs: docker compose logs -f"
echo "🛑 Stop containers: docker compose down"

