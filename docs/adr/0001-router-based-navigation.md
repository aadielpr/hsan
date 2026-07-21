# Router-based navigation

The app uses `@solidjs/router` for page-level navigation (Lobby → Game → back) rather than a single-page state machine.

We chose this over keeping the existing state-machine approach (`GameStatus` with an added `'menu'` state) because: (1) it gives clean URLs (`/balloon-pop`) for free, (2) adding future games is a new route + entry in the game registry — no rework of a growing state enum, (3) the in-game states (`idle | playing | won | lost`) stay self-contained inside each game component where they belong.

**Considered alternative:** extend the current `GameStatus` enum with a `'lobby'` state. Simpler for one game, but would grow unwieldy as games are added and force unrelated state transitions into one component.
