# Repository Guidelines

## Project Structure & Module Organization
- `app/` — Next.js App Router entry (`layout.tsx`, `page.tsx`, `globals.css`). `page.tsx` composes section components in a fixed order (Hero → About → Hackathon → Program → ImmersiveBreak → Mangystau → Roles → Footer), wrapped in `SmoothScroll` (a Lenis-based smooth-scroll provider).
- `components/sections/` — page sections; `components/ui/` — shadcn primitives; `components/canvas/` — react-three-fiber/drei 3D scenes (`OceanCanvas`, `ProgramGlobe`); `components/interactive/` — motion-driven widgets (`Magnetic`, `TiltCard`, `ScrollProgress`, `RegisterDialog`); `components/providers/` — app-wide providers.
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge). `lib/generated/prisma` is the generated Prisma client output; regenerate it rather than hand-editing.
- `prisma/schema.prisma` defines the Postgres datasource; runtime config (schema path, migrations path, `DATABASE_URL`) lives in `prisma.config.ts`, not in the schema file.

## Build, Test, and Development Commands
- `npm run dev` — start the dev server.
- `npm run build` / `npm run start` — production build and serve.
- `npm run lint` — ESLint via the flat config in `eslint.config.mjs` (`eslint-config-next` core-web-vitals + typescript rulesets).
- `npx prisma generate` / `npx prisma migrate dev` — regenerate the client / apply schema changes (reads `prisma.config.ts`).

## Runtime Uploads
- Speaker avatars are stored on disk (not in `public/`) via `lib/uploads.ts` and served by `app/uploads/speakers/[filename]/route.ts`.
- Default path: `data/uploads/speakers/` (gitignored). On production VPS set `UPLOADS_DIR` to a directory **outside** the deploy folder (e.g. `/var/lib/csaw/uploads`) so redeploys do not wipe photos, then restart the Next.js process.
- After changing storage, re-upload any speakers whose old `/uploads/speakers/...` files are already missing.

## Coding Style & Naming Conventions
- TypeScript `strict` mode; path alias `@/*` resolves to the repo root.
- UI is built with shadcn (`components.json`: style `base-nova`, base color `neutral`, icons from `lucide`). Tailwind v4 theme tokens are defined as CSS variables in `app/globals.css` (`--color-primary-*`, `--color-accent-*`, `--color-surface-*`) and consumed via `tailwind.config.js`.

## Agent Instructions
This project pins Next.js 16.2.12, which ships its own documentation at `node_modules/next/dist/docs/`. Because APIs, conventions, and file structure may differ from training data, consult those docs before writing App Router code and heed any deprecation notices found there.

## Testing Guidelines
No test framework or test files exist in this repository yet.

## Commit & Pull Request Guidelines
Git history contains only the initial `create-next-app` scaffold commit, so no established commit-message convention exists yet.
