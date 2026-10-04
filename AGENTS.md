<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

A feature-based Next.js app that talks to a separate backend API. If this
file and the code disagree, trust the code and update this file.

## Structure

```
src/
  app/          routes only, no logic
  features/<x>/ components/, hooks/, api.ts, queryKeys.ts, schemas.ts, types.ts, index.ts
  ui/           primitives/ (shadcn) and components/ (shared UI)
  shared/       hooks/ and utils/ used by 2+ features, no business logic
  lib/          http/, session, env, query, routes, cookies, site
  providers/    React Query, theme, toasts (only app/ imports this)
  theme/        design tokens
  proxy.ts      redirects signed-out users (Next 16's middleware)
```

`features/tasks` is a sample. Copy it to start a new feature, then delete it.

## Imports

```
app        → providers, features, ui, shared, lib, theme
providers  → lib, theme
features   → ui, shared, lib   (other features only through their index.ts)
ui         → shared, lib, theme
shared     → lib, theme
lib        → theme
```

Biome checks the two that matter most: no importing another feature's
internals, and ui/lib/shared never import from features. Inside a feature,
import files directly.

## Where things live

| What | Where |
|---|---|
| Response types | `features/<x>/types.ts` |
| Backend calls | `features/<x>/api.ts` |
| Query keys | `features/<x>/queryKeys.ts` |
| Form validation | `features/<x>/schemas.ts` |
| Backend paths | `lib/http/endpoints.ts` |
| Page paths, protected pages | `lib/routes.ts` |
| HTTP setup (base URL, token, errors) | `lib/http/` |
| Session cookies | `lib/session.ts`, names in `lib/cookies.ts` |
| Env variables | `lib/env.ts` (nothing else reads `process.env`) |
| App name | `lib/site.ts` |
| Colors and type | `theme/` |

No hardcoded paths, env reads or colors anywhere else.

## Data and auth

- Tokens live in httpOnly cookies. The browser never sees them.
- There are two Axios instances. `serverHttp` is server only and calls the
  backend directly. `clientHttp` runs in the browser and goes through
  `/api/backend`, which adds the token.
- Never put the token on an instance's defaults. The server instance is
  shared by every request.
- Feature `api.ts` functions take the instance as an argument, so the same
  function works in a server component and in a hook.
- Use `http.get<T>` for data and `http.getPage<T>` for paginated lists. The
  response envelope is unwrapped in `lib/http`; features never see it.
- Signed in means the refresh cookie exists. An expired access token gets
  refreshed on its first 401.
- On a 401, `clientHttp` refreshes once and retries. Requests that fail at
  the same time wait for that same refresh. A revoked session or a failed
  refresh goes to login.
- Check `ApiError.code`, never the message text.
- Reads and writes go through TanStack Query hooks. Server pages prefetch.
- Server actions are only for login and logout, because they set cookies.
- Failed writes show a toast. Field errors go on the form instead.
- `types.ts` is what the backend returns. Only add a separate UI type if the
  UI really needs a different shape.
- A form schema describes what the user can submit. It doesn't have to match
  the API, and the backend is the final check.

## State

- Server data: TanStack Query. Don't copy it into a store.
- Filters, search, page number: the URL.
- Local UI: `useState`. Theme: `useTheme` from next-themes.
- Global client state: Zustand, added when it's actually needed, as
  `src/store/<name>.store.ts`. No Redux.
- Context only for state inside one feature, as `features/<x>/context.tsx`.

## Conventions

- Features use `components/` and `hooks/` folders. Keep a feature's queries
  and mutations in one hooks file; give a hook with a separate job its own.
- Every screen that loads data handles loading, error, empty and content.
- Add `import "server-only"` to anything that reads cookies or secrets.
- Named exports, except Next's route files.
- Tests go next to the file they test.

## Keep it simple

Build what the current problem needs. Wait for a second use before
extracting anything. No service or repository layers on top of `api.ts`.
Delete experiments once you've picked one. Comments explain why, not what.

## Checks

```
npm run check   typecheck and lint
```
