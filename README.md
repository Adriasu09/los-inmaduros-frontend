<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/Logo_dark.png">
  <img alt="Los Inmaduros Rollers Madrid" src="./public/Logo_light.png" width="320">
</picture>

# los-inmaduros-frontend

*(Los Inmaduros Rollers Madrid — web client)*

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-live-000000?style=flat-square&logo=vercel)](https://los-inmaduros-rollers.vercel.app)

Community platform for Madrid's urban skating scene: discover routes, organize meetups and track attendance.

Web client for **Los Inmaduros Rollers Madrid**, a real inline-skating community of 500+ skaters. It replaces the group's scattered WhatsApp and Telegram threads with a single place to publish routes, call a meetup, join it, and keep the photos and reviews that come out of it.

This repository is the **Next.js frontend**. It consumes a separate [FastAPI backend](https://github.com/Adriasu09/los-inmaduros-fastapi) and never talks to the database directly.

**Live:** https://los-inmaduros-rollers.vercel.app

## Table of Contents

- [Background](#background)
- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Architecture](#architecture)
- [Engineering notes](#engineering-notes)
- [API](#api)
- [Deployment](#deployment)
- [Project status](#project-status)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

Skating meetups in Madrid were announced in massive WhatsApp and Telegram groups, where they scrolled out of sight within hours. There was no reliable way to know which routes existed, who was coming, or what happened on the last ride.

The project started as a bootcamp final project (Factoría F5 · FemCoders) and grew into a production application the community actually uses. It has gone through three iterations:

1. **V1/V2** — Next.js frontend against an Express + Prisma API.
2. **Backend migration** — the API was rewritten in **FastAPI** (SQLAlchemy 2.0, Alembic, Clerk, APScheduler) against the same PostgreSQL database, keeping the HTTP contract intact so the frontend never broke.
3. **This phase** — completing the meetup management UI (edit / cancel / delete), hardening error handling, and migrating tooling to pnpm.

The API contract is the source of truth for this repository: the frontend consumes it and never invents it. The route-calls slice of that contract, plus its Gherkin scenarios, is mirrored under [`docs/`](./docs).

## Features

**Routes**
- Catalogue of predefined skating routes with difficulty levels
- GPX tracks rendered on interactive Leaflet maps, with start/finish markers and a fullscreen view
- Ratings, reviews and per-route photo galleries with a zoomable lightbox
- Favourites, search and level filtering

**Meetups (route calls)**
- Create a meetup with a rich-text description (Tiptap), pace selection and cover image
- Primary and secondary meeting points picked on a map, with independent times
- **Edit, cancel and delete**, each gated by the organizer/admin rules of the API contract
- Live attendance with avatar stacks; join or leave in one click
- Share to WhatsApp with a preformatted message (native share sheet with image on mobile)
- Automatic announcements to the community's Telegram channel (fired by the backend)

**Platform**
- OAuth authentication with Clerk and middleware-protected routes
- Dark and light themes
- Server-rendered pages with client-side caching and optimistic invalidation

## Install

### Prerequisites

- **Node.js 20+**
- **pnpm** — pinned via the `packageManager` field; enable it with `corepack enable pnpm`
- A running instance of the [FastAPI backend](https://github.com/Adriasu09/los-inmaduros-fastapi) (local or deployed)
- A [Clerk](https://clerk.com) application (the same instance the backend validates tokens against)

### Setup

```bash
git clone https://github.com/Adriasu09/los-inmaduros-frontend.git
cd los-inmaduros-frontend
pnpm install
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Public URL of this app (used in shared links) |
| `NEXT_PUBLIC_API_URL` | Base URL of the API, **ending in `/api`** |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side only) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `..._SIGN_UP_URL` | Auth route paths |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` / `..._SIGN_UP_...` | Post-auth redirects |

## Usage

```bash
pnpm dev      # development server at http://localhost:3000
pnpm build    # production build — also the de facto type check (tsconfig is noEmit)
pnpm lint     # ESLint (flat config, next/core-web-vitals + typescript)
pnpm start    # serve a production build
```

### Running against a local backend

Point `NEXT_PUBLIC_API_URL` at your local API (`http://localhost:8000/api` by default).

> **Note:** the deployed backend only allows the production origin in its CORS configuration. If you point `NEXT_PUBLIC_API_URL` at the deployed API while developing on `localhost`, server-rendered pages will work but **browser requests will be blocked by CORS** — attendances, favourites, reviews and photos will appear empty. That is expected; run the backend locally to work on those features.

## Architecture

Feature-based structure following [bulletproof-react](https://github.com/alan2207/bulletproof-react) conventions, with **unidirectional imports: shared → features → app**.

```
src/
├── app/              # App Router — pages compose features, no business logic
│   ├── (auth)/       # Clerk sign-in / sign-up
│   └── (main)/       # home, routes, events, event detail, create, edit
├── components/       # shared UI: ui primitives (Radix-based), map, layout
├── features/         # one folder per domain
│   └── <feature>/    #   services/ · hooks/ · schemas/ · components/ · index.ts
├── hooks/            # shared hooks
├── lib/              # api client · auth · errors · providers · date-utils
├── constants/
└── types/            # API types mirroring the contract
docs/                 # API contract excerpt + Gherkin specs
```

**Data flow.** Initial page data is fetched in Server Components through a `serverFetch` wrapper (`no-store`). Everything interactive runs through TanStack Query against an axios client that injects the Clerk JWT via an interceptor. Mutations invalidate the relevant query keys and call `router.refresh()` when the affected view is server-rendered.

## Engineering notes

A few decisions worth calling out, all of them the result of bugs found in review rather than upfront design:

**Time zones are pinned, not inherited.** Date formatting used the runtime's zone, which is Madrid in the browser but UTC on Vercel — the same meetup rendered 12:50 client-side and 10:50 from a Server Component. Every formatter now pins `Europe/Madrid`, and the edit form converts between Madrid wall-clock time and UTC instants with a DST-aware, two-pass offset lookup, so a meetup scheduled on a changeover day lands on the right hour.

**Backend error messages actually reach the user.** The axios interceptor was passing an `AxiosResponse` to a handler written for `fetch`, so every HTTP error silently fell back to a generic string. Error handling now reads the API's `{ success, message, errors }` envelope, maps validation errors to their form fields, and surfaces the backend's own wording.

**Permissions are mirrored, not invented.** A single hook derives `canEdit` / `canCancel` / `canDelete` from the contract's rules and the current user's identity and role. The UI is deliberately *stricter* than the API in one case (cancelling is offered to the organizer only, though the backend also allows admins) — being narrower than the server is safe; the reverse offers actions that fail.

**Destructive actions use real dialog primitives.** Confirmations are built on Radix `AlertDialog`, which provides focus trapping, focus restoration and `Escape` handling. When a meetup already has attendees, the delete dialog detects it, withdraws the destructive action and points the admin to cancellation instead.

## API

This client consumes the REST API documented in the [backend repository](https://github.com/Adriasu09/los-inmaduros-fastapi). Every response is wrapped in an envelope:

```jsonc
{ "success": true, "data": { }, "message": "…", "pagination": { } }
```

```jsonc
{ "success": false, "message": "…", "errors": { "field": ["…"] } }
```

The route-calls slice of the contract, together with its Gherkin behaviour specs, is mirrored in [`docs/`](./docs) as the working reference for this repository.

## Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel — automatic deploys from `main` |
| API | Render (FastAPI) |
| Database & storage | Supabase (PostgreSQL + object storage, reached only through the API) |
| Authentication | Clerk |

> The API runs on Render's free tier and sleeps after inactivity, so the first request after an idle period can take 30–50 seconds.

## Project status

Shipped and in use by the community. Currently in progress:

- [ ] Unit and component tests (Vitest + Testing Library)
- [ ] Full accessibility audit (Lighthouse + axe) beyond the per-component checks already applied
- [ ] Photo galleries for meetups, pending the corresponding API endpoints

## Maintainers

[@Adriasu09](https://github.com/Adriasu09) — Adriana Suárez

## Contributing

Questions, bug reports and ideas are welcome in the [issue tracker](https://github.com/Adriasu09/los-inmaduros-frontend/issues).

PRs accepted. Before opening one:

- Branch off `develop` using `feature/<task>` (GitFlow).
- Write commit messages in English following [Conventional Commits](https://www.conventionalcommits.org/).
- Keep code, comments and identifiers in English; UI copy is Spanish (the app is monolingual es-ES).
- Make sure `pnpm lint` and `pnpm build` pass.
- Follow the API contract in [`docs/`](./docs) — if it looks wrong, raise it in an issue instead of working around it in the client.

## License

MIT © 2026 Adriana Suárez
