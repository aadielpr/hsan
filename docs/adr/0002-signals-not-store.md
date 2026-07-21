# Signals, not a Store, for game state

Game state is modeled with one `createSignal` per former `useState` plus plain `let` bindings for the former `useRef`s. A Solid `createStore` was considered and rejected.

At this scale — a 3×3 grid (≤9 holes, at most 3 balloons live, a few dozen short-lived confetti pieces) — Solid's keyed `<For>` / `<Show>` reconciliation already touches only the DOM nodes whose item reference changed. A store would buy no measurable perf here, and adopting it would force re-shaping `spawnBalloons`, the retract cleanup, the pop filter, and the confetti append into `produce`/path-update calls — a larger, riskier diff during a "pure swap."

## Consequences

- `setX(prev => next)` functional updaters carry over from React almost verbatim.
- The `popsRef` mirror is **dropped**: reading `pops()` inside the `setInterval` callback reads the current value (signal getters are non-tracking outside reactive scopes), so the stale-closure problem React needed the ref for does not exist in Solid.
- `useCallback` dependency plumbing disappears — Solid component functions run once, and plain functions read signals fresh at call time.