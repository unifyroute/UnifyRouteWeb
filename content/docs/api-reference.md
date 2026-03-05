---
title: API Reference
description: UnifyRoute OpenAI-compatible API endpoints
weight: 4
---

## Overview

UnifyRoute provides OpenAI-compatible API endpoints that work with any OpenAI SDK or tool without modifications.

**Base URL**: `http://localhost:6565/api/v1`

**Authentication**: Include your API token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  http://localhost:6565/api/v1/chat/completions
```

## Chat Completions

Create a chat completion for a given prompt.

**Endpoint**: `POST /api/v1/chat/completions`

### Request

```bash
curl -X POST http://localhost:6565/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What is the capital of France?"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

### Request Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | - | Model identifier (required) |
| `messages` | array | - | Array of message objects (required) |
| `temperature` | number | 1.0 | Sampling temperature (0-2) |
| `top_p` | number | 1.0 | Nucleus sampling parameter |
| `top_k` | number | - | Top-k sampling parameter |
| `max_tokens` | number | - | Maximum tokens in response |
| `frequency_penalty` | number | 0 | Frequency penalty (-2.0 to 2.0) |
| `presence_penalty` | number | 0 | Presence penalty (-2.0 to 2.0) |
| `stream` | boolean | false | Stream response tokens |
| `user` | string | - | Unique user identifier |

### Response

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1677649420,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 30,
    "completion_tokens": 10,
    "total_tokens": 40
  }
}
```

## Text Completions

Generate text completion for a given prompt.

**Endpoint**: `POST /api/v1/completions`

### Request

```bash
curl -X POST http://localhost:6565/api/v1/completions \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-davinci-003",
    "prompt": "The future of AI is",
    "temperature": 0.7,
    "max_tokens": 50
  }'
```

### Request Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | - | Model identifier (required) |
| `prompt` | string | - | Text prompt (required) |
| `temperature` | number | 1.0 | Sampling temperature |
| `max_tokens` | number | 100 | Max completion length |
| `top_p` | number | 1.0 | Nucleus sampling |
| `frequency_penalty` | number | 0 | Frequency penalty |
| `presence_penalty` | number | 0 | Presence penalty |
| `stream` | boolean | false | Stream response |

## List Models

Get available models from configured providers.

**Endpoint**: `GET /api/v1/models`

### Request

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  http://localhost:6565/api/v1/models
```

### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-3.5-turbo",
      "object": "model",
      "created": 1688660000,
      "owned_by": "openai",
      "provider": "openai"
    },
    {
      "id": "gpt-4",
      "object": "model",
      "created": 1687882411,
      "owned_by": "openai",
      "provider": "openai"
    },
    {
      "id": "claude-2",
      "object": "model",
      "created": 1693052800,
      "owned_by": "anthropic",
      "provider": "anthropic"
    }
  ]
}
```

## Error Handling

Errors are returned in standard OpenAI format:

```json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "param": null,
    "code": "quota_exceeded"
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `invalid_request_error` | 400 | Invalid request parameters |
| `authentication_error` | 401 | Invalid or missing API token |
| `permission_error` | 403 | Token lacks required permissions |
| `not_found_error` | 404 | Resource not found |
| `rate_limit_error` | 429 | Rate limit exceeded |
| `server_error` | 500 | UnifyRoute server error |
| `provider_error` | 502 | Error from LLM provider |
| `quota_exceeded` | 429 | Provider quota exceeded |

## Streaming Responses

For streaming responses, set `stream: true` in the request:

```bash
curl -X POST http://localhost:6565/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }' \
  --stream
```

Responses come as Server-Sent Events (SSE):

```
data: {"choices":[{"delta":{"content":"Hello"}...}]}

data: {"choices":[{"delta":{"content":" there"}...}]}

data: [DONE]
```

## Rate Limiting

UnifyRoute enforces rate limits based on your API token configuration.

**Rate Limit Headers**:
```
X-RateLimit-Limit-Requests: 100
X-RateLimit-Limit-Tokens: 10000
X-RateLimit-Remaining-Requests: 99
X-RateLimit-Remaining-Tokens: 9950
X-RateLimit-Reset: 1234567890
```

## Provider Routing

Request routing is handled automatically based on your configuration. You can optionally specify provider preferences:

```json
{
  "model": "gpt-3.5-turbo",
  "messages": [...],
  "provider": "openai",
  "tags": ["production", "high-priority"]
}
```

## Webhook Notifications

Configure webhooks for events like quota changes or provider failures:

**POST** `/api/v1/webhooks` - Register webhook
**PUT** `/api/v1/webhooks/{id}` - Update webhook
**DELETE** `/api/v1/webhooks/{id}` - Delete webhook

Webhook events include:
- `provider.quota_exceeded`
- `provider.offline`
- `provider.online`
- `token.created`
- `token.revoked`
