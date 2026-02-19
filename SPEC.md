# SV01: svelteflow — Analytics Dashboard with SvelteKit

**Catalog ID:** SV01 | **Size:** M | **Language:** TypeScript / SvelteKit 2.50 / Svelte 5
**Repo name:** `svelteflow`
**One-liner:** An analytics dashboard built with SvelteKit — SSR with streaming, real-time data via Server-Sent Events, form actions for mutations, Chart.js visualizations, and a responsive multi-page UI.

---

## Why This Stands Out

- **SvelteKit 2.50 + Svelte 5** — runes (`$state`, `$derived`, `$effect`), snippets, latest reactivity model — not Svelte 4 legacy code
- **Server-side rendering with streaming** — `load` functions return streamed promises for fast initial paint with progressive data loading
- **Form actions for mutations** — SvelteKit-native progressive enhancement, no API routes needed for writes
- **Server-Sent Events** — real-time metric updates pushed from server to dashboard without WebSocket complexity
- **Chart.js interactive visualizations** — line, bar, pie, doughnut charts with responsive containers and animation
- **SQLite + Drizzle ORM** — type-safe database layer with migrations, seeded with realistic demo data
- **Cookie-based auth** — session management with httpOnly cookies, login/logout flow, protected routes via hooks
- **Multi-page dashboard** — Overview, Sales Analytics, User Metrics, System Health — each with distinct data and visualizations
- **Dark mode** — CSS custom properties toggle with `prefers-color-scheme` default and manual override persisted in cookie
- **Data export** — CSV download from any table or chart dataset with proper headers and encoding

---

## Architecture

```
svelteflow/
├── src/
│   ├── app.html                            # HTML shell with theme class
│   ├── app.css                             # Global styles, CSS custom properties, dark mode
│   ├── hooks.server.ts                     # Auth guard: validate session cookie, protect routes
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db.ts                       # Drizzle client + SQLite connection
│   │   │   ├── schema.ts                   # Drizzle schema: users, sessions, sales, metrics, events
│   │   │   ├── seed.ts                     # Seed script: generate realistic demo data
│   │   │   ├── auth.ts                     # Password hashing (bcrypt), session create/validate/destroy
│   │   │   └── sse.ts                      # SSE helper: create ReadableStream, push events
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── LineChart.svelte        # Chart.js line chart wrapper
│   │   │   │   ├── BarChart.svelte         # Chart.js bar chart wrapper
│   │   │   │   ├── PieChart.svelte         # Chart.js pie chart wrapper
│   │   │   │   ├── DoughnutChart.svelte    # Chart.js doughnut chart wrapper
│   │   │   │   └── ChartContainer.svelte   # Responsive wrapper with loading skeleton
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.svelte          # Navigation sidebar with active state
│   │   │   │   ├── Header.svelte           # Top bar: breadcrumb, user menu, dark mode toggle
│   │   │   │   ├── StatCard.svelte         # KPI card: value, label, trend arrow, sparkline
│   │   │   │   └── DataTable.svelte        # Sortable data table with pagination
│   │   │   ├── ui/
│   │   │   │   ├── Button.svelte           # Button variants: primary, secondary, ghost, danger
│   │   │   │   ├── Modal.svelte            # Dialog modal with backdrop
│   │   │   │   ├── Toast.svelte            # Toast notification system
│   │   │   │   ├── Skeleton.svelte         # Loading skeleton placeholder
│   │   │   │   └── DateRangePicker.svelte  # Date range selector for filtering
│   │   │   └── forms/
│   │   │       ├── LoginForm.svelte        # Login form with validation
│   │   │       └── ExportButton.svelte     # CSV export trigger with format options
│   │   ├── stores/
│   │   │   ├── theme.svelte.ts             # Dark mode state with $state rune
│   │   │   └── realtime.svelte.ts          # SSE connection state and latest metrics
│   │   ├── utils/
│   │   │   ├── csv.ts                      # CSV serialization with proper escaping
│   │   │   ├── format.ts                   # Number/date/currency formatters
│   │   │   └── chart-options.ts            # Shared Chart.js config (colors, fonts, responsive)
│   │   └── types/
│   │       ├── dashboard.ts                # Dashboard data types: KPI, TimeSeriesPoint, etc.
│   │       └── auth.ts                     # User, Session types
│   ├── routes/
│   │   ├── +layout.svelte                  # Root layout: sidebar + header + slot
│   │   ├── +layout.server.ts               # Root load: session user for layout
│   │   ├── login/
│   │   │   ├── +page.svelte                # Login page UI
│   │   │   └── +page.server.ts             # Form action: validate credentials, set cookie
│   │   ├── logout/
│   │   │   └── +page.server.ts             # Form action: destroy session, clear cookie
│   │   ├── (dashboard)/
│   │   │   ├── +layout.server.ts           # Auth guard for dashboard group
│   │   │   ├── +page.svelte                # Overview: KPI cards, revenue line chart, activity bar
│   │   │   ├── +page.server.ts             # Load: aggregate KPIs, time series data (streamed)
│   │   │   ├── sales/
│   │   │   │   ├── +page.svelte            # Sales: revenue by product, top customers, trends
│   │   │   │   └── +page.server.ts         # Load: sales data with date range filter
│   │   │   ├── users/
│   │   │   │   ├── +page.svelte            # Users: signups, retention, demographics pie charts
│   │   │   │   └── +page.server.ts         # Load: user analytics data
│   │   │   └── system/
│   │   │       ├── +page.svelte            # System: CPU, memory, error rates, uptime
│   │   │       └── +page.server.ts         # Load: system health + SSE endpoint setup
│   │   └── api/
│   │       ├── metrics/
│   │       │   └── stream/
│   │       │       └── +server.ts          # GET: SSE endpoint for real-time metrics
│   │       └── export/
│   │           └── +server.ts              # GET: CSV export endpoint with query params
│   └── tests/
│       ├── unit/
│       │   ├── csv.test.ts                 # CSV serializer tests
│       │   ├── format.test.ts              # Formatter tests
│       │   └── auth.test.ts                # Auth logic tests
│       └── e2e/
│           ├── login.test.ts               # Login flow E2E
│           ├── dashboard.test.ts           # Dashboard navigation E2E
│           └── export.test.ts              # CSV export E2E
├── drizzle/
│   └── migrations/                         # Auto-generated migration files
├── static/
│   └── favicon.png
├── drizzle.config.ts                       # Drizzle Kit config
├── svelte.config.js                        # SvelteKit config with adapter-node
├── vite.config.ts                          # Vite config with vitest
├── tailwind.config.ts                      # Tailwind CSS config with dark mode
├── tsconfig.json
├── package.json
├── Makefile                                # dev, build, test, lint, seed, migrate
├── .env.example                            # DATABASE_URL, SESSION_SECRET
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── LICENSE
├── playwright.config.ts
└── README.md
```

