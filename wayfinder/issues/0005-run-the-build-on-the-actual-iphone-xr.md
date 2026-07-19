---
id: 0005
title: How to run the build on the actual iPhone XR
labels: [wayfinder:research]
parent: MAP
assignee:
status: open
blocked-by: []
blocks: []
closed-reason: ""
---

## Question

Find the current official method to run a self-built app on the user's own iPhone XR for their son to play, without publishing to the App Store.

- Free Apple ID provisioning (build to a personal device; app is re-signed every 7 days) vs. the paid Apple Developer Program (US$99/yr, longer signing). For "son plays my game on my phone," the free route is the candidate.
- The exact steps in current Xcode (sign in with Apple ID, set a Team, set the device, build & run over USB or Wi-Fi).
- Any limits that matter for this use case (7-day expiry, max apps, no push, etc.) — confirm against Apple's current docs.

Output: a Markdown findings file (e.g. `wayfinder/research/device-deploy.md`) with each claim cited to Apple's current docs. Resolved by a `/research` subagent.