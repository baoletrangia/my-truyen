<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# My Truyen

Single-package Next.js 16 App Router app. No monorepo.

## Dev commands

```
npm run dev      # next dev
npm run build    # next build
npm run lint     # eslint (v9 flat config, eslint.config.mjs)
```

No test, typecheck, or format scripts exist.

## Architecture

- **No backend/database.** Google Sheets is the sole data store.
  - Read: public CSV export (`/gviz/tq?tqx=out:csv`) — no API key required.
  - Write: Sheets API v4 with OAuth token from the logged-in admin (PKCE flow).
- Sheet tabs: `novels` (columns: slug, title, author, cover, summary, tags, status) and `chapters` (columns: novel_slug, chapter_number, title, content, created_at).
- Data access via `@/lib/google/sheets.ts` (custom CSV parser, no library).

## Tooling

- **Tailwind v4** — `@import "tailwindcss"` in `globals.css`, `@theme inline` for tokens, NO `tailwind.config.*`.
- **Path alias** — `@/*` → `src/*` (tsconfig paths).
- **ESLint** — v9 flat config (`eslint.config.mjs`), extends `eslint-config-next`.

## Auth & state

- Admin auth: Google OAuth PKCE. Tokens stored in `localStorage` under `admin-session`.
- Reader preferences: Zustand store persisted to `localStorage` under `reader-settings`.
- No HttpOnly cookies, no server session.

## Next.js 16 specifics (confirmed in this codebase)

- `params` in page/layout components is `Promise<{...}>` — must `await` before access.
- `revalidate` and `dynamicParams` exported from page modules.
- `generateStaticParams` is `async`.

## Pages & ISR

- All pages use `export const revalidate = 600` (10-min ISR).
- Detail/chapter pages also set `export const dynamicParams = true`.
