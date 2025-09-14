# API Documentation

This document provides comprehensive documentation for the Learuma AI REST API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### POST /auth/signup

Register a new user account.

**Request Body:**
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "msg": "User created"
}
```

**Response (400):**
```json
{
  "error": "Validation error details"
}
```

### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "access_token": "string"
}
```

**Response (401):**
```json
{
  "msg": "Unvalid user informations"
}
```

### POST /auth/logout

Logout user (token invalidation handled client-side).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "msg": "logout successfully"
}
```

### GET /auth/me

Get current user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "firstname": "string",
    "lastname": "string",
    "email": "string"
  }
}
```

**Response (404):**
```json
{
  "msg": "User not found"
}
```

## Chat Endpoints

### GET /chats/navbar-summaries

Get all chat summaries for the authenticated user (for sidebar navigation).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "integer",
    "title": "string"
  }
]
```

### POST /chats/chat

Create a new chat session with initial user message.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "agent": "string",
  "model": "string"
}
```

**Response (201):**
```json
{
  "chat_id": "integer",
  "title": "string",
  "created_at": "datetime",
  "agent": "string",
  "messages": [
    {
      "id": "integer",
      "sender": "user",
      "content": "string"
    }
  ]
}
```

### GET /chats/chat/{chat_id}

Get specific chat details with all messages.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "integer",
  "title": "string",
  "model": "string",
  "agent": "string",
  "messages": [
    {
      "id": "integer",
      "sender": "user|ai",
      "content": "string"
    }
  ]
}
```

### PUT /chats/chat/{chat_id}

Update chat title.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string"
}
```

**Response (200):**
```json
{
  "id": "integer",
  "title": "string"
}
```

**Response (400):**
```json
{
  "error": "Title is required"
}
```

### DELETE /chats/chat/{chat_id}

Delete a specific chat and all its messages.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Chat and its messages deleted"
}
```

## Message Endpoints

### GET /message/chat/{chat_id}/messages

Get all messages for a specific chat.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "integer",
    "sender": "user|ai",
    "content": "string",
    "created_at": "datetime"
  }
]
```

### POST /message/chat/{chat_id}/messages

Send a new message to a chat and receive streaming AI response.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "string",
  "model": "string",
  "agent": "string"
}
```

**Response (200):**
Streaming text response (Content-Type: text/plain)

### GET /message/chat/{chat_id}/first-message

Get the first AI response for a newly created chat (streaming).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
Streaming text response (Content-Type: text/plain)

## Upload Endpoints

### POST /upload/upload

Upload and extract text from a PDF file.

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <pdf-file-data>
```

**Response (200):**
```json
{
  "filename": "string",
  "text": "string"
}
```

**Response (400):**
```json
{
  "error": "Aucun fichier trouvé"
}
```

**Response (500):**
```json
{
  "error": "Error details"
}
```

## AI Models and Agents

### Supported Models

The API supports the following AI models (configured via environment variables):

- `openai/gpt-oss-20b` (default)
- `openai/gpt-oss-120b`

Models are validated before use and must be included in the `GROQ_MODELS` environment variable.

### Available Agents

Different agent types provide specialized system prompts for various use cases:

- `assistant` - General purpose assistant
- `tutor` - Educational tutor
- `code` - Code assistant
- `creative` - Creative writing assistant

Agent configurations are defined in `backend/app/services/agent.py`.

## Vector Database Integration

The API integrates with ChromaDB for semantic search and context retrieval:

- Each chat has its own collection in ChromaDB
- Messages are embedded and stored for context retrieval
- Relevant context is included in AI responses based on semantic similarity

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "msg": "Authentication required"
}
```

### 404 Not Found
```json
{
  "msg": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error details"
}
```

## Streaming Responses

Message endpoints that generate AI responses use Server-Sent Events (SSE) for real-time streaming:

- Content-Type: `text/plain`
- Response is streamed as plain text chunks
- Client should handle streaming data appropriately

## Environment Configuration

The API requires the following environment variables:

- `GROQ_API_KEY` - API key for Groq AI service
- `GROQ_MODELS` - Comma-separated list of allowed models
- `DATABASE_URI` - Database connection string
- `JWT_SECRET_KEY` - Secret key for JWT token signing

## Rate Limiting

Currently, no rate limiting is implemented, but it's recommended for production deployments.

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for frontend integration. Configure allowed origins in the Flask application settings.