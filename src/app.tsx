import { createSignal, createEffect, onCleanup, createMemo, Show, For, type JSX } from 'solid-js'

// v1 toddler balloon-pop game — SolidJS port of the React version.
// Pure tech swap: behavior, layout, CSS classes, and constants are unchanged.

const HOLE_COUNT = 9
const AUTO_RETRACT_MS = 3500
const SPAWN_INTERVAL_MS = 1000
const RISE_MS = 300
const RETRACT_MS = 300
const POP_MS = 200
const CONFETTI_MS = 500
const GAME_DURATION_MS = 60000
const TARGET_POPS = 20

const RAMP_STEPS = [
  { atMs: 0, maxActive: 1 },
  { atMs: 10000, maxActive: 2 },
  { atMs: 25000, maxActive: 3 },
]

const COLORS = [
  '#FF6B6B', // red
  '#4ECDC4', // teal
  '#FFE66D', // yellow
  '#FF9F43', // orange
  '#A55EEA', // purple
  '#54A0FF', // blue
]

type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

type BalloonState = 'rising' | 'idle' | 'popping' | 'retracting'

type Balloon = {
  id: number
  holeIndex: number
  color: string
  state: BalloonState
  createdAt: number
}

type ConfettiPiece = {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  color: string
  createdAt: number
}

function pickEmptyHole(balloons: Balloon[], holeCount: number): number | null {
  const occupied = new Set(balloons.map((b) => b.holeIndex))
  const free: number[] = []
  for (let i = 0; i < holeCount; i++) {
    if (!occupied.has(i)) free.push(i)
  }
  if (free.length === 0) return null
  return free[Math.floor(Math.random() * free.length)]
}

function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function randomConfettiColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function maxActiveForElapsed(elapsedMs: number): number {
  let max = 1
  for (const step of RAMP_STEPS) {
    if (elapsedMs >= step.atMs) max = step.maxActive
  }
  return max
}

function formatTime(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000))
  return String(seconds)
}

