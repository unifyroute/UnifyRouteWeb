---
title: Features
description: Comprehensive features built into UnifyRoute
weight: 1
---

## OpenAI-Compatible API

UnifyRoute provides drop-in compatible endpoints with OpenAI's API. Use it with any existing SDKs, tools, or applications without modifications.

### Supported Endpoints

- **POST /api/v1/chat/completions** - Chat completion requests
- **POST /api/v1/completions** - Text completion requests
- **GET /api/v1/models** - List available models

## Tier-Based Intelligent Routing

Route requests intelligently across multiple providers with automatic failover and redundancy.

- **Primary Tier**: Set your preferred provider
- **Fallback Tiers**: Automatic failover if primary is unavailable
- **Cost-Based Routing**: Route to the most economical provider
- **Load Balancing**: Distribute requests across multiple providers

## Credential & Provider Management

Securely manage credentials and provider configurations through an intuitive dashboard.

- **Multiple Providers**: Support for OpenAI, Anthropic, Together AI, and more
- **Secure Vault**: Encrypted credential storage
- **Interactive Setup**: Guided configuration wizard
- **Provider Health Monitoring**: Track provider status and availability

## Cost & Usage Visibility

Monitor and optimize your LLM spending with comprehensive observability.

- **Real-Time Cost Tracking**: Track spending across all providers
- **Usage Analytics**: Monitor request volumes and patterns
- **Cost Reports**: Detailed breakdown by provider, model, or user
- **Budget Alerts**: Get notified when approaching spending limits

## Quota Awareness

Built-in quota management prevents unexpected errors and cost overages.

- **Provider Quota Tracking**: Monitor remaining quotas
- **Rate Limiting**: Enforce request rate limits per user
- **Quota Synchronization**: Keep quotas in sync across providers
- **Automatic Enforcement**: Reject requests that would exceed quotas

## CLI Command Interface

Powerful command-line tools for deployment, management, and operations.

### Key Commands

```bash
# Setup and initialization
./unifyroute setup              # Initial setup wizard
./unifyroute start              # Start services
./unifyroute stop               # Stop services

# Token management
./unifyroute tokens list        # List API tokens
./unifyroute tokens create      # Create new token
./unifyroute tokens revoke      # Revoke token

# Provider management
./unifyroute providers import   # Import provider credentials
./unifyroute providers list     # List configured providers
./unifyroute config edit        # Edit configuration
```

## Production-Ready Architecture

Built on proven technologies for reliability and scalability.

- **FastAPI**: High-performance async API gateway
- **SQLite/Redis**: Local state management
- **OAuth Support**: Google authentication integration
- **JWT Authentication**: Stateless API token authentication
- **Comprehensive Logging**: Request tracking and debugging
- **Health Checks**: Built-in service health monitoring

## Interactive Configuration Wizard

Get started quickly with guided setup.

- **Provider Configuration**: Step-by-step provider setup
- **Routing Rules**: Easy-to-use routing configuration
- **Token Creation**: Generate API tokens for your applications
- **Verification**: Test your configuration before deployment

## Self-Hosted Control

Keep your infrastructure under complete control.

- **No External Dependencies**: Run entirely within your network
- **Data Privacy**: Your data never leaves your infrastructure
- **Customizable**: Extend with custom routing logic
- **Audit Trail**: Complete request logging for compliance
- **Open Source**: Apache 2.0 licensed, community-driven
