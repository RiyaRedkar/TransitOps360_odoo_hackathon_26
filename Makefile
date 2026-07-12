.PHONY: help install dev stop clean test

help:
	@echo "TransitOps360 Development Commands"
	@echo ""
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start all services (PostgreSQL, Backend, Frontend)"
	@echo "  make stop       - Stop all services"
	@echo "  make clean      - Clean generated files"
	@echo "  make test       - Run all tests"
	@echo ""

install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Done!"

dev:
	@echo "Starting all services..."
	docker-compose up -d

stop:
	@echo "Stopping all services..."
	docker-compose down

clean:
	@echo "Cleaning Python cache..."
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find backend -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "Cleaning frontend build..."
	rm -rf frontend/dist 2>/dev/null || true
	@echo "Done!"

test:
	@echo "Running backend tests..."
	cd backend && pytest
	@echo "Running frontend tests..."
	cd frontend && npm run test
