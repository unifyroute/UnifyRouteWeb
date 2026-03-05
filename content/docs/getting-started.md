---
title: Getting Started
description: Installation and basic setup for UnifyRoute
weight: 2
---

## Prerequisites

Before installing UnifyRoute, ensure you have:

- **Python 3.11+** - Core language requirement
- **Node.js 18+** - Required for the frontend dashboard
- **npm** - Node package manager
- **Redis** - For session and queue management (optional for development)
- **uv** - Fast Python package installer

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/unifyroute/UnifyRoute.git
cd UnifyRoute
```

### 2. Configure Environment

Copy the sample environment file and update with your settings:

```bash
cp sample.env .env
```

Edit `.env` with your configuration:

```env
# Server
SERVER_HOST=localhost
SERVER_PORT=6565

# Database
DATABASE_URL=sqlite:///./unifyroute.db
REDIS_URL=redis://localhost:6379

# Security
MASTER_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
VAULT_KEY=your-vault-key

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Run Setup

Execute the setup command to initialize the system:

```bash
./unifyroute setup
```

This will:
- Create necessary databases
- Initialize the credential vault
- Generate initial API tokens
- Set up provider configurations

### 4. Start Services

Start UnifyRoute:

```bash
./unifyroute start
```

The services will be available at:
- **Dashboard**: http://localhost:6565
- **API Gateway**: http://localhost:6565/api/v1

### 5. Verify Installation

Check that services are running:

```bash
curl http://localhost:6565/health
```

You should see a response indicating all services are healthy.

## First Steps

### Add Your First Provider

1. Open the dashboard at http://localhost:6565
2. Navigate to "Providers"
3. Click "Add Provider"
4. Select your provider (OpenAI, Anthropic, etc.)
5. Enter your API credentials
6. Test the connection

### Create an API Token

1. Go to "Tokens" in the dashboard
2. Click "Create Token"
3. Configure token permissions
4. Copy and save the generated token securely

### Configure Routing

1. Go to "Routing" settings
2. Set up routing tiers (primary, fallback, etc.)
3. Select which providers for each tier
4. Save configuration

### Test Your Setup

Use your API token to make a test request:

```bash
curl http://localhost:6565/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## Common Issues

### Redis Connection Error

If you see Redis connection errors, ensure Redis is running:

```bash
# On macOS with Homebrew
brew services start redis

# On Linux
sudo systemctl start redis-server

# Or use local in-memory cache for development
# Set REDIS_URL to "memory://" in .env
```

### Port Already in Use

If port 6565 is already in use, change it in `.env`:

```env
SERVER_PORT=6666
```

### Database Lock

Remove the old database and reinitialize:

```bash
rm unifyroute.db
./unifyroute setup
```

## Next Steps

- **Read the Architecture guide** to understand how UnifyRoute works
- **Check Configuration options** for advanced settings
- **Review API Reference** to understand available endpoints
- **Explore Deployment guides** for production setup
