---
title: Deployment
description: Production deployment guides for UnifyRoute
weight: 7
---

## Docker Deployment

### Using Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  unifyroute:
    build: .
    ports:
      - "6565:6565"
    environment:
      - SERVER_HOST=0.0.0.0
      - SERVER_PORT=6565
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=sqlite:///./unifyroute.db
      - JWT_SECRET=${JWT_SECRET}
      - MASTER_PASSWORD=${MASTER_PASSWORD}
    volumes:
      - ./config.yaml:/app/config.yaml
      - ./unifyroute.db:/app/unifyroute.db
      - ./logs:/app/logs
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6565/health"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  redis_data:
```

Deploy:

```bash
# Set environment variables
export JWT_SECRET=your-secret-key
export MASTER_PASSWORD=your-master-password

# Start services
docker-compose up -d

# Check status
docker-compose logs -f unifyroute

# Stop services
docker-compose down
```

## Kubernetes Deployment

### Helm Chart

Create `values.yaml`:

```yaml
replicaCount: 3

image:
  repository: unifyroute/unifyroute
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: LoadBalancer
  port: 80
  targetPort: 6565

ingress:
  enabled: true
  hostname: unifyroute.example.com
  tls:
    enabled: true
    certIssuer: letsencrypt-prod

resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 2
    memory: 2Gi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

redis:
  enabled: true
  replica: 3

postgresql:
  enabled: true
  auth:
    postgresPassword: secure-password

persistence:
  enabled: true
  size: 10Gi
```

Deploy:

```bash
# Add Helm repo
helm repo add unifyroute https://charts.unifyroute.io
helm repo update

# Install
helm install unifyroute unifyroute/unifyroute \
  -f values.yaml \
  -n unifyroute \
  --create-namespace

# Upgrade
helm upgrade unifyroute unifyroute/unifyroute -f values.yaml

# Check status
kubectl -n unifyroute get pods
```

## Manual Deployment

### 1. Server Setup

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install python3.11 python3.11-venv \
  nodejs npm redis-server

# Create application user
sudo useradd -m -s /bin/bash unifyroute
sudo su - unifyroute

# Clone repository
git clone https://github.com/unifyroute/UnifyRoute.git
cd UnifyRoute

# Setup Python environment
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Node dependencies
npm install
```

### 2. Configuration

```bash
# Copy config
cp sample.env .env

# Generate secure keys
python -c "import secrets; print(secrets.token_urlsafe(32))" > .jwt_secret
python -c "import secrets; print(secrets.token_urlsafe(32))" > .master_password

# Update .env
nano .env
# Update with generated keys and database paths
```

### 3. Systemd Service

Create `/etc/systemd/system/unifyroute.service`:

```ini
[Unit]
Description=UnifyRoute LLM Gateway
After=network.target redis-server.service postgresql.service
Wants=redis-server.service postgresql.service

[Service]
Type=notify
User=unifyroute
WorkingDirectory=/home/unifyroute/UnifyRoute
Environment="PATH=/home/unifyroute/UnifyRoute/venv/bin"
ExecStart=/home/unifyroute/UnifyRoute/unifyroute start
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 4. Enable and Run

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable on boot
sudo systemctl enable unifyroute

# Start service
sudo systemctl start unifyroute

# Check status
sudo systemctl status unifyroute

# View logs
sudo journalctl -u unifyroute -f
```

## Reverse Proxy Configuration

### Nginx

```nginx
upstream unifyroute {
    least_conn;
    server localhost:6565 max_fails=3 fail_timeout=30s;
    server localhost:6566 max_fails=3 fail_timeout=30s;
    server localhost:6567 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name unifyroute.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name unifyroute.example.com;

    ssl_certificate /etc/letsencrypt/live/unifyroute.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/unifyroute.example.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    location / {
        proxy_pass http://unifyroute;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # API rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    location /api/v1/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://unifyroute;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName unifyroute.example.com
    Redirect permanent / https://unifyroute.example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName unifyroute.example.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/unifyroute.example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/unifyroute.example.com/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://localhost:6565/ nocanon
    ProxyPassReverse / http://localhost:6565/

    # Rate limiting
    <Location /api/v1/>
        mod_ratelimit ON
        LimitRequestBody 10485760
    </Location>
</VirtualHost>
```

## TLS/SSL Setup

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate with auto-renewal
sudo certbot certonly --nginx -d unifyroute.example.com

# Auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check renewal
sudo certbot renew --dry-run
```

## Monitoring & High Availability

### Health Checks

```bash
# API health
curl https://unifyroute.example.com/health

# Provider status
curl https://unifyroute.example.com/api/v1/providers/status

# Metrics
curl https://unifyroute.example.com/metrics
```

### Load Balancing

Configure multiple instances:

```bash
# Start instance 1
SERVER_PORT=6565 ./unifyroute start

# Start instance 2
SERVER_PORT=6566 ./unifyroute start

# Start instance 3
SERVER_PORT=6567 ./unifyroute start

# Configure nginx upstream (shown above)
```

## Database Migration

For PostgreSQL production:

```bash
# Backup current database
./unifyroute backup backup.sql

# Migrate to PostgreSQL
DATABASE_URL=postgresql://user:pass@host/unifyroute \
  ./unifyroute migration migrate

# Restore data if needed
./unifyroute restore backup.sql
```

## Backup & Recovery

### Regular Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/unifyroute"
mkdir -p $BACKUP_DIR

# Backup database
sqlite3 /app/unifyroute.db ".backup '$BACKUP_DIR/db-$(date +%Y%m%d).db'"

# Backup config
cp /app/config.yaml "$BACKUP_DIR/config-$(date +%Y%m%d).yaml"

# Keep only last 30 days
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.yaml" -mtime +30 -delete
```

### Recovery

```bash
# Restore from backup
./unifyroute restore /backups/unifyroute/db-20240101.db

# Verify integrity
./unifyroute health
```

## Troubleshooting Deployment

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :6565
# Kill process
sudo kill -9 PID
```

### Database Lock Error

```bash
# Remove lock file
rm unifyroute.db-wal
rm unifyroute.db-shm

# Reinitialize
./unifyroute setup
```

### Memory Issues

Adjust allocation:

```bash
# In environment or systemd service
export PYTHONUNBUFFERED=1
ulimit -n 65536  # Increase file descriptors
```
