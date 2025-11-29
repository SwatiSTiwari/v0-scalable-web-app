# Scalable Web App - API Documentation

## Overview

This API powers the authentication and task management system. The backend uses Express.js-style Route Handlers in Next.js but is structured to be easily extracted into a standalone Express backend.

## Base URL

- Development: `http://localhost:3000/api`

## Authentication

All protected endpoints require either:

1. Bearer token in `Authorization` header: `Authorization: Bearer {token}`
2. HTTP-only cookie: `auth_token={token}`

## Endpoints

### Auth Endpoints

#### POST /auth/signup

Create a new user account.

**Request:**
\`\`\`json
{
  "email": "contact.auctionwale@gmail.com",
  "password": "12345678",
  "name": "auctionwale"
}
<img width="2336" height="1642" alt="image" src="https://github.com/user-attachments/assets/efcb7a92-f59c-4636-b57f-7ba78e26c024" />
\`\`\`

**Response (201):**
\`\`\`json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

#### POST /auth/login

Authenticate user with credentials.

**Request:**
\`\`\`json
{
  "email": "swatistiwati13@gmail.com",
  "password": "1234567890"
}

<img width="2342" height="1646" alt="image" src="https://github.com/user-attachments/assets/87e6a32d-fd82-4dbe-ab1a-ae35381a5040" />

\`\`\`

**Response (200):**
\`\`\`json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

#### GET /auth/me

Get current authenticated user.

**Response (200):**
\`\`\`json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-01T00:00:00Z"
}
\`\`\`

#### POST /auth/logout

Logout current user (clears auth token).

**Response (200):**
\`\`\`json
{
  "message": "Logged out"
}
\`\`\`

### Task Endpoints

#### GET /tasks

Get all tasks for authenticated user.

**Response (200):**
\`\`\`json
[
  {
    "id": "task_id",
    "userId": "user_id",
    "title": "Complete project",
    "description": "Finish the scalable web app",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
\`\`\`

#### POST /tasks

Create a new task.

**Request:**
\`\`\`json
{
  "title": "Complete project",
  "description": "Finish the scalable web app"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "id": "task_id",
  "userId": "user_id",
  "title": "Complete project",
  "description": "Finish the scalable web app",
  "status": "pending",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
\`\`\`

#### GET /tasks/

Get specific task by ID.

**Response (200):**
\`\`\`json
{
  "id": "task_id",
  "userId": "user_id",
  "title": "Complete project",
  "description": "Finish the scalable web app",
  "status": "pending",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
\`\`\`

#### PATCH /tasks/

Update task (partial update supported).

**Request:**
\`\`\`json
{
  "title": "Updated title",
  "status": "completed"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "task_id",
  "userId": "user_id",
  "title": "Updated title",
  "description": "Finish the scalable web app",
  "status": "completed",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
\`\`\`

#### DELETE /tasks/

Delete a task.

**Response (200):**
\`\`\`json
{
  "message": "Task deleted"
}
\`\`\`

## Error Responses

### 400 Bad Request

Validation error or invalid input.
\`\`\`json
{
  "error": "Invalid email address"
}
\`\`\`

### 401 Unauthorized

Missing or invalid authentication.
\`\`\`json
{
  "error": "Unauthorized"
}
\`\`\`

### 404 Not Found

Resource not found.
\`\`\`json
{
  "error": "Task not found"
}
\`\`\`

### 500 Internal Server Error

Server-side error.
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

## Security Practices

1. **Password Hashing**: Passwords are hashed using SHA-256 (for demo; use bcrypt in production)
2. **JWT Tokens**: Signed with a secret key, 24-hour expiration
3. **HTTP-only Cookies**: Auth tokens stored in HTTP-only cookies to prevent XSS attacks
4. **CORS**: Configure appropriately for your production domain
5. **Input Validation**: All inputs validated with Zod schema validation
6. **Rate Limiting**: Implement in production environment
7. **HTTPS**: Always use HTTPS in production

## Scalability Notes

### Moving to Production Backend

To extract this into a standalone Express backend:

1. **Extract API Routes**

   - Move `app/api/*` to `backend/routes/*`
   - Keep the same request/response structure
2. **Database Migration**

   - Replace `lib/db.ts` with Prisma ORM
   - Use PostgreSQL or similar
3. **Authentication**

   - Use `jsonwebtoken` package
   - Move JWT creation/verification to backend
   - Implement refresh tokens
4. **Environment Variables**

   - Move to `.env.local` or secret management service
   - Use proper secret key management
5. **CORS Configuration**

   - Add CORS middleware to Express app
   - Configure allowed origins

### Frontend Changes for Production Backend

\`\`\`typescript
// Change API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Update fetch calls
const res = await fetch(`${API_URL}/tasks`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, description }),
})
\`\`\`

## Testing with Postman

1. **Signup**

   - POST http://localhost:3000/api/auth/signup
   - Body: `{"email":"swatistiwati13@gmail.com","password":"12345678","name":"swatis"}`
2. **Login**

   - POST http://localhost:3000/api/auth/login
   - Body: `{`"email":"swatistiwati13@gmail.com","password":"12345678"`}`
   - Save the returned `token`
4. **Get User**

   - GET http://localhost:3000/api/auth/me
   - Header: `Authorization: Bearer {token}`
5. **Create Task**

   - POST http://localhost:3000/api/tasks
   - Header: `Authorization: Bearer {token}`
   - Body: `{"title":"My Task","description":"Task description"}`
