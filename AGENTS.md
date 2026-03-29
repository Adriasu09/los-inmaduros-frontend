# AGENTS.md — Los Inmaduros Roller Madrid Frontend

Working instructions for AI coding agents operating on this codebase. Read the relevant sections before generating or editing code. All examples reference real files in this repo.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Dev Commands](#2-dev-commands)
3. [Architecture Map](#3-architecture-map)
4. [File Naming Conventions](#4-file-naming-conventions)
5. [Design System](#5-design-system)
6. [Component Authoring Rules](#6-component-authoring-rules)
7. [State and Data Patterns](#7-state-and-data-patterns)
8. [API Conventions](#8-api-conventions)
9. [Auth Conventions](#9-auth-conventions)
10. [TypeScript Conventions](#10-typescript-conventions)
11. [DRY Enforcement](#11-dry-enforcement)
12. [Anti-Patterns to Avoid](#12-anti-patterns-to-avoid)

---

## 1. Project Overview

**Los Inmaduros Roller Madrid** is a community platform for urban skating in Madrid. Users can browse skating routes, mark favorites, leave reviews, and upload photos.

**Core stack:**
- Next.js 16 (App Router) — `next@16.1.6`
- React 19, TypeScript 5
- Tailwind CSS v4 (no config file — all tokens live in `src/app/globals.css`)
- Shadcn UI components (installed via `shadcn` CLI, output to `src/components/ui/`)
- TanStack React Query v5 for all client data fetching
- Clerk for authentication (`@clerk/nextjs`)
- Axios via a singleton `HttpClient` at `src/lib/api/client.ts`
- Zod + React Hook Form for form validation
- Supabase (storage only — not used for auth or DB)

**Language:** The UI is in Spanish. Keep all user-visible strings in Spanish unless explicitly asked otherwise.

---

## 2. Dev Commands

```bash
npm run dev      # start local dev server
npm run build    # production build — use this to verify TS/build correctness
npm run lint     # ESLint
```

There is no test runner configured. Validate correctness by running `npm run build` and `npm run lint` after any change.

---

## 3. Architecture Map

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: ClerkProvider, ThemeProvider, QueryProvider, ClerkAxiosSync
│   ├── globals.css             # ALL design tokens and typography utilities — single source of truth
│   ├── error.tsx               # Global error boundary (Client Component)
│   ├── not-found.tsx           # 404 page
│   └── (main)/                 # Route group with shared navbar/footer layout
│       ├── layout.tsx
│       ├── page.tsx            # Home → Server Component
│       └── routes/
│           ├── page.tsx        # Routes list → Server Component, calls getRoutesServer()
│           ├── components/     # Page-local components (RouteCard, RouteGrid, RouteLevelBadge…)
│           └── [slug]/
│               ├── page.tsx    # Route detail → Server Component, calls getRouteBySlugServer()
│               ├── components/ # Page-local components (RouteDetailHero, RouteReviews…)
│               └── hooks/      # Page-local hooks (use-lightbox)
│
├── features/                   # Domain features — primary business logic lives here
│   ├── routes/
│   │   ├── hooks/use-routes.ts
│   │   ├── services/routes-service.ts
│   │   └── index.ts            # Barrel — exports hooks and services
│   ├── favorites/
│   ├── reviews/
│   ├── photos/
│   └── route-calls/
│
├── components/
│   ├── ui/                     # Reusable design-system-level components (Button, ImageUploadModal…)
│   ├── auth/                   # Auth bridge: ClerkAxiosSync
│   ├── home/                   # Home-page-specific components (HeroSection)
│   └── layout/                 # Navbar, Footer
│
├── lib/
│   ├── api/
│   │   ├── client.ts           # HttpClient singleton — the only HTTP abstraction in the app
│   │   ├── query-keys.ts       # Centralized queryKeys factory
│   │   └── server-fetch.ts     # serverFetch() — used ONLY in Server Components / page.tsx
│   ├── errors/
│   │   ├── api-error.ts        # ApiError class with .is() and .isRetryable()
│   │   ├── error-handler.ts    # handleApiError(), handleNetworkError()
│   │   └── types.ts            # ApiErrorCode, ApiErrorResponse
│   ├── providers/
│   │   └── query-provider.tsx  # QueryClient setup with global defaults
│   ├── supabase/client.ts      # Supabase client (storage uploads only)
│   └── utils.ts                # cn(), normalize(), BLUR_DATA_URL
│
├── types/index.ts              # ALL shared TypeScript types — single source of truth
├── constants/index.ts          # ALL app constants (ROUTE_LEVELS, ROUTE_PACES, NAV_LINKS…)
└── hooks/
    └── use-debounce.ts         # Shared generic hooks (not feature-specific)
```

### Server vs Client component rule

Pages (`page.tsx`) are **async Server Components** by default. They call `*Server()` functions from feature services to prefetch data. Interactive UI within those pages is extracted into **Client Components** (`"use client"`) that receive data as props or re-fetch via React Query hooks.

```tsx
// CORRECT — src/app/(main)/routes/page.tsx
export default async function RoutesPage() {
  const response = await getRoutesServer();        // server-side fetch
  const routes = response?.data ?? [];
  return <RouteGrid routes={routes} />;            // RouteGrid is "use client"
}

// CORRECT — src/app/(main)/routes/[slug]/page.tsx
export default async function RouteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await getRouteBySlugServer(slug);
  if (!response?.success || !response?.data) notFound();
  return <RouteDetailHero route={response.data} />;
}
```

**Never** put `"use client"` on a `page.tsx`. If a page needs interactivity, extract the interactive part to a separate component file.

---

## 4. File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `RouteCard.tsx`, `Button.tsx` |
| React hooks | `use-kebab-case.ts` | `use-routes.ts`, `use-debounce.ts` |
| Service files | `kebab-service.ts` | `routes-service.ts`, `favorites-service.ts` |
| Utilities / helpers | `kebab-case.ts` | `utils.ts`, `error-handler.ts` |
| Feature barrels | `index.ts` | `src/features/routes/index.ts` |

---

## 5. Design System

### Color tokens

All colors come from CSS custom properties defined in `src/app/globals.css`. Use Tailwind utility classes that reference these tokens — never hardcode hex or oklch values inline.

| Token class | Purpose |
|---|---|
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary / supporting text |
| `text-soft-foreground` | Body text (approx. slate-600 / slate-300 dark) |
| `text-faint-foreground` | Hints, placeholders (approx. slate-400 / slate-500 dark) |
| `bg-background` | Page background |
| `bg-card` | Card / surface background |
| `bg-muted` | Subtle backgrounds, inputs |
| `text-primary` / `bg-primary` | Brand sky-blue |
| `hover:bg-primary-hover` | Hover state for primary elements |
| `text-destructive` | Danger / error / delete actions |
| `border-border` | Standard border |

### Typography utilities

These are `@utility` classes defined in `globals.css`. Use them instead of ad-hoc font-size combinations.

| Class | Approx. size | Use for |
|---|---|---|
| `text-display` | ~49px, 700 | Hero headlines |
| `text-title` | ~31px, 700 | Page titles (h1) |
| `text-heading` | 20px, 700 | Section headings (h2) |
| `text-subheading` | 18px, 700 | Card / panel headings (h3) |
| `text-body` | 16px | Main body text |
| `text-body-sm` | 14px | Secondary text, nav, labels |
| `text-caption` | 12px | Captions, badges, metadata |
| `text-label` | 12px, 600, uppercase | Form labels with tracking |
| `text-stat` | ~49px, 900 | Large numeric statistics |

**Do not** use raw `text-xl`, `text-2xl`, `font-bold`, `text-sm` etc. when a semantic utility class exists.

```tsx
// CORRECT
<h1 className="text-title text-foreground">{route.name}</h1>
<p className="text-body-sm text-soft-foreground">{route.description}</p>
<span className="text-caption text-muted-foreground">{count} reseñas</span>

// WRONG — raw Tailwind sizes instead of semantic utilities
<h1 className="text-3xl font-bold">{route.name}</h1>
<p className="text-sm text-slate-600">{route.description}</p>
```

### Border radius

Use token-based radius: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`, `rounded-full`. These map to CSS custom properties in `globals.css`.

### Dark mode

Dark mode is class-based (`class="dark"` on `<html>`), managed by `next-themes` with `defaultTheme="dark"`. All color tokens already have dark overrides in `globals.css`. Never write `dark:text-slate-xxx` — use token classes that handle both modes automatically. Only use `dark:` prefix for structural layout adjustments not covered by tokens.

### Allowed image hosts

Only these remote image sources are allowed in `next/image` (configured in `next.config.ts`):
- `dplwudttrngcnapuurkt.supabase.co` — Supabase storage
- `res.cloudinary.com` — Cloudinary
- `img.clerk.com` — Clerk user avatars

Always add the `sizes` prop to `<Image fill>` components.

---

## 6. Component Authoring Rules

### The `cn()` utility is mandatory for all className merging

`cn()` lives in `src/lib/utils.ts` and combines `clsx` + `tailwind-merge`. Use it for **every** className expression involving conditional logic or prop merging.

```tsx
import { cn } from "@/lib/utils";

// CORRECT
<div className={cn("base-classes", isActive && "active-class", className)} />

// WRONG — string concatenation
<div className={`base-classes ${isActive ? "active-class" : ""} ${className}`} />

// WRONG — cn() omitted when className prop is accepted
<div className="base-classes" />   // missing: cn("base-classes", className)
```

### CVA for components with variants

Use `class-variance-authority` when a component has multiple visual variants. See `src/components/ui/Button.tsx` as the canonical reference.

Pattern:
1. Define `const xyzVariants = cva(baseClasses, { variants: {...}, defaultVariants: {...} })`
2. Create an interface extending `React.HTMLAttributes<T>` and `VariantProps<typeof xyzVariants>`
3. Wrap with `forwardRef`
4. Apply with `cn(xyzVariants({ variant, size }), className)`

```tsx
// CORRECT — follows Button.tsx pattern
const badgeVariants = cva(
  "inline-flex items-center rounded-full text-caption font-semibold",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = "Badge";
```

### `forwardRef` requirement

Use `forwardRef` on any component that wraps a native HTML element (`button`, `input`, `span`, `div`, etc.) or a Shadcn primitive. Always set `.displayName`.

### Shadcn components

Shadcn primitives are installed via the `shadcn` CLI. **Extend them, do not replace or re-implement them.** If a Shadcn component (`Dialog`, `Popover`, `Select`, etc.) meets your need, use it. If you need custom variants, wrap it and add your own CVA layer on top.

### Component placement decision tree

1. Full-page interactive section used only by one page → `app/(main)/[route]/components/`
2. Reusable across multiple pages/features, tied to the design system → `src/components/ui/`
3. Tied to a specific domain feature → keep it in the feature's page `components/` folder
4. Layout element (navbar, footer) → `src/components/layout/`

---

## 7. State and Data Patterns

### React Query — client data fetching

All client-side data fetching uses TanStack React Query v5. Hooks live in `src/features/[feature]/hooks/`.

**Query keys must always come from `src/lib/api/query-keys.ts`:**

```ts
// CORRECT — use the factory
queryKey: queryKeys.routes.detail(slug)
queryKey: queryKeys.favorites.check(routeId)
queryKey: queryKeys.favorites.my()

// WRONG — inline string arrays
queryKey: ["routes", slug]
queryKey: ["favorites", "check", routeId]
```

**Auth-guarded queries:**

```ts
const { isSignedIn } = useAuth();
return useQuery({
  queryKey: queryKeys.favorites.my(),
  queryFn: getUserFavorites,
  enabled: !!isSignedIn,       // REQUIRED for auth-protected endpoints
});
```

**`select` transformer to shape data at the hook level:**

```ts
// CORRECT — callers receive a clean boolean, not a raw ApiResponse
return useQuery({
  queryKey: queryKeys.favorites.check(routeId),
  queryFn: () => checkIsFavorite(routeId),
  select: (res) => res.data.isFavorite,
  enabled: !!isSignedIn,
});
```

**Mutations must invalidate relevant queries on success:**

```ts
return useMutation({
  mutationFn: (data) => createReview(routeId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.routes.detail(routeSlug),
    });
  },
});
```

**Global QueryClient defaults** (defined in `src/lib/providers/query-provider.tsx`):
- `staleTime`: 60 seconds
- `gcTime`: 5 minutes
- `refetchOnWindowFocus`: false
- Auto-retry disabled for 401/403 responses

Do not override these defaults inside individual hooks unless there is a specific documented reason.

### Feature barrel exports

Every feature has an `index.ts` that re-exports its public API. Import from the barrel, not from internal paths:

```ts
// CORRECT
import { useIsFavorite, useToggleFavorite } from "@/features/favorites";

// WRONG — bypasses the barrel
import { useIsFavorite } from "@/features/favorites/hooks/use-favorites";
```

---

## 8. API Conventions

### HttpClient singleton

All HTTP calls go through the `apiClient` singleton exported from `src/lib/api/client.ts`. Never import `axios` directly in a service file.

```ts
// CORRECT
import apiClient from "@/lib/api/client";
export async function getRoutes(): Promise<ApiResponse<Route[]>> {
  return apiClient.get<ApiResponse<Route[]>>("/routes");
}

// WRONG — direct axios usage
import axios from "axios";
const res = await axios.get("/routes");
```

### ApiResponse wrapper

Every service function returns `ApiResponse<T>` (or `ApiResponse<T> | null` for server-side fetches). Always type return values explicitly.

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
}
```

### Server-side fetching vs client fetching

| Context | Use |
|---|---|
| `page.tsx` (Server Component) | `serverFetch()` from `src/lib/api/server-fetch.ts` |
| Client Component / React Query hook | `apiClient.*` methods |

```ts
// Server Component context (no auth token, cache: "no-store")
export async function getRoutesServer(): Promise<ApiResponse<Route[]> | null> {
  return serverFetch<ApiResponse<Route[]>>("/routes");
}

// Client hook context (Clerk token injected automatically)
export async function getRoutes(): Promise<ApiResponse<Route[]>> {
  return apiClient.get<ApiResponse<Route[]>>("/routes");
}
```

`serverFetch()` returns `null` on any error — always guard with `?? []` or a null check.

### Error handling

Use `ApiError` and its `.is(code)` method to discriminate errors:

```ts
import { ApiError } from "@/lib/errors";

try {
  await apiClient.post("/something", data);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.is("VALIDATION_ERROR")) { /* handle */ }
    if (error.is("UNAUTHORIZED")) { /* handle */ }
  }
}
```

Available error codes: `"NETWORK_ERROR"` | `"TIMEOUT_ERROR"` | `"UNAUTHORIZED"` | `"FORBIDDEN"` | `"NOT_FOUND"` | `"VALIDATION_ERROR"` | `"SERVER_ERROR"` | `"UNKNOWN_ERROR"`

The `HttpClient` automatically retries retryable errors (network, timeout, 5xx) with exponential backoff.

### Multipart / file uploads

Pass `{ headers: { "Content-Type": "multipart/form-data" } }` as the third argument:

```ts
return apiClient.post<ApiResponse<Photo>>("/photos", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## 9. Auth Conventions

### How Clerk integrates with Axios

`ClerkAxiosSync` (`src/components/auth/ClerkAxiosSync.tsx`) is a Client Component mounted in the root layout. It calls `setClerkTokenGetter()` to inject a token getter into `apiClient`. The request interceptor then attaches `Authorization: Bearer <token>` on every outgoing request when the user is signed in.

**You never need to manually attach auth headers.** The client handles it automatically.

### Public vs protected routes

Public routes are defined in `middleware.ts`:
- `/` — home
- `/routes(.*)` — route listing and detail
- `/route-calls(.*)` — route calls
- `/gallery(.*)` — gallery
- `/sign-in(.*)` and `/sign-up(.*)` — auth pages

All other paths require authentication. Clerk's middleware calls `auth.protect()` for non-public routes.

### Auth-gated UI interactions

When an unauthenticated user triggers an action that requires auth, use `openSignIn()` — do not redirect:

```tsx
const { isSignedIn } = useUser();
const { openSignIn } = useClerk();
const pathname = usePathname();

const handleAction = () => {
  if (!isSignedIn) {
    openSignIn({ forceRedirectUrl: pathname });  // opens Clerk modal, user stays on page
    return;
  }
  // proceed with action
};
```

### Auth-guarded queries

When `isSignedIn` is false, override `data` to a neutral default to prevent stale cache being shown after sign-out. See `src/features/favorites/hooks/use-favorites.ts` for the canonical example:

```ts
const query = useQuery({
  queryKey: queryKeys.favorites.check(routeId),
  queryFn: () => checkIsFavorite(routeId),
  select: (res) => res.data.isFavorite,
  enabled: !!isSignedIn,
});

return { ...query, data: isSignedIn ? query.data : false };
```

---

## 10. TypeScript Conventions

### All shared types live in `src/types/index.ts`

Never declare a type that already exists there. Never declare a new shared type anywhere else. If a type is used by more than one feature or component, add it to `src/types/index.ts`.

```ts
// CORRECT
import type { Route, RouteDetail, ApiResponse } from "@/types";

// WRONG — re-declaring an existing type locally
interface Route { id: string; name: string; /* ... */ }
```

Key shared types: `User`, `UserRole`, `Route`, `RouteDetail`, `RouteLevel`, `RouteCall`, `RoutePace`, `RouteCallStatus`, `MeetingPoint`, `Review`, `Favorite`, `Photo`, `PhotoContext`, `PhotoStatus`, `PaginationMeta`, `ApiResponse<T>`.

### Component prop interfaces

Define prop interfaces in the same file as the component, directly above it. Use `interface`, not `type` aliases, for component props (consistent with existing code).

### Import `type` for type-only imports

```ts
import type { Route, ApiResponse } from "@/types";
```

---

## 11. DRY Enforcement

These are hard rules. Violating them creates technical debt.

### 1. Never duplicate CSS values — use design tokens

```tsx
// CORRECT
<p className="text-soft-foreground text-body-sm" />

// WRONG — raw value copied from globals.css
<p style={{ color: "oklch(0.446 0.043 257.281)", fontSize: "0.875rem" }} />
```

### 2. Never duplicate TypeScript types — extend from `src/types/index.ts`

### 3. Never duplicate constants — use `src/constants/index.ts`

`ROUTE_LEVELS`, `ROUTE_PACES`, `NAV_LINKS`, `FOOTER_EXPLORE_LINKS`, `FOOTER_COMMUNITY_LINKS`, `SOCIAL_LINKS` — all live there. Add new app-wide constants there.

```ts
// CORRECT
import { ROUTE_LEVELS } from "@/constants";
const label = ROUTE_LEVELS[level].label;

// WRONG — local duplicate
const LEVELS = { BEGINNER: "Principiante", /* ... */ };
```

### 4. Never write raw API calls in components

Components call hooks → hooks call service functions → service functions call `apiClient`.

```tsx
// CORRECT
const { data, isLoading } = useRoutes();

// WRONG — apiClient called directly inside a component
useEffect(() => {
  apiClient.get("/routes").then(res => setRoutes(res.data));
}, []);
```

### 5. Never duplicate query keys — use `src/lib/api/query-keys.ts`

### 6. Reuse `normalize()` from `src/lib/utils.ts` for accent-insensitive search

Do not write your own normalize / accent-strip logic.

---

## 12. Anti-Patterns to Avoid

### Do not add `"use client"` to page files

`page.tsx` files are Server Components. Extract interactive parts to separate component files.

### Do not call `serverFetch()` in Client Components

`serverFetch()` is for Server Component context only. Client Components must use `apiClient` via a feature hook.

### Do not use `useState` + `useEffect` + `fetch` for server data

This pattern is obsolete in the App Router. Use React Query hooks for client data, or Server Components + `serverFetch()` for server data.

```tsx
// WRONG
const [routes, setRoutes] = useState<Route[]>([]);
useEffect(() => {
  fetch("/api/routes").then(r => r.json()).then(setRoutes);
}, []);

// CORRECT
const { data: response } = useRoutes();
const routes = response?.data ?? [];
```

### Do not concatenate classNames — always use `cn()`

```tsx
// WRONG
className={"card " + (isActive ? "card--active" : "")}
className={`card ${isActive ? "card--active" : ""}`}

// CORRECT
className={cn("card", isActive && "card--active")}
```

### Do not import from internal feature paths — use the barrel

```ts
// WRONG
import { useIsFavorite } from "@/features/favorites/hooks/use-favorites";

// CORRECT
import { useIsFavorite } from "@/features/favorites";
```

### Do not add new shared types outside `src/types/index.ts`

### Do not add new app constants outside `src/constants/index.ts`

### Do not use Tailwind's built-in color palette for brand colors

The brand color is `--primary` (sky-blue). Always use `text-primary`, `bg-primary`, `hover:bg-primary-hover`.

```tsx
// WRONG
<button className="bg-sky-400 hover:bg-sky-500">

// CORRECT
<button className="bg-primary hover:bg-primary-hover">
```

Exception: `ROUTE_LEVELS` constants intentionally use palette classes (`text-green-500`, `text-red-500`, etc.) as semantic level-specific colors — this is acceptable.

### Do not replace Shadcn components — extend them

If you need a `Dialog`, use the Shadcn `Dialog`. Only build from scratch if there is a clear documented reason the Shadcn primitive cannot be used.

### Do not use `params` without awaiting in App Router dynamic segments

In Next.js 16, `params` is a Promise:

```tsx
// CORRECT
export default async function RouteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}

// WRONG
export default async function RouteDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
}
```

### Do not use inline `style` for values that have token equivalents

Only use `style` for truly dynamic values that cannot be expressed as class names (e.g., `style={{ width: \`${percent}%\` }}` for progress bars).
