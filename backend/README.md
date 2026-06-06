# AquaOps Backend

NestJS + Prisma backend for AquaOps.

## Current backend shape

- `User` now uses `firstName`, `lastName`, `email`, and required `passwordHash`.
- Passwords are always hashed with `bcrypt` before storage.
- Auth uses JWT with `JWT_SECRET` loaded from environment through `ConfigService`.
- Prisma migrations are the source of truth for schema changes.

## Setup

```bash
cd backend
npm install
```

## Environment

Create a `.env` file with at least:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/aquaops"
JWT_SECRET="replace-with-a-long-random-secret"
```

## Prisma workflow

```bash
npx prisma migrate dev --schema=./prisma/schema.prisma
npx prisma generate --schema=./prisma/schema.prisma
npx prisma db seed
```

## Seed data

The database seed creates a demo admin user:

- Email: `admin@aquaops.local`
- Password: `Password123!`

## Run

```bash
npm run start:dev
```

## Test

```bash
npm run test
npm run test:e2e
npm run build
```

## Notes

- The clean-slate migration path was chosen because there were no real users in the database.
- If you change the Prisma schema again, run migrate + generate before rebuilding.
