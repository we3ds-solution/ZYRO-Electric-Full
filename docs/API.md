# API Reference — ZYRO Electric

Backend API built with **ASP.NET 9** + Swagger. Maintained by [we3ds-solution](https://github.com/we3ds-solution).

**Base URL (local):** `https://localhost:5001/api`  
**Swagger UI:** `https://localhost:5001/swagger`  
**Auth:** Bearer JWT token in `Authorization` header

---

## Authentication

All endpoints except `POST /auth/login` and `POST /auth/register` require a valid JWT Bearer token.

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login, returns JWT + refresh token | ❌ |
| `POST` | `/auth/refresh` | Refresh access token using refresh token | ❌ |
| `POST` | `/auth/logout` | Revoke refresh token | ✅ |
| `GET` | `/auth/me` | Get current authenticated user | ✅ |

#### POST `/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass1!",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response `201`:**
```json
{
  "message": "Registration successful",
  "userId": "abc123"
}
```

#### POST `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass1!"
}
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJI...",
  "refreshToken": "dGhpcyBpcyBh...",
  "expiresIn": 3600,
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "roles": ["Customer"]
  }
}
```

#### POST `/auth/refresh`

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBh..."
}
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJI...",
  "refreshToken": "bmV3UmVmcmVz...",
  "expiresIn": 3600
}
```

#### POST `/auth/logout`

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBh..."
}
```

**Response `200`:**
```json
{
  "message": "Logged out successfully"
}
```

---

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users/profile` | Get current user profile | ✅ |
| `PUT` | `/users/profile` | Update user profile | ✅ |
| `PUT` | `/users/password` | Change password | ✅ |

#### GET `/users/profile`

**Response `200`:**
```json
{
  "id": "abc123",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "avatarUrl": null,
  "createdAt": "2026-06-01T00:00:00Z"
}
```

---

### Roles & Permissions *(Admin only)*

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/roles` | List all roles | ✅ Admin |
| `POST` | `/roles` | Create new role | ✅ Admin |
| `GET` | `/permissions` | List all permissions | ✅ Admin |
| `POST` | `/roles/{id}/permissions` | Assign permissions to role | ✅ Admin |

---

## Error Responses

All endpoints return consistent error envelopes:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error / bad request |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict (e.g., email already registered) |
| `500` | Internal server error |

---

## JWT Token Details

| Property | Value |
|---|---|
| Algorithm | HS256 |
| Access Token Lifetime | 60 minutes (configurable) |
| Refresh Token Lifetime | 7 days (configurable) |
| Refresh Token Rotation | Yes — new token issued on each refresh |

Configure in `appsettings.auth.json`:
```json
{
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-chars",
    "Issuer": "zyro-electric-api",
    "Audience": "zyro-electric-client",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

---

## Local Development

Swagger UI is available at `https://localhost:5001/swagger` with full try-it-out support.

```bash
cd backend
dotnet run --project src/Presentation
# Open https://localhost:5001/swagger
```

---

## Notes

- **Frontend mock mode:** The Angular frontend ships with a mock data layer (`ENABLE_MOCK_DATA=true` in `.env`) — no backend required for UI development
- **CORS:** Configured to allow `http://localhost:4200` in development
- **Rate limiting:** Not yet implemented — tracked in backlog
