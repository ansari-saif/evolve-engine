# Docker Compose Setup for Evolve Engine

This Docker Compose configuration sets up the complete Evolve Engine application with all necessary services.

## Development vs Production

- **Single File**: Use `docker-compose.yml` for both development and production
- **Environment Variables**: Control the environment via `.env` file
- **Build Arguments**: Dockerfiles automatically adapt based on environment variables

## Services

- **Backend**: FastAPI application (Python 3.11) - connects to managed PostgreSQL
- **Frontend**: React application (Node.js 18)

## Setup

### Development Setup

1. **Configure your environment:**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit .env and add your managed PostgreSQL connection string
   # DATABASE_URL=postgresql://username:password@host:port/database
   ```

### Production Setup

1. **Configure production environment:**
   ```bash
   # Copy the production environment template
   cp env.prod.example .env
   
       # Edit .env with your production values
    # Generate strong secrets for production use
    # VITE_API_URL uses backend service name for internal communication
   ```

## Quick Start

### Development

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

### Production

1. **Build and start production services:**
   ```bash
   # Set production environment variables
   export ENVIRONMENT=production
   export NODE_ENV=production
   
   # Start services
   docker-compose up -d --build
   ```

2. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Access Points

- **Frontend**: http://localhost:3000 (external access)
- **Backend API**: http://localhost:8000 (external access)
- **Internal Communication**: Frontend → Backend via `http://backend:8000`
- **Database**: Managed PostgreSQL (configured via DATABASE_URL)

## Development Workflow

### Starting Development
```bash
# Start all services in detached mode
docker-compose up -d

# Or start with logs visible
docker-compose up
```

### Rebuilding Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Production rebuild
ENVIRONMENT=production NODE_ENV=production docker-compose build
```

### Running Commands in Containers
```bash
# Backend commands
docker-compose exec backend python -m pytest
docker-compose exec backend alembic upgrade head

# Frontend commands
docker-compose exec frontend yarn lint
docker-compose exec frontend yarn build
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Seed database
docker-compose exec backend python seed_db.py
```

## Environment Variables

The services use the following environment variables:

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `PYTHONPATH`: Python path for imports

### Frontend
- `VITE_API_URL`: Backend API URL for frontend requests

### Database
- `DATABASE_URL`: Your managed PostgreSQL connection string

## Volumes

- Backend and frontend code are mounted for live development

## Networks

All services are connected through the `evolve_network` bridge network for internal communication.

## Production Features

### Backend Production Optimizations
- Multi-stage build for smaller image size
- Non-root user for security
- Health checks with curl
- Resource limits and reservations
- Production-ready uvicorn with multiple workers
- Optimized Python environment

### Frontend Production Optimizations
- Multi-stage build with nginx serving
- Static file optimization and caching
- Gzip compression
- Security headers
- Client-side routing support
- API proxy configuration
- Non-root nginx user
- Health checks

### Security Features
- Non-root users in both containers
- Security headers in nginx
- Resource limits to prevent DoS
- Health checks for monitoring
- Environment variable configuration

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 8000 are available
2. **Database connection**: Ensure your DATABASE_URL is correctly configured
3. **Permission issues**: Run with appropriate user permissions
4. **Build failures**: Check Dockerfile syntax and dependencies
5. **Environment variables**: Ensure ENVIRONMENT and NODE_ENV are set correctly

### Reset Everything
```bash
# Development
docker-compose down -v --remove-orphans
docker system prune -a
docker-compose up --build

# Production
ENVIRONMENT=production NODE_ENV=production docker-compose down -v --remove-orphans
docker system prune -a
ENVIRONMENT=production NODE_ENV=production docker-compose up --build
```

### View Service Status
```bash
docker-compose ps
```

### Check Service Health
```bash
# External access
curl http://localhost:8000/health
curl http://localhost:3000

# Internal container access
docker-compose exec frontend curl http://backend:8000/health
```