---

## Database Schema

| Table | Columns | Purpose |
|-------|---------|---------|
| `users` | id, email, password_hash, name, role, created_at | User accounts |
| `sessions` | id, user_id, token, expires_at | Auth sessions |
| `sales` | id, product, amount, customer, region, created_at | Sales records |
| `metrics` | id, name, value, unit, recorded_at | Time-series metrics |
| `events` | id, type, source, payload (JSON), created_at | System events log |

---

## SSE Protocol

```
GET /api/metrics/stream
Accept: text/event-stream

event: metric
data: {"name":"cpu_usage","value":42.5,"unit":"%","timestamp":"2025-01-15T10:00:00Z"}

event: metric
data: {"name":"active_users","value":1847,"unit":"count","timestamp":"2025-01-15T10:00:00Z"}

event: metric
data: {"name":"error_rate","value":0.12,"unit":"%","timestamp":"2025-01-15T10:00:00Z"}

event: heartbeat
data: {}
```

---

## Form Actions

| Route | Action | Description |
|-------|--------|-------------|
| `/login` | `default` | Validate email/password, create session, set cookie, redirect |
| `/logout` | `default` | Destroy session, clear cookie, redirect to login |
| `/sales` | `filter` | Apply date range filter, re-run load with params |

---

## Dashboard Pages

| Page | Route | Charts | Data |
|------|-------|--------|------|
| Overview | `/` | Revenue line, Activity bar, 4 KPI cards | Aggregated totals, 30-day trends |
| Sales | `/sales` | Revenue by product (bar), Top customers (table), Monthly trend (line) | Sales records with date filter |
| Users | `/users` | Signups over time (line), Demographics (pie), Retention (doughnut) | User analytics |
| System | `/system` | CPU/Memory (line, real-time), Error rate (bar), Uptime (stat card) | Live system metrics via SSE |

