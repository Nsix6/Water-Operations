AquaOps
======

A concise backend-first platform for on-demand deliveries and operations.

**Short Description**
- AquaOps is a NestJS backend with Prisma + PostgreSQL, providing user authentication, order lifecycle management, payments bookkeeping, and basic dispatch/assignment flows. Frontend and infra code live in the workspace but are not yet fully implemented.

**Architecture**
- **Backend:** NestJS (TypeScript), Prisma ORM, PostgreSQL. Key code: [backend/src](backend/src)
- **Frontend:** placeholder directories at [frontend](frontend)
- **Infrastructure & scripts:** IaC and helper scripts in [infrastructure](infrastructure) and [scripts](scripts)

**What's implemented (backend highlights)**
- **Authentication:** JWT-based auth using `@nestjs/jwt` + `@nestjs/passport` with bcrypt password hashing. See [backend/src/auth](backend/src/auth).
- **User model:** `firstName`, `lastName`, `email`, `passwordHash` are required fields in the Prisma schema at [backend/prisma/schema.prisma](backend/prisma/schema.prisma).
- **Orders domain:** `Order` and `OrderItem` models, endpoints to create/list/get orders, and status transitions. Code at [backend/src/orders](backend/src/orders).
- **Payments & Dispatch:** Payment bookkeeping (internal `Payment` model) and driver assignment via `DeliveryAssignment`. See enums and models in the Prisma schema and service logic in [backend/src/orders/orders.service.ts](backend/src/orders/orders.service.ts).
- **Prisma integration:** A `PrismaService` wraps the generated client to avoid ESM/Jest issues: [backend/src/prisma/prisma.service.ts](backend/src/prisma/prisma.service.ts).
- **Migrations & seed:** Schema migrations have been applied; a seeding script exists at [backend/prisma/seed.ts](backend/prisma/seed.ts).

**Notable design decisions**
- Prisma client is used via `@prisma/client` and exposed from `PrismaService` to ensure compatibility with Jest and Nest's DI.
- Secrets are required at startup (the app uses `ConfigService.getOrThrow('JWT_SECRET')`) so missing critical env vars fail fast.
- Migrations that introduce required columns were applied carefully (nullable -> backfill -> enforce NOT NULL) — at one point a clean DB reset was performed per project decision.

**Setup (local development)**
Prerequisites: Node.js (18+), npm, PostgreSQL (local or container).

1. Install dependencies

```bash
cd backend
npm install
```

2. Provide environment variables
- Copy or create `.env` at `backend/.env` (see `backend/.env.example` if present). Minimal required variables:

```text
DATABASE_URL=postgresql://user:pass@localhost:5432/aquaops_dev
JWT_SECRET=supersecret
```

3. Run migrations and seed (development)

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

4. Run the app

```bash
cd backend
npm run start:dev
```

**Testing**
- Unit tests:

```bash
cd backend
npm test
```

- E2E tests (ensure `JWT_SECRET` is set in your environment):

```bash
cd backend
npm run test:e2e
```

**Key files**
- `backend/src/prisma/prisma.service.ts` — Prisma wrapper provider
- `backend/prisma/schema.prisma` — canonical DB schema and enums
- `backend/src/auth` — auth module, DTOs, controller, strategy
- `backend/src/orders` — orders, payments, dispatch logic and APIs
- `backend/prisma/seed.ts` — development seeding script

**Current limitations & next steps**
- Role-based access control (RBAC) and permission enforcement beyond the basic `JwtAuthGuard`.
- Real payment gateway integration (only bookkeeping is implemented today).
- Driver-facing APIs, notification delivery (push/SMS/email), and assignment optimisation.
- Frontend apps (customer/driver/admin) need implementation and integration.
- CI/CD workflows and containerized deployment manifests (partial infra present but not finished).

If you want, I can:
- Add a `backend/.env.example` and `frontend/.env.example` file (recommended).
- Implement RBAC and role-aware guards.
- Start the customer-facing frontend scaffold and wire basic auth flows.

----
Last updated: 2026-06-06 — summary of backend work, migrations, seeds, tests, and orders/payment/dispatch features.
