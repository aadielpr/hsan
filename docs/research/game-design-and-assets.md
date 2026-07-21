# Design Brief — Toddler Mini-Games Collection (for Google Stitch)

A single-page React + Vite + TypeScript web app for a **2–3 year-old child**, running on iPhone XR and iPad Safari. The app grows from one "Balloon Pop" game into a small collection of toddler mini-games behind a picture-based **Select Game** home menu. No reading required. No-fail, no-penalty, instant-positive-feedback design throughout. Built for touch (pointer events, multi-touch).

---

## Global design tokens (apply to every screen)

**Vibe (aesthetic):** playful, soft, rounded, high-contrast, calm — not overstimulating. Friendly rounded display type. Big shapes, generous whitespace, gentle candy-bright palette.

**Typography**
- Display / headings / big labels / game labels: **Fredoka** (Google Fonts, OFL) — rounded, friendly.
- Body / small text / adult-facing labels: **Nunito** (Google Fonts, OFL) — rounded sans, highly readable.
- Child-facing screens use almost no text; labels are for adults only.
- Base sizes: title 64px, card label 24px, HUD number 40px, small adult text 14px.

**Color palette**
- Background gradient: soft sky `#B5E8FF` → mint cream `#E9FBFF` (top to bottom).
- Primary CTA: candy red `#FF6B6B`.
- Secondary / hole: warm brown `#7A5230`.
- Balloon accent colors: `#FF6B6B` red, `#4ECDC4` teal, `#FFE66D` yellow, `#FF9F43` orange, `#A55EEA` purple, `#54A0FF` blue.
- Text on light: `#3A2E2E` (soft dark brown, not pure black).
- Success/won: `#52D9A3` green accent. Fail: `#FF9F43` orange-amber accent, soft (no harsh red, no big "X").

