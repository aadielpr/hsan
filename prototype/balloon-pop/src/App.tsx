import { useCallback, useEffect, useRef, useState } from 'react'

// v1 toddler balloon-pop game
// Built from the prototype on branch prototype/balloon-pop; see issue #9.

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
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [status, setStatus] = useState<GameStatus>('idle')
  const [pops, setPops] = useState(0)
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS)

  const popSoundRef = useRef(new Audio('/sounds/pop1.ogg'))
  const idRef = useRef(0)
  const startedAtRef = useRef<number | null>(null)

  const startPlaying = useCallback(() => {
    setStatus('playing')
    startedAtRef.current = Date.now()
  }, [])

  const resetGame = useCallback(() => {
    setBalloons([])
    setConfetti([])
    setPops(0)
    setTimeLeftMs(GAME_DURATION_MS)
    startedAtRef.current = null
    setStatus('idle')
  }, [])

  const finishGame = useCallback((result: 'won' | 'lost') => {
    setStatus(result)
  }, [])

  const popBalloon = useCallback(
    (b: Balloon, clientX: number, clientY: number) => {
      if (status === 'won' || status === 'lost') return
      if (b.state === 'popping' || b.state === 'retracting') return

      setBalloons((prev) => prev.map((x) => (x.id === b.id ? { ...x, state: 'popping' } : x)))

      const now = Date.now()
      const pieces: ConfettiPiece[] = []
      for (let i = 0; i < 8; i++) {
        pieces.push({
          id: idRef.current++,
          x: clientX,
          y: clientY,
          angle: Math.random() * 360,
          distance: 40 + Math.random() * 60,
          color: randomConfettiColor(),
          createdAt: now,
        })
      }
      setConfetti((prev) => [...prev, ...pieces])

      const s = popSoundRef.current
      s.currentTime = 0
      s.play().catch(() => {})

      setPops((prev) => {
        const next = prev + 1
        if (next >= TARGET_POPS) {
          finishGame('won')
        }
        return next
      })

      setTimeout(() => {
        setBalloons((prev) => prev.filter((x) => x.id !== b.id))
      }, POP_MS)
    },
    [status, finishGame],
  )

  const handleBalloonPointerDown = useCallback(
    (e: React.PointerEvent, b: Balloon) => {
      e.stopPropagation()
      if (status === 'idle') {
        startPlaying()
      }
      popBalloon(b, e.clientX, e.clientY)
    },
    [status, startPlaying, popBalloon],
  )

  const handleContainerPointerDown = useCallback(() => {
    if (status === 'idle') {
      startPlaying()
    }
  }, [status, startPlaying])

  const restartNow = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      resetGame()
      startPlaying()
    },
    [resetGame, startPlaying],
  )

  // Game loop: spawn, auto-retract, cleanup confetti, timer.
  useEffect(() => {
    if (status !== 'playing') return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = startedAtRef.current ? now - startedAtRef.current : 0
      const remaining = Math.max(0, GAME_DURATION_MS - elapsed)
      setTimeLeftMs(remaining)

      if (remaining === 0) {
        finishGame('lost')
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

        if (next.length < maxActive) {
          const holeIndex = pickEmptyHole(next, HOLE_COUNT)
          if (holeIndex !== null) {
            const id = idRef.current++
            const b: Balloon = {
              id,
              holeIndex,
              color: randomColor(),
              state: 'rising',
              createdAt: now,
            }
            setTimeout(() => {
              setBalloons((curr) => curr.map((x) => (x.id === id ? { ...x, state: 'idle' } : x)))
            }, RISE_MS)
            return [...next, b]
          }
        }

        return next
      })

      setConfetti((prev) => prev.filter((c) => now - c.createdAt < CONFETTI_MS))
    }, SPAWN_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [status, finishGame])

  // Spawn one balloon immediately when the game starts so the screen isn't empty.
  useEffect(() => {
    if (status !== 'playing') return
    const now = Date.now()
    setBalloons((prev) => {
      if (prev.length > 0) return prev
      const holeIndex = pickEmptyHole(prev, HOLE_COUNT)
      if (holeIndex === null) return prev
      const id = idRef.current++
      const b: Balloon = {
        id,
        holeIndex,
        color: randomColor(),
        state: 'rising',
        createdAt: now,
      }
      setTimeout(() => {
        setBalloons((curr) => curr.map((x) => (x.id === id ? { ...x, state: 'idle' } : x)))
      }, RISE_MS)
      return [b]
    })
  }, [status])

  const isFinished = status === 'won' || status === 'lost'

  return (
    <div className="game" onPointerDown={handleContainerPointerDown}>
      <div className="hud">
        <div className="hud-section">
          <div className="timer-bar">
            <div
              className="timer-bar__fill"
              style={{ width: `${(timeLeftMs / GAME_DURATION_MS) * 100}%` }}
            />
          </div>
          <div className="timer-number">{formatTime(timeLeftMs)}</div>
        </div>
        <div className="hud-section">
          <div className="counter">
            {pops} / {TARGET_POPS}
          </div>
          <div className="counter-label">pops</div>
        </div>
      </div>

      <div className={`grid ${isFinished ? 'grid--dimmed' : ''}`}>
        {Array.from({ length: HOLE_COUNT }).map((_, i) => {
          const b = balloons.find((x) => x.holeIndex === i)
          return (
            <div key={i} className="hole">
              {b && (
                <div
                  className={`balloon balloon--${b.state}`}
                  style={{ backgroundColor: b.color }}
                  onPointerDown={(e) => handleBalloonPointerDown(e, b)}
                />
              )}
            </div>
          )
        })}
      </div>

      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti"
          style={{
            left: c.x,
            top: c.y,
            backgroundColor: c.color,
            '--angle': `${c.angle}deg`,
            '--distance': `${c.distance}px`,
          } as React.CSSProperties}
        />
      ))}

      {isFinished && (
        <div className="overlay">
          <div className="overlay__content">
            <div className="overlay__emoji">{status === 'won' ? '🎉' : '⏰'}</div>
            <div className="overlay__title">
              {status === 'won' ? 'You did it!' : "Time's up!"}
            </div>
            <div className="overlay__count">{pops} pops</div>
            <button className="overlay__button" onPointerDown={restartNow}>
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
