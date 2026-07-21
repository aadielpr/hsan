import { COLORS, HOLE_COUNT, RAMP_STEPS } from './constants'
import type { Balloon } from './balloon-pop.type'

export function pickEmptyHole(balloons: Balloon[], holeCount: number = HOLE_COUNT): number | null {
  const occupied = new Set(balloons.map((b) => b.holeIndex))
  const free: number[] = []
  for (let i = 0; i < holeCount; i++) {
    if (!occupied.has(i)) free.push(i)
  }
  if (free.length === 0) return null
  return free[Math.floor(Math.random() * free.length)]
}

export function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function randomConfettiColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function maxActiveForElapsed(elapsedMs: number): number {
  let max = 1
  for (const step of RAMP_STEPS) {
    if (elapsedMs >= step.atMs) max = step.maxActive
  }
  return max
}

export function formatTime(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000))
  return String(seconds)
}
