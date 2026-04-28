# E2E tests

Playwright tests that run against a live `next dev` server.

## Run

```bash
# install browsers once
npx playwright install chromium

# run
npm run test:e2e
```

The Playwright config starts `npm run dev` automatically (or reuses a running one).

## Scope

The current suite is intentionally minimal — homepage smoke + unauthenticated guard.

To E2E-test authenticated flows (post idea, like, contribute) you need:
1. A seeded test database (or a Neon branch)
2. A test-only NextAuth credentials provider that issues sessions without OAuth
3. `storageState` per-test to inject a valid session cookie

That's out of scope for this initial pass — the tRPC integration tests in
`tests/idea.test.ts` and `tests/contribution.test.ts` cover authenticated
behavior at the router level, which is where the security and rate-limit
logic actually lives.
