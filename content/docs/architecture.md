---
title: Architecture
description: UnifyRoute system design and components
weight: 3
---

## System Overview

UnifyRoute is built as a microservices-oriented architecture with the following components:

```
┌─────────────────────────────────────────────────┐
│         Client Applications / SDKs              │
└────────────────┬────────────────────────────────┘
                 │
        OpenAI-Compatible API
                 │
        ┌────────▼────────────────────┐
        │   API Gateway (FastAPI)     │
        │  - Request validation       │
        │  - Authentication           │
        │  - Rate limiting            │
        └────────┬────────────────────┘
                 │
        ┌────────▼──────────────────────────┐
        │   Router Component                │
        │  - Intelligent routing logic      │
        │  - Provider selection             │
        │  - Failover handling              │
        └────────┬──────────────────────────┘
                 │
        ┌────────▼──────────────────────────┐
        │   Provider Integration Layer      │
        │  - OpenAI                         │
        │  - Anthropic                      │
        │  - Together AI                    │
        │  - Other providers                │
        └────────┬──────────────────────────┘
                 │
        ┌────────▼──────────────────────────┐
        │   Supporting Services             │
        │  - Credential Vault               │
        │  - Quota Poller                   │
        │  - Metrics/Logging                │
        └──────────────────────────────────┘
```

## Core Components

### API Gateway
- **Framework**: FastAPI
- **Purpose**: Accept OpenAI-compatible requests, validate, authenticate, and route
- **Key Features**:
  - Request/response validation
  - JWT token authentication
  - Rate limiting per user/token
  - Request logging and correlation

### Router
- **Purpose**: Intelligent request routing based on configuration rules
- **Key Features**:
  - Multi-tier routing (primary, fallback, etc.)
  - Cost-aware routing
  - Provider health checks
  - Failover logic
  - Quota-aware routing

### Credential Vault
- **Purpose**: Secure storage and management of provider credentials
- **Key Features**:
  - Encrypted credential storage
  - Vault key management
  - Credential rotation support
  - Access audit trails

### Quota Poller
- **Purpose**: Track and update provider quota limits
- **Key Features**:
  - Periodic quota polling
  - Quota synchronization
  - Quota alerts
  - Rate limit enforcement

### Management Dashboard
- **Technology**: React
- **Purpose**: Provide user interface for configuration and monitoring
- **Features**:
  - Provider management
  - Token management
  - Routing configuration
  - Usage analytics
  - Cost monitoring

## Data Flow

### Request Flow

1. **Client Request** → OpenAI-compatible endpoint
2. **API Gateway** validates request and authenticates token
3. **Router** determines best provider based on:
   - Routing configuration
   - Provider availability
   - Quota availability
   - Cost optimization rules
4. **Provider Integration** transforms request and calls provider
5. **Response Handling** transforms provider response back to OpenAI format
6. **Logging** records request metrics and usage

### Failover Flow

1. Primary provider unavailable or returns error
2. Router selects first fallback provider
3. Request retry with fallback provider
4. If fallback also fails, try next fallback
5. If all fail, return error to client

## Data Storage

### SQLite Database
- **Purpose**: Persistent state storage
- **Stores**:
  - Provider configurations
  - API tokens
  - User accounts
  - Routing rules
  - Usage metrics

### Redis Cache
- **Purpose**: Session management and temporary state
- **Stores**:
  - Active sessions
  - Cached quota information
  - Rate limiting counters
  - Request queues

## Security Architecture

### Authentication
- **API Tokens**: JWT-based tokens for API access
- **OAuth**: Google OAuth integration for dashboard
- **Master Password**: For sensitive operations

### Encryption
- **Credential Vault**: AES-256 encryption for stored credentials
- **Transit**: HTTPS for all network traffic
- **Keys**: Vault keys stored separately in environment

### Authorization
- **Token Scopes**: Fine-grained permission control
- **Role-Based**: Admin, user, read-only roles
- **Rate Limiting**: Per-token rate limits

## Scalability Considerations

### Horizontal Scaling
- Stateless API gateway can run multiple instances
- Redis for shared session state
- Database for persistent state

### Performance
- Caching of provider responses
- Connection pooling to providers
- Async/await for non-blocking I/O

### Reliability
- Health checks for providers
- Automatic failover
- Request retries with exponential backoff
- Comprehensive logging

## Technology Stack

| Component | Technology |
|-----------|------------|
| API | FastAPI, Python 3.11+ |
| CLI | Python Click |
| Dashboard | React 18 |
| Database | SQLite |
| Cache | Redis |
| Auth | JWT, Google OAuth |
| Deployment | Docker, Kubernetes-ready |
| Monitoring | Structured logging, metrics |

## Environment Setup

### Development
- Local SQLite database
- In-memory cache option for Redis
- Hot-reload enabled

### Production
- PostgreSQL or SQLite
- Redis cluster for caching
- TLS certificates for HTTPS
- Container orchestration (Docker, K8s)

## Integration Points

### Provider APIs
- OpenAI API
- Anthropic API
- Together AI API
- Custom provider adapters

### External Services
- Google OAuth for authentication
- Email services for notifications (optional)
- Slack/Discord webhooks for alerts (optional)
