# 🚀 Production Deployment Guide

This guide will help you deploy the Comprehensive Accounting System to your production server.

## 📋 Server Requirements

### Minimum Server Specifications
- **OS**: Ubuntu 20.04 LTS or CentOS 8+
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 20GB minimum, 50GB recommended
- **CPU**: 2 cores minimum
- **Network**: Stable internet connection

### Required Software
- Docker & Docker Compose
- Git
- Nginx (for reverse proxy)
- SSL Certificate (Let's Encrypt recommended)

## 🛠️ Server Setup

### 1. Update System
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 2. Install Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 3. Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Install Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Install Git
```bash
# Ubuntu/Debian
sudo apt install git -y

# CentOS/RHEL
sudo yum install git -y
```

## 🔧 Application Deployment

### 1. Clone Repository
```bash
cd /opt
sudo git clone https://github.com/your-username/comprehensive-accounting-system.git
sudo chown -R $USER:$USER comprehensive-accounting-system
cd comprehensive-accounting-system
```

### 2. Configure Environment
```bash
# Copy production environment template
cp backend/.env.example backend/.env

# Edit production configuration
nano backend/.env
```

**Production Environment Variables:**
```bash
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL="postgresql://accounting_user:secure_password@postgres:5432/accounting_db"

# JWT Configuration
JWT_SECRET="your-very-secure-jwt-secret-256-bits-minimum"
JWT_EXPIRE="7d"

# Application URLs
FRONTEND_URL="https://yourdomain.com"

# Redis Configuration
REDIS_URL="redis://:redis_password@redis:6379"

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/app/uploads

# Logging
LOG_LEVEL=info
LOG_FILE=/app/logs/app.log
```

### 3. Configure Docker Compose for Production
```bash
# Create production override
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  postgres:
    environment:
      POSTGRES_PASSWORD: your_secure_postgres_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups

  redis:
    command: redis-server --requirepass your_secure_redis_password
    volumes:
      - redis_data:/data

  backend:
    environment:
      NODE_ENV: production
      DATABASE_URL: "postgresql://accounting_user:your_secure_postgres_password@postgres:5432/accounting_db"
      REDIS_URL: "redis://:your_secure_redis_password@redis:6379"
      JWT_SECRET: "your-very-secure-jwt-secret"
    restart: unless-stopped

  frontend:
    environment:
      VITE_API_URL: https://yourdomain.com/api
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
EOF
```

### 4. Build and Start Services
```bash
# Build and start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for services to start (about 2-3 minutes)
docker-compose logs -f
```

### 5. Initialize Database
```bash
# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Seed initial data (optional)
docker-compose exec backend npx prisma db seed
```

## 🌐 Nginx Configuration

### 1. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/accounting-system
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Frontend (React App)
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API Documentation
    location /api-docs {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File uploads
    client_max_body_size 10M;
}
```

### 2. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/accounting-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Certificate Setup

### 1. Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### 2. Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Auto-Renewal Setup
```bash
sudo crontab -e

# Add this line for automatic renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🛡️ Security Hardening

### 1. Firewall Configuration
```bash
# Ubuntu (UFW)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. Create Non-Root User
```bash
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy
```

### 3. SSH Key Authentication
```bash
# Copy your public key to the server
ssh-copy-id deploy@your-server-ip

# Disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

## 📊 Monitoring and Maintenance

### 1. Service Status Check
```bash
# Check Docker services
docker-compose ps

# Check application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check Nginx status
sudo systemctl status nginx
```

### 2. Database Backup
```bash
# Manual backup
docker-compose exec postgres pg_dump -U accounting_user accounting_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

cd /opt/comprehensive-accounting-system
docker-compose exec -T postgres pg_dump -U accounting_user accounting_db > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup.sh

# Add to crontab for daily backup at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backup.sh") | crontab -
```

### 3. Log Rotation
```bash
sudo nano /etc/logrotate.d/accounting-system

# Add configuration
/opt/comprehensive-accounting-system/backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

## 🔄 Updates and Maintenance

### 1. Application Updates
```bash
cd /opt/comprehensive-accounting-system

# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Run any new migrations
docker-compose exec backend npx prisma migrate deploy
```

### 2. System Updates
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y

# Restart if kernel updated
sudo reboot
```

## 🆘 Troubleshooting

### Common Issues

**1. Docker Services Won't Start**
```bash
# Check Docker logs
docker-compose logs

# Restart Docker service
sudo systemctl restart docker
```

**2. Database Connection Issues**
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify database credentials
docker-compose exec postgres psql -U accounting_user -d accounting_db
```

**3. SSL Certificate Issues**
```bash
# Test SSL configuration
sudo nginx -t

# Renew certificate manually
sudo certbot renew --force-renewal
```

**4. Application Not Accessible**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check application ports
sudo netstat -tlnp | grep -E '(80|443|3000)'

# Test proxy configuration
curl -I http://localhost:3000/health
```

### Log Locations
- Application logs: `/opt/comprehensive-accounting-system/backend/logs/`
- Nginx logs: `/var/log/nginx/`
- Docker logs: `docker-compose logs [service_name]`

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review application logs for error messages
3. Ensure all prerequisites are installed correctly
4. Verify network connectivity and firewall settings

For additional support, please create an issue in the GitHub repository with:
- Server OS and version
- Error messages from logs
- Steps that led to the issue

---

**Happy Deploying! 🚀**