# API Design

# Overview

The backend system will expose REST APIs for all frontend applications.

---

# API Categories

## Authentication APIs

Examples:

- POST /auth/register
- POST /auth/login
- POST /auth/forgot-password

---

## Customer APIs

Examples:

- GET /customers/profile
- PATCH /customers/profile
- GET /customers/orders

---

## Order APIs

Examples:

- POST /orders
- GET /orders
- GET /orders/:id

---

## Payment APIs

Examples:

- POST /payments/verify
- GET /payments/:id

---

## Dispatch APIs

Examples:

- POST /dispatch/assign
- PATCH /dispatch/status

---

## Driver APIs

Examples:

- GET /drivers/assignments
- POST /drivers/confirm-delivery

---

## Admin APIs

Examples:

- GET /admin/users
- GET /admin/reports
- PATCH /admin/orders/:id

---

# API Standards

- Use JSON responses
- Use standardized status codes
- Use authentication middleware
- Validate all requests

---

# Response Structure

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

---

# Error Structure

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```
