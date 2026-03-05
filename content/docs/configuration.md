---
title: Configuration
description: UnifyRoute configuration options and environment variables
weight: 6
---

## Configuration Files

UnifyRoute uses configuration files in YAML format. The main configuration file is typically `config.yaml`.

### Configuration Hierarchy

1. `.env` file - Environment variables
2. `config.yaml` - Main configuration
3. Environment variable overrides

## Environment Variables

### Core Settings

```env
# Server
SERVER_HOST=localhost
SERVER_PORT=6565
SERVER_WORKERS=4
DEBUG=false

# Security
MASTER_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

# Database
DATABASE_URL=sqlite:///./unifyroute.db
# Or PostgreSQL:
# DATABASE_URL=postgresql://user:pass@localhost/unifyroute

# Redis/Cache
REDIS_URL=redis://localhost:6379
# Or for local development:
# CACHE_TYPE=memory

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_FILE=./unifyroute.log
```

### Security & Credentials

```env
# Vault
VAULT_KEY=your-vault-encryption-key
VAULT_ALGORITHM=AES-256
VAULT_STORAGE=local

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:6565/auth/google/callback

# API Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_TOKENS_PER_DAY=1000000
```

## config.yaml Structure

### Server Configuration

```yaml
server:
  host: 0.0.0.0
  port: 6565
  workers: 4
  timeout: 30
  max_request_size: 10485760  # 10MB
  request_timeout: 300  # seconds
```

### Provider Configuration

```yaml
providers:
  openai:
    name: "OpenAI"
    type: "openai"
    api_key: "${OPENAI_API_KEY}"  # Use env vars
    api_base: "https://api.openai.com/v1"
    organization_id: ""
    models:
      - gpt-4
      - gpt-3.5-turbo
      - text-davinci-003
    rate_limit:
      requests_per_minute: 3500
      tokens_per_minute: 90000
    quota:
      monthly_limit: 1000000

  anthropic:
    name: "Anthropic"
    type: "anthropic"
    api_key: "${ANTHROPIC_API_KEY}"
    api_base: "https://api.anthropic.com"
    models:
      - claude-2
      - claude-1.3
```

### Routing Configuration

```yaml
routing:
  default_tier:
    primary: "openai"
    fallback:
      - "anthropic"
      - "together"

  # Cost-based routing
  cost_optimization: true
  prefer_cheaper_providers: true

  # Routing rules
  rules:
    - name: "production_rule"
      match:
        models: ["gpt-4", "gpt-4-turbo"]
        users: ["$premium_users"]
      route_to:
        primary: "openai"
        fallback: ["anthropic"]

    - name: "cost_sensitive"
      match:
        models: ["gpt-3.5-turbo"]
      route_to:
        providers:
          - name: "openai"
            weight: 40
          - name: "anthropic"
            weight: 30
          - name: "together"
            weight: 30

  # Failover strategy
  failover:
    enabled: true
    max_retries: 3
    retry_delay: 1000  # milliseconds
    backoff_multiplier: 2.0
```

### Quota Configuration

```yaml
quota:
  monitoring:
    enabled: true
    poll_interval: 3600  # seconds

  enforcement:
    enabled: true
    reject_over_quota: true

  alerts:
    enabled: true
    threshold_percentage: 80  # Alert at 80% usage
    channels:
      - type: "email"
        recipients: ["admin@example.com"]
      - type: "slack"
        webhook_url: "${SLACK_WEBHOOK_URL}"
```

### Authentication Configuration

```yaml
authentication:
  jwt:
    secret: "${JWT_SECRET}"
    algorithm: "HS256"
    expiration: 86400  # seconds
    refresh_token_expiration: 2592000  # 30 days

  oauth:
    google:
      enabled: true
      client_id: "${GOOGLE_CLIENT_ID}"
      client_secret: "${GOOGLE_CLIENT_SECRET}"
      scopes:
        - "https://www.googleapis.com/auth/userinfo.email"

  rate_limiting:
    enabled: true
    storage: "redis"
    requests_per_minute: 100
    tokens_per_day: 10000000
```

### Logging Configuration

```yaml
logging:
  level: "INFO"
  format: "json"  # or "text"
  output: "file"  # or "console", "both"
  file:
    path: "./logs/unifyroute.log"
    max_size: 10485760  # 10MB
    max_backups: 10
    compress: true

  # Log levels per component
  components:
    api: "DEBUG"
    router: "INFO"
    provider: "INFO"
    quota: "INFO"
```

### Database Configuration

```yaml
database:
  engine: "sqlite"  # or "postgresql"
  sqlite:
    path: "./unifyroute.db"
  postgresql:
    host: "localhost"
    port: 5432
    username: "unifyroute"
    password: "${DB_PASSWORD}"
    database: "unifyroute"
    pool_size: 20
    max_overflow: 10
```

### Cache/Redis Configuration

```yaml
cache:
  type: "redis"  # or "memory" for dev
  redis:
    host: "localhost"
    port: 6379
    password: "${REDIS_PASSWORD}"
    database: 0
    pool_size: 10

  # Cache TTL for different items
  ttl:
    credentials: 3600
    quota: 1800
    models: 86400
```

### Dashboard Configuration

```yaml
dashboard:
  enabled: true
  port: 6565
  path: "/"

  features:
    analytics: true
    cost_tracking: true
    user_management: true
    provider_management: true
```

## Environment-Specific Examples

### Development

```env
SERVER_HOST=localhost
SERVER_PORT=6565
DEBUG=true
LOG_LEVEL=DEBUG
CACHE_TYPE=memory
DATABASE_URL=sqlite:///./dev.db
JWT_SECRET=dev-secret-key-change-in-prod
```

### Production

```env
SERVER_HOST=0.0.0.0
SERVER_PORT=6565
DEBUG=false
LOG_LEVEL=INFO
CACHE_TYPE=redis
DATABASE_URL=postgresql://user:pass@db.example.com:5432/unifyroute
REDIS_URL=redis://:password@redis.example.com:6379
JWT_SECRET=<strong-random-secret>
MASTER_PASSWORD=<strong-random-password>
VAULT_KEY=<strong-random-key>
```

## Configuration Best Practices

1. **Use Environment Variables** for secrets and sensitive data
2. **Version Control** `config.yaml` but not `.env`
3. **Validate Configuration** with `./unifyroute config validate`
4. **Test Changes** in development before production
5. **Document Custom Rules** for routing and quotas
6. **Monitor Logs** for configuration issues
7. **Regular Backups** of configurations

## Common Configuration Patterns

### Multi-Provider Failover

```yaml
routing:
  default_tier:
    primary: "openai"
    fallback:
      - "anthropic"
      - "together"
      - "generic-api"
```

### Cost Optimization

```yaml
routing:
  cost_optimization: true
  rules:
    - name: "budget_friendly"
      match:
        users: ["free_tier"]
      route_to:
        providers:
          - name: "together"  # Cheapest
            weight: 50
          - name: "anthropic"
            weight: 50
```

### User-Based Routing

```yaml
routing:
  rules:
    - name: "premium_users"
      match:
        metadata:
          tier: "premium"
      route_to:
        primary: "openai"
        preferred_models: ["gpt-4", "gpt-4-turbo"]
```

## Troubleshooting Configuration

### Config Validation Error

```bash
./unifyroute config validate
# Shows detailed error messages
```

### Provider Not Found

Ensure provider is defined in both:
- `providers` section
- `routing` section

### Rate Limit Not Working

Check:
- `rate_limiting.enabled: true`
- Redis connectivity if using Redis
- Token quota configuration
