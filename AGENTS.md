# Hsan

Game site where kids play and learn.

## Tech Stack

- **Framework:** SolidJS
- **Build:** Vite
- **Styling:** Tailwind
- **Routing:** @solidjs/router
- **Runtime:** Bun
- **Language:** TypeScript (strict mode)

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun dev --host` | Start dev server, accessible from LAN |
| `bun build` | Build for production |
| `bun preview` | Preview production build |

## Coding Conventions

### Package management
- Use `bun` and `bunx` for everything. Do not use npm, yarn, or pnpm.

### Functions
- Use `function` keyword for function declarations, not arrow functions.
  - Correct: `function foo() { ... }`
  - Wrong: `const foo = () => { ... }`
- Exception: short callbacks passed inline to array methods (map, filter, etc.) can use arrow functions.

### Types
- Keep type definitions in a separate file from the implementation.
  - If the implementation is `bar.ts`, types go in `bar.type.ts`.
  - If the implementation is in a subdirectory, types can be in `bar/types.ts`.
- Name type files with the `.type.ts` suffix.

## Build Output

Production build goes to `dist/`.
