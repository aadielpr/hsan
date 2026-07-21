# PROTOTYPE: toddler balloon-pop

**This is a throwaway prototype.** Do not merge to `main`. It lives on branch `prototype/balloon-pop`.

## Question

Does this game loop feel right for a 2-year-old on a phone or tablet?

- Big tap targets, no text, no score, no lose-condition.
- Balloons pop up from holes, can be tapped, then burst into tiny confetti.
- Difficulty grows only by showing more balloons at once; timing stays constant.

## Decisions baked in

| Decision | Prototype value |
|---|---|
| Theme | Balloons, drawn in code (no image assets). |
| Motion | Pop up out of fixed holes in a 3×3 grid. |
| Active count | Starts at 1, grows by 1 every 5 pops, capped at 4. |
| Timing | Constant; no speed-up. |
| Auto-retract | A balloon untouched for ~3.5s sinks back down on its own. |
| Hit feedback | Swell → pop sound → burst → 8 confetti bits. |
| Miss feedback | Nothing. |
| Grid | 3×3 holes; balloon fills ~78% of each hole. |
| Score / lose / text | None. |

## Run it

```bash
cd prototype/balloon-pop
pnpm install
pnpm dev
```

Then open the printed URL on desktop Safari/Chrome or on an actual iPhone/iPad on the same network.

## What's stubbed

- **Sound:** the pop is a synthesized Web Audio noise burst. The real pop sound will be sourced in ticket #5 (now sound-only, since graphics are code-drawn).
- **Ramp metric:** difficulty grows per successful pop, not per second. Try it; if it should be time-based instead, that's a one-line change.

## What to watch for

- Is the rise/retract timing calm or boring?
- Does the count ramp feel like escalation or just clutter?
- Is the balloon big enough to hit on the devices you care about?
- Should a missed tap do *anything* visually?
