# Keep scaffold deps (router, Tailwind, devtools) installed but dormant

The `bun create solid` scaffold ships `@solidjs/router`, Tailwind v4 + `@tailwindcss/postcss`, and `solid-devtools`. The balloon game uses **none** of them.

Decision: keep all of them installed and their config files (`postcss.config.js`, the solid-devtools entry in `vite.config.ts`) on disk, but do **not** wire them in. `src/index.tsx` renders `<App/>` directly with no `<Router>`; `src/index.css` is the game's plain CSS with no `@import 'tailwindcss'`; `solid-devtools` is imported nowhere in app code.

## Considered Options

- **Strip them now.** Rejected — removal would be re-work the moment routing, Tailwind, or devtools are wanted, and the user explicitly asked to keep them for later.
- **Wire them in (router as Home page, Tailwind for styles).** Rejected — would either show a nav bar over a full-screen toddler game or require rewriting 290 lines of hand-tuned game CSS (including `@keyframes` and `--angle`/`--distance` custom properties), breaking the "pixel-identical" promise of the pure swap.

## Consequences

- `src/pages/`, `src/errors/`, `src/routes.ts`, `src/app.tsx`'s original nav shell, `postcss.config.js`, and `tsconfig.json` remain untouched. They sit dormant; `vite build` does not include them because nothing imports the router at runtime.
- Re-enabling any of them later is an additive change (add `<Router>` back, add `@import 'tailwindcss'`, add `import 'solid-devtools'`), not a migration.