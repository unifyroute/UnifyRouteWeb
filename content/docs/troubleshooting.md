---
title: Troubleshooting
description: Common issues and solutions for UnifyRoute
weight: 8
---

## Common Issues & Solutions

### Installation & Setup

#### Python Version Error

**Error**: `Python 3.11+ required`

**Solution**:
```bash
# Check Python version
python --version
python3.11 --version

# On Ubuntu/Debian
sudo apt-get install python3.11 python3.11-venv

# On macOS with Homebrew
brew install python@3.11

# Set alias if needed
alias python=python3.11

# Or use virtual environment
python3.11 -m venv venv
source venv/bin/activate
```

#### Redis Connection Error

**Error**: `Cannot connect to Redis at localhost:6379`

**Solutions**:

1. Redis not installed:
```bash
# On macOS
brew install redis
brew services start redis

# On Linux
sudo apt-get install redis-server
sudo systemctl start redis-server

# On Docker
docker run -d -p 6379:6379 redis:7-alpine
```

2. Redis on different host:
```bash
# Update .env
REDIS_URL=redis://your-redis-host:6379
```

3. Use memory cache for development:
```bash
# In .env
REDIS_URL=memory://
```

### Server & Gateway

#### Port Already in Use

**Error**: `Address already in use :6565`

**Solution**:
```bash
# Find process using port
lsof -i :6565
# or on Windows
netstat -ano | findstr :6565

# Kill process
kill -9 PID
# or on Windows
taskkill /PID PID /F

# Or use different port
SERVER_PORT=6566 ./unifyroute start
```

#### Server Not Starting

**Error**: `Failed to start server`

**Steps to debug**:
```bash
# 1. Check logs
tail -f logs/unifyroute.log

# 2. Verify configuration
./unifyroute config validate

# 3. Check database
sqlite3 unifyroute.db ".tables"

# 4. Run with debug mode
DEBUG=true ./unifyroute start
```

### Database Issues

#### Database Lock

**Error**: `database is locked`

**Solution**:
```bash
# 1. Remove lock files
rm unifyroute.db-wal
rm unifyroute.db-shm

# 2. Check if process has hold
lsof unifyroute.db

# 3. Reinitialize
./unifyroute setup
```

#### Database Version Mismatch

**Error**: `Database schema version mismatch`

**Solution**:
```bash
# 1. Backup current database
cp unifyroute.db unifyroute.db.backup

# 2. Run migrations
./unifyroute migration migrate

# 3. If migration fails, restore
mv unifyroute.db.backup unifyroute.db
```

### Providers & Credentials

#### Provider Authentication Error

**Error**: `Invalid API key for provider OpenAI`

**Solutions**:

1. Check API key:
```bash
# Verify key format matches provider requirements
./unifyroute providers test openai
```

2. Check provider credentials in dashboard:
- Navigate to Providers
- Click Edit on the provider
- Re-enter API credentials
- Test connection

3. Check environment variables:
```bash
# Make sure credentials are in .env
echo $OPENAI_API_KEY
```

#### Provider Not Found in Routing

**Error**: `Provider 'openai' not found in routing configuration`

**Solution**:
```bash
# 1. List configured providers
./unifyroute providers list

# 2. Add provider if missing
./unifyroute providers add \
  --name openai \
  --type openai \
  --api-key sk-...

# 3. Update routing configuration
./unifyroute config show routing
./unifyroute config edit
```

#### Quota Exceeded Error

**Error**: `Provider quota exceeded`

**Solutions**:

1. Check current quota:
```bash
./unifyroute stats --by provider
```

2. Reset quota in dashboard:
- Go to "Providers"
- Click provider
- Update quota limit
- Save

3. Monitor usage:
```bash
./unifyroute logs --service quota --follow
```

### API & Requests

#### Authentication Failed

**Error**: `401 Unauthorized - Invalid token`

**Solutions**:

1. Verify token exists:
```bash
./unifyroute tokens list
```

