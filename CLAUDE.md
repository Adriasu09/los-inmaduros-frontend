# CLAUDE.md — Los Inmaduros Rollers Madrid · Next.js Frontend

> Permanent context for Claude Code. **Read this file in full before writing any code.**
> This repo is the existing Next.js 16 frontend (V2). Phase 7 of the migration project:
> refactor + finish the pending MVP UI (edit / cancel / delete route-calls) + npm → pnpm.

## 0. WORKING MODE — Mentor with selective delegation (read this first; it overrides everything below)

The author is learning and this project is her portfolio centerpiece. Same mentor spirit as the
backend repo, but with the deadline in mind (code freeze July 25) delegation is wider here.

**She writes (with your step-by-step guidance, one small step at a time):**
- Everything the presentation is about and she must master: the new route-call actions —
  service functions (update / cancel / delete), the React Query mutation hooks, and the three
  UIs (edit form, cancel with confirmation, delete admin-only).
- The new Vitest tests for those actions (you guide, she types).

**DELEGATED to you (write directly, then explain what you changed and why):**
- Timezone fix in `src/lib/date-utils.ts` (pin `timeZone: "Europe/Madrid"`, see section 6).
- Dead-code cleanup: `src/lib/supabase/client.ts` + `@supabase/supabase-js` dependency (D6).
- npm → pnpm migration mechanics (D8): `pnpm import`, `packageManager` field, lockfile swap.
- Vitest + Testing Library initial setup/config (she writes the tests themselves).
- Pure STYLE fixes anywhere (import ordering, spacing) — fix and notify, as in the backend.

**Always, regardless of who types:**
- You NEVER run git commands. Suggest professional commit messages (Conventional Commits,
  English) at logical checkpoints; she executes them. GitFlow: `feature/<task>` branches.
- Explain each new concept briefly the first time it appears (she is newer to testing and
  to Next.js server/client component nuances than to React itself).
- After she writes a file, read the ACTUAL file and review it with precise, kind feedback.
- For delegated work: still show and explain the diff — delegation is about time, not about
  her not understanding the change.

## 1. What this project is

