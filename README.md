# OSB — Open Studio Beats

[![CI](https://github.com/ritterpw/osb_t3/actions/workflows/ci.yml/badge.svg)](https://github.com/ritterpw/osb_t3/actions/workflows/ci.yml)

A collaborative platform for music producers: post a beat (an "idea"), other
producers contribute remixes/stems, and the original artist approves or rejects
each contribution.

This README is also a tour of the engineering decisions, trade-offs, and the
recent Supabase → Neon migration.

---

## Stack

| Layer       | Choice                                                         | Why                                                                                                |
| ----------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Frontend    | Next.js 12 (Pages router), React 18, Tailwind                  | T3-stack default. Pages router is fine; App Router is a later migration.                           |
| API         | tRPC v9                                                        | End-to-end type safety without codegen. v10 migration is on the roadmap.                           |
| ORM         | Prisma 4.16                                                    | Strong types, NextAuth adapter, easy schema evolution.                                              |
| DB          | Postgres on **[Neon](https://neon.tech)** (serverless)          | Branchable Postgres, generous free tier, `pgbouncer`-pooled URL for serverless query patterns.      |
| Auth        | NextAuth.js v4 with Google OAuth + Prisma adapter              | JWT strategy; `userId` is propagated through the JWT callback so the tRPC layer can read it server-side. |
| File upload | S3 presigned PUT                                               | Audio files (`.mp3`/`.wav`) go straight from browser → S3, never through the API.                  |
| Testing     | Vitest + `@testcontainers/postgresql` for integration; Playwright for E2E | See the [Testing](#testing) section.                                                              |

## Architecture

```
 Browser
   │  (NextAuth session cookie)
   ▼
 Next.js page  ──tRPC──▶  /api/trpc/[trpc]
                              │
                              ├─ context: getServerSession(authOptions) → ctx.session
                              ├─ Prisma → Neon (pooled URL)
                              └─ S3 presign endpoint
```

Two URLs to Neon:

- `DATABASE_URL` — the `pgbouncer`-pooled host, used by the running app. Required
  for serverless because every cold start opens a new connection; pooling
  prevents Postgres connection exhaustion.
- `DIRECT_URL` — direct host, used by Prisma for migrations and introspection
  (operations that don't tolerate the pooler).

## Security model

The auth model is enforced in [`src/server/router/auth-helpers.ts`](src/server/router/auth-helpers.ts).
Two helpers:

- `requireUserId(ctx)` — pulls the user id from the NextAuth session. Throws
  `UNAUTHORIZED` if missing. **No mutation accepts a `userId` from input** —
  trusting client-supplied user ids would let any caller act as anyone.
- `requireAdminId(ctx)` — additionally loads the user's role from the database
  (not from the JWT, which can be stale) and verifies it's `ADMIN`. Used for
  contribution moderation.

`addIdea` enforces a **3-ideas-per-day** rate limit per user using a DB count
against the `Idea.createdAt` index. No external rate-limiter (e.g. Upstash);
the DB already knows the answer and the cost is negligible.

## Testing

Two layers, both in CI:

### Integration (Vitest + testcontainers)

[`tests/idea.test.ts`](tests/idea.test.ts) and
[`tests/contribution.test.ts`](tests/contribution.test.ts) spin up a real
Postgres 16 container, push the Prisma schema, and call tRPC procedures via
`appRouter.createCaller(ctx)` — bypassing HTTP, so the test is the contract
between input → DB state.

What they cover:

- **Auth**: unauthenticated calls return `UNAUTHORIZED`; you can't post on
  someone else's behalf because input no longer takes `userId`.
- **Rate limit**: 3 ideas in a day succeed; the 4th throws `FORBIDDEN`; ideas
  from yesterday don't count; user A hitting the limit doesn't affect user B.
- **Likes**: connect/disconnect on the `_IdeaUserLikes` join behaves correctly.
- **Moderation**: only `ADMIN` users can approve/reject; non-admins get
  `FORBIDDEN`. Status starts at `PENDING` and clients cannot self-approve.

```bash
# Docker must be running locally
npm test
```

### E2E (Playwright)

[`tests/e2e/`](tests/e2e/) — minimal smoke test today. Authenticated
flows are covered at the integration layer where the security logic lives;
extending Playwright to drive an authenticated session is documented in
[`tests/e2e/README.md`](tests/e2e/README.md).

```bash
npx playwright install chromium
npm run test:e2e
```

## Local development

```bash
git clone https://github.com/ritterpw/osb_t3.git
cd osb_t3
npm install
cp .env.example .env   # fill in Neon URLs, Google OAuth, S3 creds, SECRET
npx prisma db push     # initial schema
npm run dev
```

## Migration story: Supabase → Neon

The DB lived on Supabase; recently migrated to Neon for branching, simpler
billing, and a cleaner Postgres-only mental model. The shape of the migration:

1. **Dump** with `pg_dump` (custom format) from Supabase.
2. **Schema** applied to Neon via `prisma db push` — the existing `migrations/`
   folder still carried MySQL-flavored migrations from a much earlier
   PlanetScale era and was incompatible with Postgres.
3. **Data** loaded with `psql -f data-only.sql`, with COPY blocks reordered to
   satisfy foreign keys (Neon doesn't grant `session_replication_role`).
4. **Migrations baselined** afterward with `prisma migrate diff
   --from-empty --to-schema-datamodel … > 0_init/migration.sql` and marked
   `--applied`, so future schema changes flow through the normal `migrate dev`
   workflow on a clean Postgres history.

## Roadmap

- [ ] Migrate tRPC v9 → v10 (router builder, query/mutation procedures)
- [ ] Migrate Next.js 12 → 13 (Pages router stays; App Router is a later effort)
- [ ] Authenticated Playwright flows with a test-only credentials provider
- [ ] Replace remaining inline `any` casts in components/

## Scripts

| Command                 | What it does                                                     |
| ----------------------- | ---------------------------------------------------------------- |
| `npm run dev`           | Next dev server                                                  |
| `npm run build`         | Production build                                                 |
| `npm run check-types`   | `tsc --noemit`                                                   |
| `npm run lint`          | Type-check + ESLint                                              |
| `npm test`              | Vitest integration suite (needs Docker)                          |
| `npm run test:watch`    | Vitest in watch mode                                             |
| `npm run test:coverage` | Coverage report                                                  |
| `npm run test:e2e`      | Playwright E2E                                                   |
