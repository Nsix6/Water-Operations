# System Architecture

# Overview

The platform will use a modular monolithic architecture designed for scalability, maintainability, operational visibility, and future extensibility.

The system will initially operate as a single-business platform while maintaining architectural flexibility for future multi-tenant expansion.

---

# High-Level Architecture

The system consists of the following major components:

- Customer Web Application
- Driver Web Portal
- Administrative Dashboard
- Backend API Server
- PostgreSQL Database
- Notification Services
- External Payment Services

---

# Architectural Style

## Modular Monolith

The backend architecture will follow a modular monolithic structure.

This approach is selected because it provides:

- Simpler deployment
- Easier debugging
- Lower infrastructure complexity
- Faster development iteration
- Easier transactional consistency
- Reduced operational overhead

The architecture will remain modular internally to support future service extraction if required.

---

# Frontend Applications

## Customer Web Application

Purpose:

- Customer registration
- Authentication
- Order placement
- Order tracking
- Profile management
- Notifications

Technology:

- Next.js
- TypeScript
- TailwindCSS

---

## Driver Portal

Purpose:

- Delivery assignment visibility
- Delivery updates
- OTP confirmation

Characteristics:

- Mobile optimized
- Lightweight
- Low data usage

Technology:

- Next.js
- TypeScript

---

## Administrative Dashboard

Purpose:

- Operational management
- Driver assignment
- Customer management
- Reporting
- Monitoring
- Audit visibility

Technology:

- Next.js
- TypeScript
- TailwindCSS

---

# Backend API

The backend system will expose REST APIs for all frontend applications.

Technology stack:

- Node.js
- TypeScript
- NestJS
- Prisma ORM

Responsibilities:

- Authentication
- Authorization
- Order management
- Payment processing
- Delivery management
- Notification handling
- Audit logging
- Business rule enforcement

---

# Database Layer

The platform will use PostgreSQL as the primary relational database.

Reasoning:

- Transactional consistency
- Relational integrity
- Strong querying capabilities
- Workflow enforcement
- Audit support

---

# Notification Layer

The notification subsystem will initially support:

- Email notifications

Future support:

- SMS notifications
- Push notifications
- WhatsApp integration

Notification events include:

- Order creation
- Payment confirmation
- Delivery assignment
- Delivery completion
- Account changes

---

# Authentication & Authorization

The system will implement role-based access control (RBAC).

Roles include:

- Customer
- Driver
- Dispatcher
- Manager/Admin

Authentication responsibilities:

- JWT access tokens
- Password hashing
- Session validation
- Role enforcement

---

# Security Principles

The system will enforce:

- Backend authorization validation
- Password hashing
- Restricted data visibility
- Audit logging
- Controlled state transitions
- Input validation
- Rate limiting

---

# Order Processing Flow

Customer creates order
→ Payment verification
→ Order enters READY_FOR_DISPATCH
→ Driver assignment
→ Delivery execution
→ OTP verification
→ Delivery completion
→ Audit logging

---

# Audit Architecture

Sensitive operations will generate immutable audit records.

Audit coverage includes:

- Profile modifications
- Payment confirmations
- Driver assignments
- Permission changes
- Administrative actions

---

# Future Scalability Considerations

The architecture should support future expansion including:

- Multi-tenant architecture
- Multiple suppliers
- Inventory systems
- Route optimization
- Analytics services
- Mobile applications
- Real-time tracking

---

# Infrastructure Overview

Initial infrastructure includes:

- VPS or cloud VM hosting
- Docker containerization
- Nginx reverse proxy
- PostgreSQL database
- GitHub Actions CI/CD

The infrastructure should remain simple initially while supporting future scaling requirements.

---

# Engineering Philosophy

The platform architecture prioritizes:

- Operational integrity
- Simplicity
- Scalability
- Maintainability
- Auditability
- Security
- Workflow enforcement
- Incremental evolution
