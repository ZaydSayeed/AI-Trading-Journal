# Roadmap

Where the project stands and the work ahead, roughly in the order I plan to do it.
Hour figures are my own estimates.

## Where it is today

| Piece | State |
|---|---|
| Trade CRUD (add, list, edit, delete) through FastAPI + Supabase | Working |
| Dashboard, history, add-trade, profile and settings pages | Working; frontend builds cleanly |
| AI coach: per-trade feedback, journal-wide review, chat (Groq API) | Working with your own Groq key |
| Equity curve / monthly P&L / profit charts | Components exist; not yet wired to real stats |
| Sign-in | **Placeholder**: stores an email in `localStorage`, no password or session |
| Per-user data | **Not scoped**: every request reads and writes one shared `trades` table |

It's meant to be self-hosted: you run it against your own Supabase project and your own Groq key,
and it holds only the trades you enter yourself.

## Known bugs

- [ ] **Trades aren't scoped to a user.** `user_id` exists in the schema but is never set, and
      `GET /trades` returns every row. *(~2h, together with real auth below)*
- [ ] **Frontend ignores `VITE_BACKEND_URL`.** `src/api/client.ts` hardcodes
      `http://127.0.0.1:8000`, so the documented setting does nothing. *(~0.5h)*
- [ ] **Settings use a hardcoded `'default'` user.** *(~1h)*
- [ ] The production bundle is one 845 kB chunk; split routes with dynamic imports. *(~1h)*

## Phase 1: Real accounts and data safety (~10h)

- [ ] Replace the placeholder sign-in with Supabase Auth (email + password, sessions). *(~4h)*
- [ ] Send the user's token to the API, verify it in FastAPI, and set `user_id` on every write. *(~3h)*
- [ ] Row-level security policies on `trades` and settings so each user only sees their own rows. *(~2h)*
- [ ] Move settings out of a local JSON file on the server into a per-user Supabase table. *(~1h)*

## Phase 2: Analytics that are actually computed (~10h)

- [ ] Server-side stats endpoint: win rate, average R, expectancy, max drawdown, P&L by setup and tag. *(~4h)*
- [ ] Wire the equity curve, monthly P&L and profit charts to it. *(~3h)*
- [ ] Position size and fees on each trade, so P&L is in dollars and not just per-share. *(~3h)*

## Phase 3: Quality (~10h)

- [ ] pytest suite for the trade routes and P&L maths, with Supabase mocked. *(~4h)*
- [ ] Vitest + Testing Library for the add-trade form and the dashboard. *(~3h)*
- [ ] GitHub Actions CI: lint, type-check, build and both test suites. *(~1h)*
- [ ] Upgrade the pinned backend dependencies (FastAPI, supabase-py, groq). *(~2h)*

## Phase 4: Features (~12h)

- [ ] CSV import from broker exports, with a column-mapping step. *(~5h)*
- [ ] Screenshot attachments per trade via Supabase Storage. *(~3h)*
- [ ] Rule tracking: define your trading rules and flag trades that broke them, feeding the AI review. *(~4h)*

## Phase 5: Ship it (~4h)

- [ ] Docker Compose for one-command self-hosting. *(~2h)*
- [ ] Deploy a demo instance with seeded, made-up trades. *(~2h)*

**Total: about 50 hours.**
