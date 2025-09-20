# 🐳 Docker Configuration Guide

## Overview
This document explains the Docker setup for the Comprehensive Accounting System with production-ready configurations.

## 🚀 Quick Start

### Development Mode
```bash
# Start development environment
npm run docker:dev

# Or with rebuild
npm run docker:dev:build
```

### Production Mode
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your production values

# Start production environment
npm run docker:prod

# View logs
npm run docker:logs
```

## 📋 Services

### 🗄️ PostgreSQL Database
- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Volume**: `postgres_data`
- **Health Check**: Enabled
- **Features**: UTF-8 encoding, Persian locale support

### 🔄 Redis Cache
- **Image**: `redis:7-alpine`
- **Port**: `6379`
- **Volume**: `redis_data`
- **Features**: Password protection, AOF persistence, memory optimization

### 🚀 Backend API
- **Build**: Custom Node.js image
- **Port**: `3000`
- **Features**: 
  - Health checks
  - File uploads
  - Logging
  - Environment-based configuration

### 🌐 Frontend Web App
- **Build**: Custom Nginx image
- **Ports**: `80`, `443` (SSL ready)
- **Features**:
  - Persian/RTL support
  - Production optimized
  - SSL configuration ready

### 💾 Backup Service (Optional)
- **Schedule**: Daily automatic backups
- **Retention**: 30 days
- **Location**: `./backups` directory
- **Features**: Compressed backups, cleanup automation

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Essential Configuration
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://accounting_user:accounting_password@postgres:5432/accounting_db
REDIS_URL=redis://:redis_password@redis:6379

# Optional Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### SSL Configuration (Production)
1. Place SSL certificates in `./ssl/` directory:
   ```
   ./ssl/cert.pem
   ./ssl/key.pem
   ```

2. Update nginx configuration in frontend Dockerfile

## 📚 Available Commands

### Docker Management
```bash
# Build all services
npm run docker:build

# Start services (detached)
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Development mode
npm run docker:dev

# Production with backup
npm run docker:prod

# Clean everything (careful!)
npm run docker:clean
```

### Database Operations
```bash
# Manual backup
npm run docker:backup

# Connect to database
docker-compose exec postgres psql -U accounting_user -d accounting_db

# Restore from backup
gunzip -c ./backups/accounting_backup_YYYYMMDD_HHMMSS.sql.gz | docker-compose exec -T postgres psql -U accounting_user -d accounting_db
```

### Service Management
```bash
# Restart specific service
docker-compose restart backend

# Scale service (if stateless)
docker-compose up -d --scale backend=2

# View service logs
docker-compose logs -f backend

# Execute command in running container
docker-compose exec backend npm run migrate
```

## 🔍 Monitoring & Health Checks

### Health Check Endpoints
- **Backend**: `http://localhost:3000/health`
- **Frontend**: `http://localhost:80`
- **Database**: Built-in PostgreSQL check
- **Redis**: Built-in Redis ping

### Monitoring
```bash
# Service status
docker-compose ps

# Resource usage
docker stats

# Service logs
docker-compose logs --tail=50 -f
```

## 🛠️ Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check database health
docker-compose exec postgres pg_isready -U accounting_user

# View database logs
docker-compose logs postgres
```

**Backend Won't Start**
```bash
# Check environment variables
docker-compose exec backend printenv

# View backend logs
docker-compose logs backend

# Debug mode
docker-compose exec backend npm run dev
```

**Frontend Build Issues**
```bash
# Rebuild frontend
docker-compose up --build frontend

# Check nginx config
docker-compose exec frontend nginx -t
```

### Performance Optimization

**Memory Usage**
- PostgreSQL: Default 128MB shared_buffers
- Redis: 256MB max memory with LRU eviction
- Backend: Node.js with cluster mode

**Storage**
- Use named volumes for data persistence
- Regular backup cleanup (30-day retention)
- Log rotation configured

## 🔐 Security Features

### Network Security
- Custom bridge network isolation
- Service-to-service communication only
- No unnecessary port exposure

### Data Security
- Encrypted database connections
- Redis password authentication  
- JWT token validation
- File upload restrictions

### SSL/TLS Ready
- SSL certificate mounting
- HTTPS redirect configuration
- Secure headers in nginx

## 📦 Backup & Restore

### Automatic Backups
- Daily scheduled backups
- 30-day retention policy
- Compressed storage
- Health monitoring

### Manual Operations
```bash
# Create backup
docker-compose exec postgres pg_dump -U accounting_user accounting_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U accounting_user -d accounting_db < backup.sql
```

## 🌐 Production Deployment

### Prerequisites
1. Docker Engine 20.10+
2. Docker Compose 2.0+
3. SSL certificates (for HTTPS)
4. Domain name configuration

### Deployment Steps
1. Clone repository
2. Copy and configure `.env`
3. Generate SSL certificates
4. Run `npm run docker:prod`
5. Configure reverse proxy (if needed)

### Maintenance
- Monitor logs regularly
- Update images periodically
- Backup database frequently
- Monitor disk space

This Docker configuration provides a production-ready, scalable, and maintainable setup for the Persian accounting system with automatic backups, health monitoring, and development convenience.