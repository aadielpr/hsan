# Wayfinder tracker

This effort's issue tracker is **GitHub Issues** on this repo.

- **Canonical map:** [Wayfinder map: Swift/SwiftUI toddler games](https://github.com/aadielpr/hsan/issues/1) (label `wayfinder:map`, issue #1).
- **Tickets:** child issues labelled `wayfinder:<type>` (one of `research`, `prototype`, `grilling`, `task`), each linking back to the map in its body.

### Frontend-dependent conventions

This `gh` CLI version has **no native sub-issue / dependency flag**, so:

- **Parent link:** each ticket body opens with `Parent map: #1 — <link>`.
- **Blocking:** expressed in the bodies — the blocker has an `## Unblocks` section listing the ticket(s) it blocks; the blocked ticket has a `## Blocked by` section listing what it waits on. A ticket is **unblocked** when everything in its `Blocked by` is closed.
- **Frontier:** the open, unblocked, unclaimed children of the map.

### Why this folder exists

The `wayfinder/` folder is the **archive** of the original local-markdown tracker used before the migration to GitHub Issues on 2026-07-18. It is kept for history; live decisions are recorded on GitHub only.

Contents:
- `MAP.md` — snapshot of the map body at migration time (mirror of GitHub issue #1, minus the GitHub-specific footer).
- `issues/` — the original local-markdown ticket files (ids 0001–0005). Superseded by GitHub issues #2–#6.
- `gh/` — the exact issue bodies uploaded to GitHub.