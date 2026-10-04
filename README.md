# Next Starter

A Next.js starter for apps that talk to their own backend API.

I kept rebuilding the same setup for every project, so this is that setup in
one place: a feature-based structure, a typed HTTP layer, cookie-based auth,
and a small sample feature to copy from.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query ·
React Hook Form + Zod · Axios · Biome

## Use this template

Pick one:

- On GitHub, click **Use this template** → **Create a new repository**.
- Or from the terminal:

  ```bash
  npx create-next-app@latest my-app --example https://github.com/yash-189/next-starter
  ```

Then:

```bash
cd my-app
cp .env.example .env.local   # set API_URL to your backend
npm install
npm run dev
```

### Make it yours

1. Rename the project in `package.json` and `src/lib/site.ts`.
2. Point `src/lib/http/endpoints.ts` at your API.
3. If your responses aren't `{ success, data, meta }`, update
   `src/lib/http/envelope.ts`.
4. Copy `src/features/tasks` for your first feature, then delete `tasks`
   and its route in `src/app/(app)/tasks`, plus `Routes.tasks`.
5. Update `REFRESH_MAX_AGE_S` in `src/lib/session.ts` to match your
   refresh token lifetime.

The sample expects these endpoints. Change them in `src/lib/http/endpoints.ts`.

| Method | Path |
|---|---|
| POST | `/auth/login`, `/auth/refresh`, `/auth/logout` |
| GET, POST | `/tasks` |
| DELETE | `/tasks/:id` |

Responses are expected as `{ success, data, meta }`. If your API differs,
update `src/lib/http/envelope.ts`.

## Structure

```
src/
├─ app/                              routes only
│  ├─ (marketing)/page.tsx           public home page
│  ├─ (auth)/login/page.tsx
│  ├─ (app)/                         signed-in area
│  │  ├─ layout.tsx                  header, requireSession()
│  │  └─ tasks/page.tsx              prefetches, renders TasksScreen
│  ├─ api/
│  │  ├─ backend/[...path]/route.ts  browser → backend, adds the token
│  │  └─ auth/refresh/route.ts       renews the session cookies
│  └─ layout.tsx                     fonts, metadata, Providers
│
├─ features/
│  ├─ auth/
│  │  ├─ components/LoginForm.tsx
│  │  ├─ actions.ts                  login / logout (sets the cookies)
│  │  ├─ api.ts
│  │  ├─ schemas.ts
│  │  └─ index.ts
│  └─ tasks/                         sample feature, copy this one
│     ├─ components/
│     │  ├─ TasksScreen.tsx
│     │  ├─ TaskList.tsx
│     │  └─ TaskForm.tsx
│     ├─ hooks/useTasks.ts           queries and mutations
│     ├─ api.ts                      backend calls
│     ├─ queryKeys.ts
│     ├─ schemas.ts                  form validation
│     ├─ types.ts
│     └─ index.ts                    what other features can import
│
├─ ui/
│  ├─ primitives/                    shadcn components
│  └─ components/                    PageHeader, EmptyState, ThemeToggle
│
├─ shared/                           hooks/ and utils/ used by 2+ features
│
├─ lib/
│  ├─ http/
│  │  ├─ server.ts                   serverHttp (server only)
│  │  ├─ client.ts                   clientHttp, refresh on 401
│  │  ├─ request.ts                  get / getPage / post … helpers
│  │  ├─ envelope.ts                 unwraps { success, data, meta }
│  │  ├─ errors.ts                   ApiError, error codes
│  │  ├─ endpoints.ts                every backend path
│  │  ├─ params.ts                   query string format
│  │  └─ index.ts
│  ├─ session.ts                     session cookies, requireSession()
│  ├─ cookies.ts                     cookie names
│  ├─ env.ts                         the only place that reads process.env
│  ├─ routes.ts                      every page path
│  ├─ query.ts                       QueryClient
│  ├─ site.ts                        app name and description
│  └─ utils.ts                       cn()
│
├─ providers/Providers.tsx           React Query, theme, toasts
├─ theme/globals.css                 design tokens
└─ proxy.ts                          redirects signed-out users
```

To add a feature, copy `features/tasks`, rename it, and delete the original.

## How it works

**Auth.** The access and refresh tokens live in httpOnly cookies, so
JavaScript in the browser can't read them. Server components call the
backend directly. Browser requests go through `/api/backend`, which adds the
token.

**Refresh.** When a request gets a 401, the client refreshes the session once
and retries. If several requests fail at the same moment, they share that one
refresh, which matters when refresh tokens rotate.

**Data.** Every read and write goes through TanStack Query. Server pages
prefetch so the first render already has data.

**Errors.** API errors become an `ApiError` with a status, a code and
per-field messages. Failed writes show a toast; field errors show up on the
form.

## Scripts

| Command | |
|---|---|
| `npm run dev` | start the dev server |
| `npm run check` | typecheck and lint |
| `npm run format` | fix formatting |
| `npm run build` | production build |

Project conventions are in [AGENTS.md](AGENTS.md).

## License

MIT
