# Game App Design Description — Console-Style Mini-Game Collection (for Google Stitch)

A web game app built like an old TV game console: you turn it on, see a game-select menu, pick a cartridge, and play. It is a React + Vite + TypeScript single-page web app for touch devices (iPhone and iPad). It is for toddlers, ages 2–6. No reading is required to play. Every game is tap-only and no-fail in feel, with instant positive feedback. The whole thing should feel like a small handheld console a kid turns on and picks a game from.

---

## The vibe

It should feel like booting an old game console connected to a TV. A short boot/title moment, then a menu of games shown like cartridges or arcade tiles. The child picks one and "inserts the cartridge" to play. When the round ends, they drop back to the console menu to pick the next game.

The mood is nostalgic and chunky: rounded pixel-ish shapes, candy-bright but slightly retro colors, soft CRT/scanline or screen-glow touches, big tactile buttons that feel like console buttons. Friendly, not scary, not overstimulating. Characters and games are cute and cartoonish. Sound is soft 8-bit-ish pops, bloops, and a gentle menu click.

---

## Pages

**Boot / title screen**
Turning the console on. A short title moment and one clear Start action, like pressing Start on a console.

**Game Select (the console menu)**
The console home. A row of big game "cartridges" the child taps to play. On a phone the cards are big and stacked; on a tablet they sit side by side. Each cartridge shows the game's main character and a candy accent color. Picking one feels like slotting in a cartridge. Only playable games are shown.

**Balloon Pop game (existing)**
Balloons rise out of holes in a grid. Tap a balloon to pop it — pop sound + confetti. A round runs a short time with a target number of pops. There is a HUD (timer and a pop counter). Round ends with a pass/fail gate — but the fail state stays soft and friendly, never harsh, never "Game over".

**Whack-a-Mole game (new)**
Same shell as Balloon Pop, but moles peek out of holes in a grassy garden. Tap a mole to bonk it back down — boing sound + confetti bits. Same round rules and same soft pass/fail gate.

**End / reward overlay (shared by both games)**
When a round ends, a celebratory overlay shows how the child did and offers to play again. Both the won and the lost overlays stay friendly, soft, and encouraging. The wording and emoji are not fixed — any short, kind, age-appropriate phrase works. The lost state is soft in tone (no harsh red, no big X, no sad face).

**Parental area**
A gated adult area that toddlers cannot enter. Holds settings, sound toggle, and credits. Reached from a subtle control on the console/home screens, never during play. For the child, it is invisible.

---

## Conventions across the whole app

- Picture-first, illustrated cartridge cards; no text-led choices.
- Only playable games are shown to the child.
- A persistent way back to the console menu on every game screen, in the same place every time.
- No-fail in feel, instant positive feedback on every tap.
- No ads, no links out, no purchasing — the child-facing UI has no distractions.
- Boot → Game Select → game → round end → back to Game Select. The console loop.

Beyond this, use your own design knowledge for layout, colors, typography, spacing, and the finer UI details. Keep it kid-friendly, tactile, console-themed.