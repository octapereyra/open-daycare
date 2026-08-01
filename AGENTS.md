<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Next.js 16 is installed (`next@16.2.12`). It has breaking changes vs typical training data — App Router defaults changed, `next lint` was removed, and APIs/conventions may differ. Before writing Next code, read the relevant guide in `node_modules/next/dist/docs/` (entries: `01-app`, `02-pages`, `03-architecture`, `04-community`). Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (`strict`, `noEmit`).
- Tailwind v4 via `@tailwindcss/postcss`. There is **no `tailwind.config.*`** — theme tokens are declared with `@theme inline` in `app/globals.css`, and `@import "tailwindcss"` replaces the old `@tailwind` directives. Do not add a v3-style config file.
- Package manager is **npm** (uses `package-lock.json`). No monorepo; single app.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` / `npm start` — prod build / serve
- `npm run lint` — runs **bare `eslint`** (flat config in `eslint.config.mjs`). `next lint` does not exist in Next 16; do not call it.
- **No test framework is configured.** Do not run `npm test`; it will exit with no-op error. If asked to test, propose a setup first rather than inventing one.

## Layout

- App source lives in `app/` (currently one route: `page.tsx`, `layout.tsx`, `globals.css`).
- Path alias: `@/*` → repo root (tsconfig `paths`).
- `references/pantallas/*.dc.html` are Donatello/mockup wireframes (Spanish filenames) — **the UI design source of truth** for this daycare app. Match these layouts, not assumptions. `references/screenshots/*.png` are reference screenshots.

## MCPs

- Playwright: all screenshots and Playwright artifacts go under `.playwright-mcp/` (gitignored — excluded globally). Do not write them elsewhere.
- Context7 MCP is configured to pull current framework docs. Prefer it over memory for Next/React/Tailwind APIs.

## Notes

- `CLAUDE.md` is just `@AGENTS.md` — keep AGENTS.md as the single source of truth.
- Repo-local OpenCode skills `spec` and `spec-impl` are installed (`.agents/skills/`); the spec workflow is the expected path for new features here.

## Spec Driven Development - Skills
- /spec Usaremos esta habilidad para crear las especificaciones.
- /spec-impl Usaremos esta skill para hacer las implementaciones.

## Reglas de código

- Usar código limpio, nombres, funciones, variables, etc. en inglés.