---
id: 0004
title: Source sounds and shape graphics for the whack-a-mole
labels: [wayfinder:research]
parent: MAP
assignee:
status: open
blocked-by: [0003]
blocks: []
closed-reason: ""
---

## Question

Once the game design (ticket 0003) says what's needed, find free, license-clear assets that fit a toddler game:

- A pop / boing / happy sound for a hit, and maybe a soft ambient sound — confirm which from the design.
- Simple shape or friendly-face graphics (or a decision to draw them in SwiftUI instead of importing images — often the simpler route).
- Verify licenses (CC0 / public domain preferred) against primary sources (e.g. freesound.org, OpenGameArt), not secondary write-ups.
- Recommend whether to ship sounds as files or synthesize them in code (Swift's AVFoundation can play short clips).

Output: a Markdown findings file (e.g. `wayfinder/research/assets.md`) with direct links and license notes. Resolved by a `/research` subagent.