**Shape & spacing**
- Border radius: cards 32px, buttons 24px (pill), holes 50% (circle).
- Tap targets: minimum 88×88px (well above Apple's 44pt minimum), prefer whole-cell taps.
- Spacing scale: 8 / 16 / 24 / 32 / 48px.
- Buttons use chunky rounded "pill" or "rounded-rect" style with a slightly darker bottom shadow for tactile feel.

**Motion:** gentle, short. Rise 300ms, pop 200ms, retract 300ms, confetti 500ms. Provide a "reduce motion" path that shortens these.

**Audio:** a short soft "pop" sound on every successful tap; gentle UI click on menu taps. Play from 3–5 different CC0 pop sounds at random so feedback never feels mechanical. Optional short playful music loop, CC0.

---

## Screen 1 — Select Game (home menu)

**Anatomy (layout):**
- Full-screen background gradient (sky → mint).
- App title area is optional and minimal; the screen is dominated by game cards.
- Centered card layout: **2 large rounded picture cards**, stacked vertically (top/bottom) on iPhone XR portrait; a **2-column grid** on iPad.
- Each card ≈ 70% of screen width, ≈ 40% of screen height, rounded 32px, full-bleed illustration inside.
- A persistent **Home icon is NOT needed here** (this is home).
- Small low-contrast **gear icon** fixed top-LEFT corner (parental area entry, see Screen 5). ~24px, opacity 0.4.

**Vibe (aesthetic):** soft, rounded, candy-bright, tactile. Each card has a subtle drop shadow and a slightly raised look; pressing a card scales it to 0.97 for 100ms.

**Content (what each card shows):**
- Card 1 — **Balloon Pop**: full-card illustration of a single round happy balloon (teal `#4ECDC4`) with the Kenney "Googly Eyes" cartoon eyes on it. No text for the child; tiny Fredoka label "Balloons" at the bottom for adults.
- Card 2 — **Whack-a-Mole** (new): full-card illustration of a friendly mole head poking out of a brown mound, with Googly Eyes. Tiny Fredoka label "Moles".
- (Future cards up to 3–4 total: Bubbles, Catch-the-Fruit, Pop-the-Animal — same picture-card pattern.)
- Never show locked or "coming soon" cards to the child; only playable games appear.

**States:**
- Default: cards resting.
- Pressed: card scales to 0.97, soft 100ms, a gentle click sound plays.
- On release: navigate to the tapped game's screen (Screen 2 or Screen 3).

**Behavior:** single tap on a card opens that game. No swipe, no scroll needed (cards fit the screen). Multi-touch handled gracefully (only one navigates).

---

## Screen 2 — Balloon Pop game

**Anatomy (layout):**
- Top HUD bar (fixed): left = Home button (large house icon, Lucide `house`, ~56px, same corner every game); center = timer bar (rounded track with fill) + big timer number; right = pop counter "X / 20" with small "pops" label.
- Center play area: **3×3 grid of holes** (brown circles). Balloons rise out of a hole, sit idle, then retract if not popped.
- Overlay screens (idle start, won) cover the whole play area with a translucent scrim and centered content.

**Vibe:** cheerful, high-contrast targets against the soft background. Balloons are bright solid colors with a slight highlight gloss (CSS radial-gradient).

**Content:**
- Balloons: round, ~70% of the hole cell size, one of the 6 accent colors, random per spawn.
- Spawn rules: start with 1 active balloon, ramp to 2 at 10s, to 3 at 25s. Idle balloons auto-retract after 3500ms. Round length 60s, target 20 pops (adult-facing only; not shown as a pass/fail gate).
- Confetti burst on pop: 8 small colored squares flying outward.
- Pop sound on tap (random of 3–5 CC0 pops).

**States:**
- `idle`: overlay with 🎈 emoji, "Balloon Pop!" title (Fredoka), large Start CTA pill.
- `playing`: HUD + grid active, no overlay, Home button visible top-left always.
- `won` (reached 20+ pops before time ends): success overlay, green accent. Wording options (pick one, keep it short and kind): "You did it!" · "Great popping!" · "Nice work!" · "Yay!". Count shows "{n} pops". CTA pill options: "Play again" · "Again!" · "One more?".
- `lost` (time runs out with < 20 pops): soft fail overlay, orange-amber accent. Wording options (pick one, stay friendly not harsh): "Time's up!" · "So close!" · "Almost there!" · "Let's try again!". Count shows "{n} pops". CTA pill options: "Try again" · "Again!" · "Go again?".
- Both end states stay soft in tone — no harsh red, no big X, no sad face, no "Game over". The child can immediately play again. Exact emoji and wording are not fixed; choose any friendly, age-appropriate phrase/emoji per screen.

**Behavior:** tap balloon → pop (sound + confetti + counter +1). Tap Home → return to Screen 1. Tap Start/Play again → reset to `playing`.

---

## Screen 3 — Whack-a-Mole game (NEW)

**Anatomy (layout):** identical shell to Screen 2 — top HUD with Home (top-left), timer, counter; center 3×3 grid of holes set in a grassy strip.

**Vibe:** outdoor garden — sky gradient top, grass green `#8ED89B` strip behind the holes, brown `#7A5230` mounds. Cute, not scary.

**Content:**
- Mole replaces balloon: a rounded brown mole head rising from a hole, with big cartoon Googly Eyes and a pink nose.
- Same ramp/score rules as Balloon Pop (gentle curve, 60s, no penalty for missing).
- Tap a mole → it pops down with a soft "boing" + a few confetti/leaf particles + counter +1.
- Missed mole retracts on its own after 3500ms.

**States:** `idle` (overlay: friendly mole emoji + short title + Start pill), `playing`, `won` (success overlay + count + "Play again"-style pill), `lost` (soft fail overlay + count + "Try again"-style pill). Word and emoji choices are not fixed — use the same short, friendly options listed in the shared end overlay (Screen 4) so both games feel consistent. Both end states stay soft and friendly, never harsh.

**Behavior:** same as Screen 2. Home → Screen 1.

---

## Screen 4 — End / reward overlay (shared component)

Used by both games. Centered translucent scrim with: a large emoji, a short Fredoka title, the pop count in Nunito, one large CTA pill. The round keeps a gentle pass/fail gate (reach 20 pops before 60s).

**Wording options (not fixed — pick one per state, keep short and kind):**
- **Won:** title — "You did it!" · "Great popping!" · "Nice work!" · "Yay!". CTA — "Play again" · "Again!" · "One more?".
- **Lost (soft):** title — "Time's up!" · "So close!" · "Almost there!" · "Let's try again!". CTA — "Try again" · "Again!" · "Go again?".

Both end screens stay soft and friendly — no harsh red, no big X, no sad face, no "Game over". Exact emoji and wording are not fixed; choose any friendly, age-appropriate phrase/emoji per screen, and keep both games consistent with each other.

---

## Screen 5 — Parental area (gated, adult-facing)

**Anatomy:**
- Reached from the low-contrast top-left gear icon on the Home screen (Screen 1 only — never shown during play).
- Opens a **parental gate** overlay: instructions "Hold for 2 seconds to enter" with a big hold button, or "Type the answer to 3 + 4". A 2–3 year-old cannot pass it.
- Inside: vertical settings list. Rows: Sound (on/off toggle), Music (on/off toggle), Credits, About.

**Vibe:** plain, adult, calm — tonally neutral, not playful. System font or Nunito. White card on the sky background.

**Content:** toggles use Lucide icons (`volume-2`, `music`). Credits row shows a shortSERP of CC0/OFL asset credits (Kenney, Google Fonts Fredoka/Nunito, OpenGameArt CC0 sounds). About row: app name + version.

**States:** gate-closed (challenge visible), gate-open (settings list), back (small top-left back arrow) returns to Home.

---

## Responsive behavior

- **iPhone XR portrait** (primary): 1-column card stack on Home; 3×3 play grid fills width with comfortable gaps; HUD wraps to one row.
- **iPad** (secondary): Home becomes a 2-column card grid; play grid is centered with larger holes; HUD uses bigger hit targets.
- All tap targets ≥ 88×88px on both. No text-led navigation anywhere a child can reach.

---

## Cross-app conventions to match (for consistency)

- Picture-first, character/concept tiles; illustrated, not photographic; no text-led choices.
- Only show playable games to the child; locks live behind a parental gate.
- One persistent Home affordance in the **same corner on every game screen**.
- No-fail, no-penalty, instant positive feedback on every interaction.
- No ads, no links out of the app, no purchasing — keep the child UI free of distractions (matches Apple Kids Category §1.3 and Google Play Families).

---

## Recommended concrete assets to bundle (all free, verified primary sources)

- **Fonts (self-host, ~30KB):** Fredoka + Nunito from Google Fonts — SIL OFL, no attribution needed.
- **SFX (CC0):** 3–5 short pop/boing sounds from Kenney "Impact Sounds" + OpenGameArt "Bubbles Pop"/"3 Pop Sounds" — pick randomly per tap. UI clicks from Kenney "Interface Sounds".
- **Sprites (defer to v2 but ready):** Kenney "Tiny Farm" (CC0 cute animals) + "Googly Eyes" (CC0) for mole/balloon faces; "Splat Pack" for pop impact frames; "UI Pack" + "Pattern Pack" for menu chrome; "Background Elements Remastered" for scenery. All CC0, no attribution.
- **Icons (parental area only):** Lucide (ISC) or Phosphor (MIT) — small SVG set: `house`, `settings`, `volume-2`, `music`, `arrow-left`.
- **Music loop (optional):** one short CC0 loop from Free Music Archive; or CC-BY from Incompetech with a one-line credit in the Credits screen.
- **Avoid:** CC-BY-NC / GPL assets and anything requiring attribution, unless you commit to maintaining a credits + license file. Skip Pixabay (unverifiable license) and itch.io packs unless you check each pack's stated license.

---

## Sources (provenance; not needed by Stitch — for the human)

- Apple App Review Guidelines §1.3 (Kids Category): https://developer.apple.com/app-store/review/guidelines/
- Apple HIG — Buttons (44pt min tap target): https://developer.apple.com/design/human-interface-guidelines/buttons
- Google Play Families policy: https://play.google.com/about/families/
- Google Stitch Prompt Guide (3-Layer Vibe Structure, screen-by-screen): https://discuss.ai.google.dev/t/stitch-prompt-guide/83844
- Google Stitch llms.txt: https://stitch.withgoogle.com/llms.txt
- Example toddler apps: PBS KIDS https://www.pbskids.org · Sago Mini https://www.sagomini.com/apps · Khan Academy Kids https://apps.apple.com/us/app/khan-academy-kids/id1378467217
- Kenney.nl assets (CC0): https://kenney.nl/assets — Tiny Farm, Toon Characters, Googly Eyes, UI Pack, Pattern Pack, Background Elements Remastered, Splat Pack, Impact Sounds, Interface Sounds
- OpenGameArt (CC0): https://opengameart.org/content/bubbles-pop · https://opengameart.org/content/3-pop-sounds
- Freesound FAQ (license notes): https://freesound.org/help/faq/
- Fonts: Google Fonts Fredoka https://fonts.google.com/specimen/Fredoka · Nunito https://fonts.google.com/specimen/Nunito · SIL OFL https://scripts.sil.org/OFL
- Icons: Lucide (ISC) https://lucide.dev/license · Phosphor (MIT) https://phosphoricons.com/