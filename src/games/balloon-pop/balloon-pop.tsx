import { createSignal, createEffect, onCleanup, createMemo, Show, For, type JSX } from 'solid-js'
import { useNavigate } from '@solidjs/router'

import {
  HOLE_COUNT,
  AUTO_RETRACT_MS,
  SPAWN_INTERVAL_MS,
  RISE_MS,
  RETRACT_MS,
  POP_MS,
  CONFETTI_MS,
  GAME_DURATION_MS,
  TARGET_POPS,
} from './constants'
import { pickEmptyHole, randomColor, randomConfettiColor, maxActiveForElapsed, formatTime } from './utils'
import type { Balloon, BalloonGameStatus, ConfettiPiece } from './balloon-pop.type'

export default function BalloonPopGame() {
  const navigate = useNavigate()

  const [balloons, setBalloons] = createSignal<Balloon[]>([])
  const [confetti, setConfetti] = createSignal<ConfettiPiece[]>([])
  const [status, setStatus] = createSignal<BalloonGameStatus>('idle')
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

  function goToLobby(e: PointerEvent) {
    e.stopPropagation()
    navigate('/')
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
      <button
        type="button"
        class="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-lg font-bold text-slate-700 shadow-md active:scale-95"
        onPointerDown={goToLobby}
      >
        🏠 Lobby
      </button>

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
