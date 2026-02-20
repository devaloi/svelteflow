# SvelteFlow — Analytics Dashboard

[![CI](https://github.com/devaloi/svelteflow/actions/workflows/ci.yml/badge.svg)](https://github.com/devaloi/svelteflow/actions/workflows/ci.yml)

An analytics dashboard built with SvelteKit — SSR with streaming, real-time data via Server-Sent Events, form actions for mutations, Chart.js visualizations, and a responsive multi-page UI.

## Features

- **SvelteKit 2 + Svelte 5** — Runes (`$state`, `$derived`, `$effect`), latest reactivity model
- **Server-side rendering** — `load` functions with streamed promises for fast initial paint
- **Form actions** — SvelteKit-native progressive enhancement for login, logout, and filtering
- **Server-Sent Events** — Real-time metric updates on the System Health page
- **Chart.js visualizations** — Line, bar, pie, and doughnut charts with responsive containers
- **SQLite + Drizzle ORM** — Type-safe database layer with migrations and realistic seed data
- **Cookie-based auth** — Session management with httpOnly cookies and protected routes
- **Dark mode** — CSS custom properties with cookie-persisted preference
- **CSV export** — Download any dataset as CSV with proper escaping
- **Responsive layout** — Sidebar collapses on mobile, charts resize, tables scroll

## Tech Stack

| Component  | Choice                       |
| ---------- | ---------------------------- |
| Framework  | SvelteKit + Svelte 5         |
| Language   | TypeScript (strict mode)     |
| Database   | SQLite (better-sqlite3)      |
| ORM        | Drizzle ORM + Drizzle Kit    |
| Charts     | Chart.js 4                   |
| Styling    | Tailwind CSS 4               |
| Auth       | Custom cookie-based (bcrypt) |
| Real-time  | Server-Sent Events           |
| Unit Tests | Vitest                       |
| E2E Tests  | Playwright                   |
| Linting    | ESLint + Prettier            |

## Quick Start

```bash
# Prerequisites: Node.js 22+

# Install dependencies
npm install

# Create and seed the database
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with:

- **Email:** admin@demo.com
- **Password:** password

## Dashboard Pages

| Page     | Route     | Description                                                           |
| -------- | --------- | --------------------------------------------------------------------- |
| Overview | `/`       | KPI cards, revenue trend, activity by type                            |
| Sales    | `/sales`  | Revenue by product, monthly trends, top customers with date filtering |
| Users    | `/users`  | Signups over time, demographics, retention, customer growth           |
| System   | `/system` | Live CPU/memory charts via SSE, error rates, active users             |

## Architecture

```
src/
├── hooks.server.ts          # Auth guard: validate session cookie
├── lib/
│   ├── server/              # Database, auth, SSE helpers
│   ├── components/          # Charts, layout, UI, forms
│   ├── stores/              # Theme and real-time state (Svelte 5 runes)
│   ├── utils/               # CSV, formatters, chart config
│   └── types/               # TypeScript interfaces
├── routes/
│   ├── login/               # Form action: login
│   ├── logout/              # Form action: logout
│   ├── (dashboard)/         # Auth-protected group
│   │   ├── sales/           # Sales analytics
│   │   ├── users/           # User metrics
│   │   └── system/          # System health + SSE
│   └── api/
│       ├── metrics/stream/  # SSE endpoint
│       └── export/          # CSV export endpoint
└── tests/
    ├── unit/                # Vitest tests
    └── e2e/                 # Playwright tests
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
DATABASE_URL=sqlite://data.db
SESSION_SECRET=change-me-to-a-random-secret-in-production
```

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Check formatting and lint
npm run format       # Auto-format code
npm run check        # TypeScript type checking
npm run seed         # Seed database with demo data
npm run migrate      # Run database migrations
```

## License

MIT