---

## Tech Stack

| Component | Choice |
|-----------|--------|
| Framework | SvelteKit 2.50 + Svelte 5 |
| Language | TypeScript 5.7 (strict mode) |
| Database | SQLite (better-sqlite3) |
| ORM | Drizzle ORM + Drizzle Kit |
| Charts | Chart.js 4 + svelte-chartjs |
| Styling | Tailwind CSS 4 |
| Auth | Custom cookie-based (bcrypt) |
| Real-time | Server-Sent Events (native) |
| Unit Testing | Vitest |
| E2E Testing | Playwright |
| Linting | ESLint + Prettier |
| Adapter | @sveltejs/adapter-node |

---

## Phased Build Plan

### Phase 1: Foundation & Database

**1.1 — Project setup**
- `npx sv create svelteflow` with SvelteKit 2.50, Svelte 5, TypeScript
- Add Tailwind CSS, Vitest, Playwright
- Makefile with targets: `dev`, `build`, `test`, `test:e2e`, `lint`, `format`, `seed`, `migrate`
- `.env.example` with `DATABASE_URL`, `SESSION_SECRET`

**1.2 — Database schema with Drizzle**
- Install `drizzle-orm`, `drizzle-kit`, `better-sqlite3`
- Define schema in `src/lib/server/schema.ts`: users, sessions, sales, metrics, events
- Configure `drizzle.config.ts` for SQLite
- Run `drizzle-kit generate` and `drizzle-kit migrate`
- Create `db.ts` client initialization

**1.3 — Seed script**
- Generate 1 admin user (email: `admin@demo.com`, password: `password`)
- Generate 500 sales records across 5 products, 4 regions, 12 months
- Generate 2000 metric data points (CPU, memory, error rate, active users) across 30 days
- Generate 100 system events
- Run via `npm run seed` or `make seed`

### Phase 2: Auth & Layout

**2.1 — Authentication**
- `auth.ts`: `hashPassword`, `verifyPassword` (bcrypt), `createSession`, `validateSession`, `destroySession`
- Session tokens: crypto.randomUUID, stored in sessions table with expiry
- httpOnly, secure, sameSite cookies
- Tests: hash/verify round-trip, session CRUD

**2.2 — Auth hooks and routes**
- `hooks.server.ts`: read session cookie, validate, attach user to `event.locals`
- Login page: form with email/password, form action validates + sets cookie
- Logout: form action destroys session, clears cookie
- Dashboard layout group `(dashboard)`: `+layout.server.ts` redirects to login if no session

**2.3 — Dashboard layout shell**
- Root layout: sidebar + header + main content area
- `Sidebar.svelte`: navigation links with active state, collapsible on mobile
- `Header.svelte`: breadcrumb, user name, dark mode toggle, logout button
- Responsive: sidebar collapses to hamburger menu below 768px

**2.4 — Dark mode**
- CSS custom properties for all colors (--color-bg, --color-surface, --color-text, etc.)
- `theme.svelte.ts` store using `$state` rune, reads `prefers-color-scheme` on init
- Toggle persists preference in cookie (server-readable for SSR)
- `app.html` applies theme class on `<html>` to prevent flash

### Phase 3: Charts & Dashboard Pages

**3.1 — Chart components**
- `ChartContainer.svelte`: responsive wrapper, loading skeleton, error state
- `LineChart.svelte`: accepts labels + datasets, renders Chart.js line with tooltips
- `BarChart.svelte`: vertical/horizontal bar charts
- `PieChart.svelte`: pie with legend
- `DoughnutChart.svelte`: doughnut with center label
- All use shared config from `chart-options.ts` (colors adapt to dark mode)

**3.2 — StatCard and DataTable**
- `StatCard.svelte`: large value, label, trend indicator (up/down/flat), percentage change, optional sparkline
- `DataTable.svelte`: sortable columns (click header), pagination (10/25/50 per page), row click handler
- Both responsive, skeleton loading states

**3.3 — Overview page**
- Load function: aggregate total revenue, total users, active sessions, error rate
- 4 KPI StatCards at top
- Revenue trend LineChart (30 days)
- Activity BarChart (daily events by type)
- Stream deferred data for slow aggregations

