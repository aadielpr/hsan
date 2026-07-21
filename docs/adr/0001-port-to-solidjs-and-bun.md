# Port to SolidJS and Bun

The balloon-pop game was ported from React 19 + pnpm + Vite to SolidJS + Bun + Vite as a **pure tech swap**: no game behavior, layout, CSS, or constants changed. React was replaced by SolidJS (`vite-plugin-solid`) and pnpm by Bun (`bun install` / `bun run` / `bun.lock`). The single-component shape was kept so the diff stays auditable against the old build.

## Considered Options

- **Port in place at the repo root.** Rejected for this step — a fresh `bun create solid` scaffold already existed under `solid/`, so the work happened there and will be promoted to the root later.
- **Rewrite game behavior during the port.** Rejected — would break the "pixel-identical to the old build" correctness check.

## Consequences

- React types (`@types/react`, `@types/react-dom`) and the React runtime deps are gone; Solid deps are installed via Bun.
- `StrictMode` has no Solid equivalent and was dropped; its double-invoke behavior in dev has no impact on this game.