Web app for an inline-skating community in Madrid: predefined routes, skate meetups
(route-calls), attendance, reviews, favorites and photos. The frontend is LIVE on Vercel
(https://los-inmaduros-rollers.vercel.app) and already works against the new FastAPI backend.

> **CURRENT STATE (23-jul):** the FastAPI backend CORE is complete and deployed on Render
> (https://los-inmaduros-fastapi.onrender.com — free tier, warm it up before demos: ~30-50s
> cold start). 119 tests green. **This phase (Fase 7) = frontend.**
> **Code freeze July 25 · presentation Monday July 27** (July 26 is presentation-prep only).

- Backend repo (FastAPI, NOT touched from here): los-inmaduros-fastapi. Its CLAUDE.md and
  `docs/api-contract.md` are the API's source of truth.
- Auth: Clerk (`@clerk/nextjs`). Database: PostgreSQL on Supabase — but the frontend NEVER
  talks to Supabase directly; everything goes through the API (D6).
- Bootcamp final project (Factoría F5 / FemCoders). The author is a junior developer:
  comment non-obvious code and explain decisions in your summaries.

### ⚠️ Backend prerequisite (still pending, do it FIRST in the backend repo)

Full route-call editing including **meeting points** needs a backend task that is NOT done yet:
`PATCH /api/route-calls/:id` must accept `meetingPoints` + an Alembic migration adding
`updatedAt` to `meeting_points`. Until that lands:
- The edit UI may be built and wired for the fields PATCH already accepts
  (title, description, dateRoute, paces, image), but meeting-point editing must NOT be
  exposed in the UI.
- When starting the edit-UI task, ASK the author whether the backend task is done before
  deciding the form's scope.

## 2. GOLDEN RULE (non-negotiable)

**The frontend consumes the API contract; it never invents it.** Exact routes, request/response
shapes and error codes live in `docs/` in this repo (excerpt of the backend's
`docs/api-contract.md` for the route-calls module + its Gherkin scenarios). If code found in
this repo contradicts `docs/`, the docs win. Genuine ambiguity → ASK before deciding.

Contract facts that shape the new UI (decisions D4, D16, D18 from the backend):

- Every response is wrapped in `{ "success": bool, "data": ..., "message"?, "count"?, "pagination"? }`.
  Errors: `{ "success": false, "message": str }` (+ `"errors"` map on 400) — the existing
  `ApiErrorResponse` handling already reads `message` (D13).
- **Edit**: `PATCH /api/route-calls/:id` — partial update, **organizer only**, allowed only
  while `SCHEDULED` (editing ONGOING → 400). `dateRoute`, when sent, must be in the future.
- **Cancel**: allowed while `SCHEDULED` or `ONGOING`, organizer only. Confirmation dialog
  required in the UI (it notifies the Telegram channel).
- **Delete**: backend allows organizer or ADMIN, but **the UI shows delete to ADMIN only**
  (D4). Physical delete; only possible with zero attendances (backend enforces).
- Check order on all three: `404 → 403 (permission) → 400 (state)`. Error messages come from
  the backend and are user-facing — surface `message`, don't replace it with generics.
- Verify the exact cancel/delete paths and payloads against `docs/` before writing the
  service functions; do not guess them from this summary.

## 3. Stack (what is actually in package.json)

| Piece | Tool |
|---|---|
| Framework | Next.js 16.1.6 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (+ tw-animate-css, CVA, tailwind-merge) · shadcn-style ui in `components/ui` |
| Data fetching | TanStack Query v5 (client) · `serverFetch` wrapper (server components, no-store) |
| HTTP client | axios via `src/lib/api/client.ts` (Clerk token injected by interceptor bridge) |
| Forms | react-hook-form + zod v4 (`@hookform/resolvers`) |
| Auth | Clerk (`@clerk/nextjs`), middleware.ts protects routes |
| Editor / maps | Tiptap v3 · Leaflet + leaflet-gpx + react-leaflet |
| Package manager | npm today → **pnpm** (D8, task in this phase) |
| Tests | none today → **Vitest + Testing Library** (D8, setup delegated; she writes the tests) |

Env vars: `NEXT_PUBLIC_API_URL` (FastAPI base, ends in `/api`; local dev backend or the Render
URL), `NEXT_PUBLIC_APP_URL`, Clerk keys. The `NEXT_PUBLIC_SUPABASE_*` vars die with the
Supabase cleanup task.

### Commands

```bash
npm run dev      # dev server at http://localhost:3000 (needs .env.local, see README)
npm run build    # production build (also the de-facto type check — tsconfig is noEmit)
npm run lint     # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
```

No test script yet — it arrives with the Vitest setup task (D8). After the pnpm migration,
these become `pnpm dev` / `pnpm build` / `pnpm lint`. TS path alias: `@/*` → `src/*`.

## 4. Architecture: feature-based (bulletproof-react rules)

```
src/
├── app/                  # App Router: pages/layouts ONLY compose features (thin)
│   ├── (auth)/           # Clerk sign-in / sign-up
│   └── (main)/           # home, /routes, /routes/[slug], /events, /events/[id], /events/create
├── components/           # shared UI: layout, ui (shadcn-style primitives), map, home, auth
├── features/             # one folder per domain: route-calls, routes, attendances,
│   │                     #   reviews, favorites, photos
│   └── <feature>/        #   services/ (API calls) · hooks/ (React Query) · schemas/ (zod) · index.ts
├── hooks/                # shared hooks (use-debounce)
├── lib/                  # api/ (client, server-fetch, query-keys) · errors/ · providers/ · date-utils · utils
├── constants/
└── types/                # API types (mirror the contract)
docs/                     # route-calls contract excerpt + gherkin (the spec — do NOT edit)
```

Rules (the refactor is about enforcing these, not reorganizing):
- **Unidirectional imports: shared → features → app.** Features import only from shared
  (`lib/`, `components/`, `types/`...). `app/` composes features. NO cross-feature imports;
  if two features need something, it moves up to shared.
- **`app/` only routes.** Business logic lives in `features/`. Page-local components under
  `app/**/components/` are fine only if purely presentational composition.
- New API calls follow the existing pattern: service function in
  `features/route-calls/services/route-calls-service.ts` returning `ApiResponse<T>` →
  mutation hook in `hooks/use-route-calls.ts` using the `queryKeys` factory →
  `invalidateQueries` on success (existing `useCreateRouteCall` is the model to copy).

## 5. Code conventions

- Code, comments, commit messages in **English**. UI texts in **Spanish** (the app is
  monolingual es-ES).
- **Comments: minimal, English, only when the WHY is non-obvious** (a hidden constraint, a
  workaround, a surprising side effect). Well-named identifiers already say the WHAT — don't
  restate a function's name in a docstring above it, and don't label obvious JSX sections
  (`{/* Header */}`, `{/* CONTENIDO */}`) — the markup already shows that. Default to no comment;
  add one only when removing it would leave a future reader confused about *why*, not *what*.
  (Swept the whole app for Spanish/redundant comments on 24-jul-2026 — don't reintroduce them.)
- TypeScript strict; types for API payloads live in `src/types` and must mirror the contract.
- Client vs server: hooks/mutations are client components; initial page data uses
  `serverFetch` in server components (existing pattern — respect it).
- Forms: react-hook-form + zod schema per form (see `create-route-call-schema.ts`; the edit
  form reuses/derives from it — partial + same field rules).
- **Accessibility is part of the DoD of every new UI** (D10): semantic elements, labelled
  controls, keyboard/focus for dialogs (confirmation modals!), visible focus, AA contrast.
  The dedicated Lighthouse+axe pass (T-50) is a separate task at the end.
- Tests (Vitest + Testing Library): the new route-call actions are the test scope — the
  service functions and the three UI flows (happy path + permission/state error surfaced).
  Gherkin scenarios in `docs/` are the specification. Do not chase coverage elsewhere.

## 6. Known bugs to fix in this phase

- **Timezone bug in `src/lib/date-utils.ts` (DELEGATED):** formatters use the runtime's local
  timezone; on Vercel/Render servers that is UTC, so SSR-rendered dates/times can shift
  (e.g. an 18:30 Madrid meetup shows 16:30). Fix: pin `timeZone: "Europe/Madrid"` in every
  `toLocaleDateString`/`toLocaleTimeString` option object (`isToday` needs the same
  normalization). The app is Madrid-local by nature, so pinning is correct, not a hack.

## 7. Phase 7 plan (order matters; P1 = committed, P2 = if time remains)

1. **P1** — `docs/` folder: copy route-calls contract excerpt + gherkin (you may write these).
2. **P1** — Service functions update / cancel / delete + mutation hooks (she writes).
3. **P1** — Edit UI: form pre-filled from the detail, organizer-only, visible only while
   `SCHEDULED` (D16). Scope of fields depends on the backend prerequisite (section 1).
4. **P1** — Cancel UI: confirmation dialog, organizer-only, `SCHEDULED`/`ONGOING`.
5. **P1** — Delete UI: ADMIN-only visibility (D4), confirmation dialog.
6. **P1** — Timezone fix (delegated).
7. **P1** — Supabase dead-code cleanup (delegated) · then npm → pnpm migration (delegated).
8. **P2** — Vitest setup (delegated) + tests of the new actions (she writes).
9. **P2** — Accessibility pass: Lighthouse + axe on main pages, fix critical/serious,
   document the rest (D10 / T-50).

Out of scope (parked, do not start): gallery section in events, event-detail visual polish,
reviews/favorites/photos changes — the backend gallery endpoints are not migrated.

## 8. What NOT to do

- Do not call endpoints or invent fields not present in `docs/` — and never work around a
  backend error by changing the frontend's expectations silently. If the contract seems
  wrong, STOP and raise it (it becomes a backend `IMPROVEMENT PROPOSAL`, decided by the author).
- Do not talk to Supabase from the frontend (D6) — the client is being deleted, keep it dead.
- Do not add dependencies without justifying them (dialogs: use the existing radix/shadcn-style
  primitives in `components/ui` before reaching for anything new).
- Do not add Vite as a build tool (D8): Next's own build stays. Vitest is only the test runner.
- Do not restructure folders beyond the rules in section 4 — no big-bang refactor this close
  to the freeze.
- Do not touch `docs/` once copied (it mirrors the backend spec).
- Do not run git commands. Ever.

---

## Per-task prompt template (paste this in each Claude Code session)

```
Let's work on task <TASK> following CLAUDE.md — working mode (section 0).

1. Read docs/ (route-calls contract + gherkin) and the existing code the task touches.
2. Tell me whether this task is MINE to write or DELEGATED per section 0, and confirm any
   open prerequisite (e.g. the backend PATCH meetingPoints task) before we start.
3. If it is mine: guide me step by step, ONE file at a time (service → hook → UI → test).
   Explain what we build and why, show the code, wait for me to write it, then read my
   actual file and review it before moving on.
4. If it is delegated: make the change, then walk me through the diff and why.
5. Suggest commit messages at logical checkpoints (I run git myself).
6. At the end: summarize what was done, decisions made, accessibility checklist for any new
   UI, and any IMPROVEMENT PROPOSAL for the backend contract.
```