**3.4 — Sales Analytics page**
- Load function: sales by product, top 10 customers, monthly revenue trend
- `DateRangePicker.svelte` with form action to filter
- Revenue by product BarChart
- Monthly trend LineChart
- Top customers DataTable with CSV export

**3.5 — User Metrics page**
- Load function: signup counts over time, demographics breakdown, retention cohorts
- Signups LineChart
- Demographics PieChart (role, region)
- Retention DoughnutChart
- User growth DataTable

**3.6 — System Health page**
- Load function: latest CPU, memory, error rate, uptime
- Connect to SSE endpoint for live updates
- CPU + Memory LineChart (updates in real-time)
- Error rate BarChart (last 24h)
- Uptime StatCard

### Phase 4: Real-time & Data Export

**4.1 — SSE endpoint**
- `GET /api/metrics/stream`: return `ReadableStream` with `text/event-stream` content type
- Push new metric event every 2 seconds (simulated: CPU ±5%, memory ±2%, etc.)
- Heartbeat every 15 seconds to keep connection alive
- Clean up on client disconnect (abort signal)

**4.2 — SSE client integration**
- `realtime.svelte.ts`: `EventSource` connection with auto-reconnect
- Parse metric events, update `$state` store
- System Health page subscribes, charts update reactively
- Disconnect when navigating away from System page (`$effect` cleanup)

**4.3 — CSV export**
- `csv.ts`: convert array of objects to CSV string with proper escaping (commas, quotes, newlines)
- `ExportButton.svelte`: triggers download with generated filename (page-date.csv)
- Server endpoint `GET /api/export?type=sales&from=...&to=...`: query DB, stream CSV response
- DataTable has inline export button for current view
- Tests: CSV escaping edge cases, correct headers

### Phase 5: Testing & Polish

**5.1 — Unit tests**
- CSV serializer: special characters, empty fields, large datasets
- Formatters: currency, percentage, dates, relative time
- Auth: password hashing, session validation, expiry
- Chart options: dark mode color switching

**5.2 — E2E tests (Playwright)**
- Login flow: valid credentials → dashboard, invalid → error message
- Dashboard navigation: sidebar links load correct pages
- Dark mode toggle: persists across page navigation
- CSV export: downloads file with correct content
- SSE: System Health page receives live updates

**5.3 — Utility components**
- `format.ts`: `formatCurrency`, `formatPercent`, `formatDate`, `formatRelativeTime`, `formatNumber`
- Error pages: custom `+error.svelte` with friendly message and retry
- Loading states: every page has skeleton while data loads

**5.4 — README**
- Screenshot of dashboard (light + dark mode)
- Features list with icons
- Quick start: `npm install && npm run seed && npm run dev`
- Architecture overview: SvelteKit routing, form actions, SSE pattern
- Tech stack table
- Environment variables reference
- Development commands

**5.5 — Final checks**
- `npm run build` clean (zero warnings)
- `npm run test` all pass
- `npm run test:e2e` all pass
- `npm run lint` clean
- `npx tsc --noEmit` passes
- Responsive on mobile/tablet/desktop
- Dark mode consistent everywhere
- No `// TODO` or `// FIXME`
- Fresh clone → install → seed → dev works

---

## Commit Plan

1. `chore: scaffold SvelteKit project with Svelte 5, Tailwind, Vitest, Playwright`
2. `feat: add Drizzle ORM schema and SQLite database setup`
3. `feat: add seed script with demo sales, metrics, and user data`
4. `feat: add cookie-based authentication with session management`
5. `feat: add login/logout pages with form actions`
6. `feat: add dashboard layout with sidebar, header, and dark mode`
7. `feat: add Chart.js wrapper components (line, bar, pie, doughnut)`
8. `feat: add StatCard and DataTable components`
9. `feat: add Overview dashboard page with KPI cards and charts`
10. `feat: add Sales Analytics page with date range filtering`
11. `feat: add User Metrics page with demographics and retention`
12. `feat: add System Health page with live metric display`
13. `feat: add SSE endpoint and real-time client integration`
14. `feat: add CSV export with server endpoint and download trigger`
15. `test: add unit tests for CSV, formatters, and auth`
16. `test: add Playwright E2E tests for login, navigation, and export`
17. `docs: add README with screenshots, setup, and architecture`
18. `chore: final lint pass and cleanup`
