export const HOLE_COUNT = 9
export const AUTO_RETRACT_MS = 3500
export const SPAWN_INTERVAL_MS = 1000
export const RISE_MS = 300
export const RETRACT_MS = 300
export const POP_MS = 200
export const CONFETTI_MS = 500
export const GAME_DURATION_MS = 60000
export const TARGET_POPS = 20

export const RAMP_STEPS = [
  { atMs: 0, maxActive: 1 },
  { atMs: 10000, maxActive: 2 },
  { atMs: 25000, maxActive: 3 },
] as const

export const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#FF9F43',
  '#A55EEA',
  '#54A0FF',
]