2. Check token header format:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:6565/api/v1/models
```

3. Verify token permissions:
```bash
./unifyroute tokens info YOUR_TOKEN
```

4. Create new token if expired:
```bash
./unifyroute tokens create --name "new-token"
```

#### Rate Limit Exceeded

**Error**: `429 Too Many Requests`

**Solutions**:

1. Check rate limits:
```bash
./unifyroute tokens info YOUR_TOKEN
```

2. Reduce request rate:
```bash
# On client side: add delays between requests
import time
time.sleep(1)  # Wait 1 second between requests
```

3. Increase rate limit:
```bash
./unifyroute tokens modify YOUR_TOKEN \
  --rate-limit 200  # requests/minute
```

#### Model Not Found

**Error**: `Model 'gpt-4' not found`

**Solutions**:

1. List available models:
```bash
curl http://localhost:6565/api/v1/models \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. Check provider has model:
```bash
./unifyroute providers test openai
```

3. Add model to provider config:
```yaml
# In config.yaml
providers:
  openai:
    models:
      - gpt-4      # Add this
      - gpt-3.5-turbo
```

### Performance Issues

#### Slow Response Times

**Debugging**:

1. Check provider response:
```bash
time curl -X POST http://localhost:6565/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"hi"}]}'
```

2. Check server load:
```bash
./unifyroute stats  # View statistics
top                 # Check CPU/memory
redis-cli info      # Check Redis
```

3. Increase workers:
```bash
SERVER_WORKERS=8 ./unifyroute start
```

#### High Memory Usage

**Solutions**:

1. Reduce cache TTL:
```yaml
# In config.yaml
cache:
  ttl:
    credentials: 1800  # Reduce from 3600
    quota: 900         # Reduce from 1800
```

2. Limit database pool:
```yaml
database:
  postgresql:
    pool_size: 10   # Reduce from 20
```

3. Clear old logs:
```bash
rm logs/*.log.* # Remove rotated logs
```

#### High CPU Usage

**Solutions**:

1. Check logs for errors:
```bash
tail -f logs/unifyroute.log | grep ERROR
```

2. Reduce polling frequency:
```yaml
# In config.yaml
quota:
  monitoring:
    poll_interval: 7200  # Increase from 3600
```

3. Restart services:
```bash
./unifyroute restart
```

### Logging & Debugging

#### Enable Debug Logging

```bash
# Set environment variable
DEBUG=true ./unifyroute start

# Or in .env
DEBUG=true
LOG_LEVEL=DEBUG
```

#### View Logs

```bash
# Follow API logs
./unifyroute logs --service api --follow

# View all logs since 1 hour ago
./unifyroute logs --since 1h

# Get logs for specific error
./unifyroute logs | grep "ERROR"

# Export logs to file
./unifyroute logs > logs_export.txt
```

#### Enable Request Tracing

```yaml
# In config.yaml
logging:
  level: DEBUG
  components:
    api: DEBUG
    router: DEBUG
    provider: DEBUG
```

Each request will have a correlation ID in logs.

### Health & Diagnostics

#### System Health Check

```bash
# Full health check
./unifyroute health

# Specific checks
./unifyroute health --check database
./unifyroute health --check redis
./unifyroute health --check providers
```

#### Database Integrity

```bash
# Check database
sqlite3 unifyroute.db "PRAGMA integrity_check;"

# Vacuum to optimize
sqlite3 unifyroute.db "VACUUM;"
```

#### Provider Status

```bash
# Test all providers
./unifyroute providers test

# Detailed provider status
./unifyroute providers list --format json
```

## Getting Help

### Report Issues

1. **Check existing issues**: https://github.com/unifyroute/UnifyRoute/issues

2. **Create new issue** with:
   - Error message (full traceback)
   - Steps to reproduce
   - UnifyRoute version
   - Configuration details (API keys redacted)
   - Logs

### Enable Detailed Logging

When reporting issues, include:
```bash
# Collect diagnostic info
./unifyroute health > diagnostics.txt
./unifyroute config show >> diagnostics.txt
./unifyroute logs --since 24h >> diagnostics.txt

# Share diagnostics (remove sensitive data)
```

### Community Support

- GitHub Discussions: https://github.com/unifyroute/UnifyRoute/discussions
- Discord Community: https://discord.gg/unifyroute
- Email: support@unifyroute.io