export default function App() {
  const [balloons, setBalloons] = createSignal<Balloon[]>([])
  const [confetti, setConfetti] = createSignal<ConfettiPiece[]>([])
  const [status, setStatus] = createSignal<GameStatus>('idle')
  const [pops, setPops] = createSignal(0)
  const [timeLeftMs, setTimeLeftMs] = createSignal(GAME_DURATION_MS)

  // Solid component functions run once; plain `let` persists exactly like a React useRef.
  const popSound = new Audio('/sounds/pop1.mp3')
  let idCounter = 0
  let startedAt: number | null = null

  const isFinished = createMemo(() => status() === 'won' || status() === 'lost')

  function spawnBalloons(current: Balloon[], targetCount: number): Balloon[] {
    const next = [...current]
    while (next.length < targetCount) {
      const holeIndex = pickEmptyHole(next, HOLE_COUNT)
      if (holeIndex === null) break

      const id = idCounter++
      const b: Balloon = {
        id,
        holeIndex,
        color: randomColor(),
        state: 'rising',
        createdAt: Date.now(),
      }
      setTimeout(() => {
        setBalloons((curr) => curr.map((x) => (x.id === id ? { ...x, state: 'idle' } : x)))
      }, RISE_MS)
      next.push(b)
    }
    return next
  }

  function startPlaying() {
    setStatus('playing')
    startedAt = Date.now()
  }

  function resetGame() {
    setBalloons([])
    setConfetti([])
    setPops(0)
    setTimeLeftMs(GAME_DURATION_MS)
    startedAt = null
    setStatus('idle')
  }

  function finishGame(result: 'won' | 'lost') {
    setStatus(result)
  }

  function popBalloon(b: Balloon, clientX: number, clientY: number) {
    // status() and pops() are read fresh at call time — no stale-closure problem.
    if (status() !== 'playing') return
    if (b.state === 'popping' || b.state === 'retracting') return

    setBalloons((prev) => prev.map((x) => (x.id === b.id ? { ...x, state: 'popping' } : x)))

    const now = Date.now()
    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 8; i++) {
      pieces.push({
        id: idCounter++,
        x: clientX,
        y: clientY,
        angle: Math.random() * 360,
        distance: 40 + Math.random() * 60,
        color: randomConfettiColor(),
        createdAt: now,
      })
    }
    setConfetti((prev) => [...prev, ...pieces])

    const s = popSound
    s.currentTime = 0
    s.play().catch(() => {})

    setPops((p) => p + 1)

    setTimeout(() => {
      setBalloons((prev) => prev.filter((x) => x.id !== b.id))
    }, POP_MS)
  }

  function handleBalloonPointerDown(e: PointerEvent, b: Balloon) {
    e.stopPropagation()
    popBalloon(b, e.clientX, e.clientY)
  }

  function restartNow(e: PointerEvent) {
    e.stopPropagation()
    resetGame()
    startPlaying()
  }

  // Game loop: spawn, auto-retract, cleanup confetti, timer.
  // Reading status() here subscribes the effect; the interval reads pops() non-tracking.
  createEffect(() => {
    if (status() !== 'playing') return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = startedAt ? now - startedAt : 0
      const remaining = Math.max(0, GAME_DURATION_MS - elapsed)
      setTimeLeftMs(remaining)

      if (remaining === 0) {
        finishGame(pops() >= TARGET_POPS ? 'won' : 'lost')
        return
      }

      const maxActive = maxActiveForElapsed(elapsed)

      setBalloons((prev) => {
        let next = prev
        const retractingIds: number[] = []

        next = next.map((b) => {
          if (b.state === 'idle' && now - b.createdAt > AUTO_RETRACT_MS) {
            retractingIds.push(b.id)
            return { ...b, state: 'retracting' }
          }
          return b
        })

        if (retractingIds.length > 0) {
          setTimeout(() => {
            setBalloons((curr) => curr.filter((b) => !retractingIds.includes(b.id)))
          }, RETRACT_MS)
        }

        return spawnBalloons(next, maxActive)
      })

      setConfetti((prev) => prev.filter((c) => now - c.createdAt < CONFETTI_MS))
    }, SPAWN_INTERVAL_MS)

    onCleanup(() => clearInterval(interval))
  })

  // Spawn one balloon immediately when the game starts so the screen isn't empty.
  createEffect(() => {
    if (status() !== 'playing') return
    setBalloons((prev) => (prev.length > 0 ? prev : spawnBalloons(prev, 1)))
  })

  return (
    <div class="game">
      <div class="hud">
        <div class="hud-section">
          <div class="timer-bar">
            <div
              class="timer-bar__fill"
              style={{ width: `${(timeLeftMs() / GAME_DURATION_MS) * 100}%` }}
            />
          </div>
          <div class="timer-number">{formatTime(timeLeftMs())}</div>
        </div>
        <div class="hud-section">
          <div class="counter">
            {pops()} / {TARGET_POPS}
          </div>
          <div class="counter-label">pops</div>
        </div>
      </div>

      <div class={`grid ${isFinished() ? 'grid--dimmed' : ''}`}>
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <div class="hole">
            <Show when={balloons().find((x) => x.holeIndex === i)}>
              {(b) => (
                <div
                  class={`balloon balloon--${b().state}`}
                  style={{ 'background-color': b().color }}
                  onPointerDown={(e) => handleBalloonPointerDown(e, b())}
                />
              )}
            </Show>
          </div>
        ))}
      </div>

      <For each={confetti()}>
        {(c) => (
          <div
            class="confetti"
            style={
              {
                left: c.x,
                top: c.y,
                'background-color': c.color,
                '--angle': `${c.angle}deg`,
                '--distance': `${c.distance}px`,
              } as JSX.CSSProperties
            }
          />
        )}
      </For>

      <Show when={status() === 'idle'}>
        <div class="overlay">
          <div class="overlay__content">
            <div class="overlay__emoji">🎈</div>
            <div class="overlay__title">Balloon Pop!</div>
            <button class="overlay__button" onPointerDown={startPlaying}>
              Start
            </button>
          </div>
        </div>
      </Show>

      <Show when={isFinished()}>
        <div class="overlay">
          <div class="overlay__content">
            <div class="overlay__emoji">{status() === 'won' ? '🎉' : '⏰'}</div>
            <div class="overlay__title">
              {status() === 'won' ? 'You did it!' : "Time's up!"}
            </div>
            <div class="overlay__count">{pops()} pops</div>
            <button class="overlay__button" onPointerDown={restartNow}>
              Start again
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}