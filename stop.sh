#!/bin/bash

echo "⏹️  Stopping TransitOps360 Development Environment"
echo ""

# Stop backend
if [ -f backend.pid ]; then
    echo "Stopping backend..."
    kill $(cat backend.pid) 2>/dev/null
    rm backend.pid
fi

# Stop frontend
if [ -f frontend.pid ]; then
    echo "Stopping frontend..."
    kill $(cat frontend.pid) 2>/dev/null
    rm frontend.pid
fi

# Stop PostgreSQL
echo "Stopping PostgreSQL..."
docker-compose down

echo ""
echo "✅ All services stopped"
