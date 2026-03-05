---
title: CLI Reference
description: UnifyRoute command-line interface documentation
weight: 5
---

## Overview

UnifyRoute provides a comprehensive CLI for managing the gateway, providers, tokens, and configuration.

**Usage**: `./unifyroute [COMMAND] [OPTIONS]`

## Global Options

```bash
--help, -h          Show help message
--version, -v       Show version information
--config, -c PATH   Path to config file (default: config.yaml)
--debug             Enable debug output
```

## Setup & Services

### setup

Initialize UnifyRoute with interactive configuration wizard.

```bash
./unifyroute setup [OPTIONS]
```

**Options**:
- `--skip-wizard` - Skip interactive prompts and use defaults
- `--force` - Overwrite existing configuration

**Example**:
```bash
./unifyroute setup
# Interactive wizard for providers, tokens, and routing
```

### start

Start all UnifyRoute services.

```bash
./unifyroute start [OPTIONS]
```

**Options**:
- `--port` - HTTP port (default: 6565)
- `--host` - Bind host (default: localhost)
- `--foreground` - Run in foreground (don't daemonize)
- `--workers` - Number of API workers (default: 4)

**Example**:
```bash
./unifyroute start --port 8080
```

### stop

Stop all running UnifyRoute services.

```bash
./unifyroute stop [OPTIONS]
```

**Options**:
- `--timeout` - Timeout for graceful shutdown (default: 30s)

### restart

Restart all services.

```bash
./unifyroute restart
```

### status

Check status of all services.

```bash
./unifyroute status
```

**Output**:
```
API Gateway:        running (PID: 1234)
Router:            running (PID: 1235)
Quota Poller:      running (PID: 1236)
Dashboard:         running (PID: 1237)
```

## Token Management

### tokens list

List all API tokens.

```bash
./unifyroute tokens list [OPTIONS]
```

**Options**:
- `--format` - Output format (json, table, default: table)
- `--active-only` - Show only active tokens
- `--user` - Filter by user

**Example**:
```bash
./unifyroute tokens list --format json
```

### tokens create

Create a new API token.

```bash
./unifyroute tokens create [OPTIONS]
```

**Options**:
- `--name` - Token name (required)
- `--user` - User ID
- `--permissions` - Comma-separated permissions
- `--expires-in` - Expiration duration (e.g., 30d, 1y)
- `--quota` - Token quota (requests/month)
- `--rate-limit` - Rate limit (requests/minute)

**Example**:
```bash
./unifyroute tokens create \
  --name "production-token" \
  --permissions "read:models,write:chat" \
  --expires-in 90d \
  --quota 100000
```

### tokens revoke

Revoke an API token.

```bash
./unifyroute tokens revoke TOKEN_ID
```

**Example**:
```bash
./unifyroute tokens revoke sk-abc123def456
```

### tokens info

Show detailed token information.

```bash
./unifyroute tokens info TOKEN_ID
```

## Provider Management

### providers list

List configured providers.

```bash
./unifyroute providers list [OPTIONS]
```

**Options**:
- `--format` - Output format (json, table)
- `--with-credentials` - Include credentials (masked)

**Example**:
```bash
./unifyroute providers list --format json
```

### providers add

Add a new provider.

```bash
./unifyroute providers add [OPTIONS]
```

**Options**:
- `--name` - Provider name (required)
- `--type` - Provider type: openai, anthropic, together (required)
- `--api-key` - API key
- `--api-base` - API base URL

**Example**:
```bash
./unifyroute providers add \
  --name my-openai \
  --type openai \
  --api-key sk-... \
  --api-base https://api.openai.com/v1
```

### providers remove

Remove a provider.

```bash
./unifyroute providers remove PROVIDER_NAME
```

### providers test

Test provider connectivity.

```bash
./unifyroute providers test PROVIDER_NAME
```

**Output**:
```
Testing provider 'openai'...
✓ Authentication successful
✓ Models endpoint responding
✓ Chat completions test request OK
✓ Model list: 5 models available
```

## Configuration

### config show

Display current configuration.

```bash
./unifyroute config show [OPTIONS]
```

**Options**:
- `--format` - Output format (yaml, json)
- `--section` - Show specific section only

**Example**:
```bash
./unifyroute config show --section routing
```

### config edit

Edit configuration interactively.

```bash
./unifyroute config edit [PATH]
```

**Example**:
```bash
./unifyroute config edit routing.providers
```

### config validate

Validate configuration syntax.

```bash
./unifyroute config validate [FILE]
```

## Monitoring & Diagnostics

### health

Check system health.

```bash
./unifyroute health [OPTIONS]
```

**Options**:
- `--check` - Specific health check (database, redis, providers)

**Example**:
```bash
./unifyroute health --check providers
```

### logs

View service logs.

```bash
./unifyroute logs [OPTIONS]
```

**Options**:
- `--service` - Service name (api, router, dashboard)
- `--since` - View logs since (e.g., 1h, 30m)
- `--follow, -f` - Follow logs in real-time
- `--lines` - Number of lines to show

**Example**:
```bash
./unifyroute logs --service api --follow --since 1h
```

### stats

Show usage statistics.

```bash
./unifyroute stats [OPTIONS]
```

**Options**:
- `--period` - Time period (today, week, month)
- `--by` - Group by (provider, token, model)
- `--format` - Output format (table, json)

**Example**:
```bash
./unifyroute stats --period month --by provider
```

## Maintenance

### backup

Create a backup of configuration and data.

```bash
./unifyroute backup [PATH]
```

### restore

Restore from backup.

```bash
./unifyroute restore BACKUP_FILE
```

### migration

Database migration commands.

```bash
./unifyroute migration migrate    # Run pending migrations
./unifyroute migration rollback   # Rollback last migration
./unifyroute migration status     # Show migration status
```

## Help & Documentation

### help

Show help for any command.

```bash
./unifyroute help [COMMAND]
./unifyroute [COMMAND] --help
```

**Example**:
```bash
./unifyroute help tokens create
./unifyroute start --help
```

## Examples

### Complete Setup Workflow

```bash
# 1. Initialize
./unifyroute setup

# 2. Check status
./unifyroute status

# 3. Create production token
./unifyroute tokens create \
  --name "production-api" \
  --expires-in 180d \
  --quota 1000000

# 4. Add provider
./unifyroute providers add \
  --name openai-prod \
  --type openai \
  --api-key sk-...

# 5. Test provider
./unifyroute providers test openai-prod

# 6. View configuration
./unifyroute config show

# 7. Start services
./unifyroute start

# 8. Check health
./unifyroute health
```

### Monitoring Workflow

```bash
# View real-time logs
./unifyroute logs --follow

# Check system health
./unifyroute health

# View provider status
./unifyroute providers list

# Check statistics
./unifyroute stats --period today
```
