# Deployment Guide

## 🚀 Overview

This guide covers deploying the Insurance Testing Platform to production environments, including infrastructure setup, configuration management, and operational considerations.

## 📋 Prerequisites

### Infrastructure Requirements
- **CPU**: 2+ cores minimum, 4+ recommended
- **Memory**: 4GB minimum, 8GB recommended
- **Storage**: 50GB minimum, 100GB+ recommended
- **Network**: Stable internet connection for external API access

### Software Requirements
- **Operating System**: Linux (Ubuntu 20.04+) or Windows Server 2019+
- **Python**: 3.9+ with pip
- **Node.js**: 18+ with npm
- **Database**: PostgreSQL 13+ (recommended) or MySQL 8+
- **Reverse Proxy**: Nginx or Apache
- **SSL Certificate**: For HTTPS (Let's Encrypt or commercial)

### External Services
- **Insurance APIs**: Access to target insurance company APIs
- **AI Service**: Hugging Face API token (optional, local fallback available)
- **Monitoring**: Optional (Prometheus, Grafana, etc.)

## 🏗️ Deployment Architecture

### Production Architecture
```
Internet
    ↓
Load Balancer (Nginx/HAProxy)
    ↓
Application Servers (FastAPI + Gunicorn)
    ↓
Database (PostgreSQL)
    ↓
Storage (File System / S3)
```

### Development/Staging Architecture
```
Developer → Docker Compose → Local Containers
```

## 🐳 Docker Deployment (Recommended)

### Dockerfile (Backend)
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app
ENV DATA_DIR=/app/data

# Run application
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

### Dockerfile (Frontend)
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/insurance_testing
      - HUGGINGFACE_TOKEN=${HUGGINGFACE_TOKEN}
      - DATA_DIR=/app/data
    volumes:
      - ./data:/app/data
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=insurance_testing
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deployment Commands
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update services
docker-compose pull
docker-compose up -d --force-recreate
```

## 🖥️ Manual Deployment

### Backend Deployment

1. **Environment Setup**
```bash
# Create application user
sudo useradd -m -s /bin/bash insurance-test

# Create application directory
sudo mkdir -p /opt/insurance-testing
sudo chown insurance-test:insurance-test /opt/insurance-testing

# Switch to application user
sudo su - insurance-test
```

2. **Application Setup**
```bash
# Clone repository
cd /opt/insurance-testing
git clone <repository-url> .

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Install production server
pip install gunicorn
```

3. **Configuration**
```bash
# Create environment file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/insurance_testing
HUGGINGFACE_TOKEN=your_token_here
DATA_DIR=/opt/insurance-testing/data
API_HOST=0.0.0.0
API_PORT=8000
EOF

# Create data directory
mkdir -p data/{users,configs,tests,cache}
```

4. **Systemd Service**
```bash
# Create service file
sudo cat > /etc/systemd/system/insurance-testing-backend.service << EOF
[Unit]
Description=Insurance Testing Platform Backend
After=network.target

[Service]
Type=exec
User=insurance-test
Group=insurance-test
WorkingDirectory=/opt/insurance-testing
Environment=PATH=/opt/insurance-testing/venv/bin
ExecStart=/opt/insurance-testing/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable insurance-testing-backend
sudo systemctl start insurance-testing-backend
```

### Frontend Deployment

1. **Build Application**
```bash
cd frontend
npm install
npm run build
```

2. **Nginx Configuration**
```bash
# Install nginx
sudo apt update && sudo apt install nginx

# Create nginx config
sudo cat > /etc/nginx/sites-available/insurance-testing << EOF
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Frontend static files
    location / {
        root /opt/insurance-testing/frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # API documentation
    location /docs {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/insurance-testing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate Setup (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🗄️ Database Setup

### PostgreSQL Installation
```bash
# Install PostgreSQL
sudo apt update && sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE insurance_testing;
CREATE USER insurance_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE insurance_testing TO insurance_user;
\q
```

### Database Migration
```bash
# Run migration scripts
cd /opt/insurance-testing
python -m app.db.migrations
```

## 📊 Monitoring Setup

### Health Check Endpoint
```python
# Add to main.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }
```

### Prometheus Metrics (Optional)
```python
# Add to requirements.txt: prometheus-client

from prometheus_client import Counter, Histogram, generate_latest

# Metrics
REQUEST_COUNT = Counter('requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('request_duration_seconds', 'Request duration')

@app.middleware("http")
async def metrics_middleware(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_DURATION.observe(duration)
    
    return response

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

### Grafana Dashboard
- Create dashboard with metrics:
  - Request rate and duration
  - Test execution success rate
  - Database connection pool
  - Memory and CPU usage

## 🔒 Security Configuration

### Firewall Setup
```bash
# Configure UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 8000  # Only allow through nginx
```

### Application Security
```python
# Security middleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["your-domain.com", "*.your-domain.com"]
)
```

### Environment Variables
```bash
# Never commit secrets to git
# Use environment variables or secret management
export DATABASE_URL="postgresql://user:password@host:5432/db"
export HUGGINGFACE_TOKEN="your_token"
export SECRET_KEY="your-secret-key"
```

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/insurance-testing
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

## 🔧 Configuration Management

### Environment-Specific Configs
```bash
# config/production.json
{
  "database": {
    "url": "postgresql://user:password@prod-db:5432/insurance_testing",
    "pool_size": 20,
    "max_overflow": 30
  },
  "api": {
    "host": "0.0.0.0",
    "port": 8000,
    "workers": 4
  },
  "security": {
    "secret_key": "production-secret",
    "allowed_hosts": ["your-domain.com"]
  }
}
```

### Configuration Loading
```python
# app/core/config.py
import json
import os
from typing import Dict, Any

class Config:
    def __init__(self, env: str = "production"):
        self.env = env
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        config_file = f"config/{self.env}.json"
        with open(config_file) as f:
            return json.load(f)
    
    def get(self, key: str, default=None):
        keys = key.split('.')
        value = self.config
        for k in keys:
            value = value.get(k, {})
        return value if value != {} else default
```

## 📈 Performance Optimization

### Gunicorn Configuration
```bash
# gunicorn.conf.py
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
preload_app = True
```

### Database Optimization
```sql
-- PostgreSQL performance tuning
-- Add to postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

### Caching Strategy
```python
# Redis caching
import redis
import json
from typing import Optional

class CacheService:
    def __init__(self):
        self.redis = redis.Redis(host='redis', port=6379, db=0)
    
    async def get(self, key: str) -> Optional[Dict]:
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    async def set(self, key: str, value: Dict, ttl: int = 3600):
        self.redis.setex(key, ttl, json.dumps(value))
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U insurance_user -d insurance_testing

# View logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### 2. Nginx 502 Bad Gateway
```bash
# Check if backend is running
curl http://localhost:8000/health

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check nginx configuration
sudo nginx -t
```

#### 3. High Memory Usage
```bash
# Monitor memory usage
htop
free -h

# Check application processes
ps aux | grep gunicorn
```

### Log Locations
- **Application logs**: `/var/log/insurance-testing/`
- **Nginx logs**: `/var/log/nginx/`
- **Database logs**: `/var/log/postgresql/`
- **System logs**: `journalctl -u insurance-testing-backend`

## 🚀 Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/postgres"
DB_NAME="insurance_testing"

# Create backup
pg_dump -h localhost -U insurance_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove old backups (keep 7 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Add to crontab: 0 2 * * * /path/to/backup.sh
```

### Application Data Backup
```bash
# Backup application data
rsync -av /opt/insurance-testing/data/ /backup/data/
```

---

This deployment guide provides comprehensive instructions for deploying the Insurance Testing Platform to production environments. Adjust configurations based on your specific infrastructure and requirements.