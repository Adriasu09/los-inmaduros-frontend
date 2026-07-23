# Frontend Contract — Route-calls management (edit / cancel / delete)

> **Scope:** the pending MVP UI of Phase 7. This is the FRONTEND-facing excerpt of the backend's
> `docs/api-contract.md` (the API's single source of truth), plus the exact TypeScript shapes the
> app already uses and the UI behaviour rules. If this file and the backend `api-contract.md`
> ever disagree, **the backend contract wins** — raise the mismatch, don't silently adapt.
>
> This doc is the spec for: the service functions, the mutation hooks, and the three UIs
> (edit / cancel / delete). It does NOT redefine create (already shipped) except where edit reuses it.

## 0. Conventions (recap)

- **Base URL:** `NEXT_PUBLIC_API_URL` (ends in `/api`). The axios client
  (`src/lib/api/client.ts`) injects the Clerk JWT via its interceptor bridge — a logged-in call
  needs no manual token handling.
- **Success envelope:** `ApiResponse<T> = { success: true, data: T, pagination?: PaginationMeta }`.
- **Error envelope (D13):** `{ success: false, message: string, errors?: { [field]: string[] } }`.
  The message is **user-facing and comes from the backend** — surface it, do not replace it with a
  generic string. `errors` (only on 400 validation) maps field → messages for inline form errors.
- **Status codes:** 400 validation/invalid state · 401 no identity · 403 no permission ·
  404 not found · 409 conflict. **Check order on the three management endpoints (D18):**
  `404 → 403 → 400` (permission is evaluated before business/state rules).
- **IDs are UUIDs.** A malformed `:id` is a 400, not a 404.

## 1. Endpoints consumed by this feature

Source of truth: backend `docs/api-contract.md`, route-calls + attendances sections.

| # | Method | Route | Purpose | Auth | Notes |
|---|---|---|---|---|---|
| 1 | GET | `/api/route-calls/:id` | Detail to pre-fill the edit form and drive action visibility | Public | Already wired (`getRouteCallById`) |
| 2 | PATCH | `/api/route-calls/:id` | **Edit** — partial update | Auth (organizer, in service) | Only while `SCHEDULED` (D16) |
| 3 | PATCH | `/api/route-calls/:id/cancel` | **Cancel** → `CANCELLED` | Auth (organizer or ADMIN, in service) | Not if already `CANCELLED`/`COMPLETED` |
| 4 | DELETE | `/api/route-calls/:id` | **Delete** (hard) | Auth (organizer or ADMIN, in service) | Only if **zero attendances**; else 400 |
| 5 | GET | `.../route-calls/:id/attendances` | Attendee count/list (to know if delete is allowed) | Public | Already available if needed |

> ⚠️ Verify the **cancel** path shape before coding: it is `PATCH /api/route-calls/:id/cancel`
> with an **empty body**. Delete is `DELETE /api/route-calls/:id`, no body. Neither returns data
> the UI must read — treat them as commands and invalidate queries on success.

## 2. Request payloads

### 2.1 Edit — `PATCH /api/route-calls/:id`

Partial update: **send only the fields the user changed.** Field rules (from the backend, D16):

| Field | Type | Rule on PATCH |
|---|---|---|
| `title` | `string` (3–100) | present ⇒ non-null; `null` → 400 |
| `description` | `string \| null` | **accepts `null`** to clear the field |
| `image` | `string` | present ⇒ non-null (a route-call always has a cover); `null` → 400 |
| `dateRoute` | ISO `string` | present ⇒ **must be in the future** (same as create) |
| `paces` | `RoutePace[]` (1–7) | present ⇒ non-empty; `null`/`[]` → 400 |
| `meetingPoints` | `MeetingPoint[]` | ⛔ **NOT accepted yet** — see prerequisite below |

```ts
// Suggested payload type (all optional; omit unchanged fields)
export interface UpdateRouteCallPayload {
  title?: string;
  description?: string | null; // null clears it
  image?: string;
  dateRoute?: string;          // ISO; must be future
  paces?: RoutePace[];         // 1–7 from the enum
}
```

> 🚧 **Backend prerequisite (not done as of 23-jul):** editing **meeting points** needs the
> backend PATCH to accept `meetingPoints` + an Alembic migration adding `updatedAt` to
> `meeting_points`. Until that lands, the edit form must NOT expose meeting-point editing —
> cover only the fields above. Confirm status with the author before building the form.

### 2.2 Cancel — `PATCH /api/route-calls/:id/cancel`

No body. Allowed only while `SCHEDULED` or `ONGOING`. Backend fires a Telegram notice — the UI
**must confirm** before calling (irreversible for attendees).

### 2.3 Delete — `DELETE /api/route-calls/:id`

No body. Succeeds only with **zero attendances** (otherwise 400 with a "cancel it instead"
message — surface it). Hard delete, cascades meeting points. **UI shows this action to ADMIN only (D4).**

## 3. Response shapes (TypeScript, as already defined in `src/types`)

The edit endpoint returns the updated `RouteCall`; cancel/delete return an envelope the UI does
not need to read (invalidate + optimistic/refetch is enough).

```ts
export type RoutePace =
  | "ROCA" | "CARACOL" | "GUSANO" | "MARIPOSA"
  | "EXPERIMENTADO" | "LOCURA_TOTAL" | "MIAUCORNIA";

export type RouteCallStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type MeetingPointType = "PRIMARY" | "SECONDARY";

export interface MeetingPoint {
  id: string;
  type: MeetingPointType;
  name: string;
  customName: string | null;
  location: string | null; // Google Maps URL when present
  time: string | null;
}

export interface RouteCall {
  id: string;
  routeId: string | null;
  organizerId: string;
  title: string;
  description: string | null;
  image: string | null;
  dateRoute: string;         // ISO
  paces: RoutePace[];
  status: RouteCallStatus;
  createdAt: string;
  updatedAt: string;
  route?: Route;             // slim slice (D17): no route.description here
  organizer?: User;          // slim slice (D17): no organizer.lastName here
  meetingPoints?: MeetingPoint[];
  _count?: { attendances: number };
}
```

`ApiResponse<RouteCall>` on success; `{ success:false, message, errors? }` on error.

## 4. UI behaviour contract (who sees what, when)

These are the rules the UI must enforce so it never offers an action the backend will reject.
`isOrganizer = currentUser.id === routeCall.organizerId`. `isAdmin = currentUser.role === "ADMIN"`.

| Action | Visible when | Enabled (status) | Extra |
|---|---|---|---|
| **Edit** | `isOrganizer` | `status === "SCHEDULED"` only | Hidden on ONGOING/COMPLETED/CANCELLED |
| **Cancel** | `isOrganizer` | `status === "SCHEDULED" \|\| "ONGOING"` | Confirmation dialog required |
| **Delete** | `isAdmin` only (D4) | any status | Confirmation dialog; blocked if attendances > 0 (surface the 400 message) |

Additional rules:
- Actions live on the event detail page (`/events/[id]`), gated by the logged-in user's identity
  and role (Clerk). A logged-out user sees none of them.
- The delete confirmation should warn that it is irreversible; if `_count.attendances > 0`,
  prefer to guide the admin toward cancel (or let the 400 surface and show its message).
- **Error surfacing:** on any failure, show the backend `message`. On a 400 with `errors`, map
  each field to its input (edit form). On 403 the UI mis-predicted permissions — treat as a bug
  signal, show the message.
- **On success:** `invalidateQueries` for `queryKeys.routeCalls.lists()` and
  `queryKeys.routeCalls.detail(id)` (mirror `useCreateRouteCall`). After delete, navigate away
  from the now-404 detail page.

## 5. Accessibility (DoD for every new UI — D10)

- Confirmation dialogs: focus trap, `Escape` closes, focus returns to the trigger, labelled by a
  heading, described by the warning text (`aria-labelledby` / `aria-describedby`). Prefer the
  existing radix/shadcn-style primitives in `components/ui`.
- Edit form: every control has a `<label>`; validation errors are associated to their input
  (`aria-invalid` + `aria-describedby`) and announced.
- All actions reachable and operable by keyboard; visible focus ring; AA contrast on buttons
  (destructive delete/cancel included).

## 6. Out of scope (do not build here)

Gallery in events, event-detail visual polish, reviews/favorites/photos changes — the backend
gallery endpoints are not migrated. Creating route-calls is already shipped; only edit/cancel/delete
are pending.