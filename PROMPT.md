# Build svelteflow — Analytics Dashboard with SvelteKit

You are building a **portfolio project** for a Senior AI Engineer's public GitHub. It must be impressive, clean, and production-grade. Read these docs before writing any code:

1. **`SV01-sveltekit-dashboard.md`** — Complete project spec: architecture, database schema, SSE protocol, form actions, Chart.js components, dashboard pages, commit plan. This is your primary blueprint. Follow it phase by phase.
2. **`github-portfolio.md`** — Portfolio goals and Definition of Done (Level 1 + Level 2). Understand the quality bar.
3. **`github-portfolio-checklist.md`** — Pre-publish checklist. Every item must pass before you're done.

---

## Instructions

### Read first, build second
Read all three docs completely before writing a single line of code. Understand the SvelteKit routing model, form actions for mutations, the SSE real-time pattern, and the Chart.js integration. This project demonstrates SvelteKit as a mature, production-ready framework — the architecture must reflect that.

### Follow the phases in order
The project spec has 5 phases. Do them in order:
1. **Foundation & Database** — project setup with SvelteKit 2.50 + Svelte 5, Drizzle ORM schema, SQLite setup, seed script with realistic demo data
2. **Auth & Layout** — cookie-based authentication with sessions, login/logout form actions, dashboard layout shell with sidebar and header, dark mode with CSS custom properties
3. **Charts & Dashboard Pages** — Chart.js wrapper components (line, bar, pie, doughnut), StatCard and DataTable, all 4 dashboard pages (Overview, Sales, Users, System) with load functions
4. **Real-time & Data Export** — SSE endpoint with streaming metrics, client-side EventSource integration, CSV export with proper escaping and download
5. **Testing & Polish** — Vitest unit tests, Playwright E2E tests, utility formatters, README with screenshots

### Commit frequently
Follow the commit plan in the spec. Use **conventional commits** (`feat:`, `test:`, `docs:`, `chore:`). Each commit should be a logical unit.

### Quality non-negotiables
- **Svelte 5 runes everywhere.** Use `$state`, `$derived`, `$effect` — not legacy `let` reactive declarations or `$:` labels. Snippets where appropriate.
- **SvelteKit form actions for mutations.** Login, logout, and filtering use form actions with progressive enhancement. No `fetch()` calls for mutations that can use actions.
- **Server-side rendering with streaming.** Load functions return data. Use `Promise` streaming for slow queries so the page shell renders immediately.
- **TypeScript strict.** No `any` types. All load function return types inferred or explicit. All component props typed.
- **Chart.js wrapped properly.** Each chart is a reusable Svelte component accepting typed props. Charts respond to dark mode changes. Loading skeletons while data loads.
- **Drizzle ORM type-safe queries.** All database access through Drizzle. No raw SQL strings. Schema is the source of truth.
- **SSE is production-quality.** Server cleans up on disconnect. Client auto-reconnects. Heartbeat keeps the connection alive. State updates reactively via runes.
- **Auth is secure.** bcrypt for passwords. httpOnly + secure + sameSite cookies. Session expiry. Protected routes via hooks.
- **Dark mode is seamless.** No flash on load (theme read from cookie server-side). All charts, tables, and components adapt.
- **CSV export handles edge cases.** Commas in values, quotes, newlines, Unicode — all escaped correctly. Test this.
- **Responsive layout.** Sidebar collapses on mobile. Charts resize. Tables scroll horizontally. Touch-friendly.
- **Lint clean.** ESLint + Prettier. `tsc --noEmit` passes. Zero build warnings.

### What NOT to do
- Don't use Svelte 4 syntax. No `$:` reactive statements, no `export let` for props. Use runes and `$props()`.
- Don't create API routes for mutations that can use form actions. Form actions are the SvelteKit way.
- Don't use WebSockets for real-time. SSE is simpler, sufficient, and demonstrates the pattern cleanly.
- Don't skip the seed script. The dashboard must look impressive on first run with realistic data.
- Don't put database queries in components. All data loading happens in `+page.server.ts` or `+layout.server.ts`.
- Don't use a CSS framework beyond Tailwind. No component libraries (Skeleton UI, DaisyUI). Build the components.
- Don't leave `// TODO` or `// FIXME` comments anywhere.
- Don't commit `.env` files or any secrets.

---

## GitHub Username

The GitHub username is **devaloi**. For package.json and any GitHub URLs, use `github.com/devaloi/svelteflow`.

## Start

Read the three docs. Then begin Phase 1 from `SV01-sveltekit-dashboard.md`.
