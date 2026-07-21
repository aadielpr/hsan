# Toddler Balloon Pop

A simple tap-to-pop balloon game for toddlers, built as a SolidJS + Vite SPA.

Designed for a 2–3 year old: big targets, no complex menus, instant feedback, and no penalty for missing.

## Target devices

- iPhone XR and iPad Safari
- Desktop Safari / Chrome for testing

## Run locally

```bash
bun install
bun dev
```

Then open the printed URL. Use `--host` if you want to test from a phone or tablet on the same network:

```bash
bun dev --host
```

## Build

```bash
bun build
```

Output goes to `dist/`.

## Game rules

- Tap **Start** to begin.
- Balloons rise from holes in a 3×3 grid.
- Tap a balloon to pop it — hear a pop sound and see confetti.
- The game runs for 60 seconds.
- Try to pop at least 20 balloons before time runs out.
- At the end, the screen shows whether the target was reached.
- Tap **Start again** to play another round.
