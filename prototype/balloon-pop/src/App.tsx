import { useCallback, useEffect, useRef, useState } from 'react'

// PROTOTYPE — toddler balloon-pop game
// Question: does this game loop feel right for a 2-year-old?
// Throwaway; do not ship to production.

const HOLE_COUNT = 9
const AUTO_RETRACT_MS = 3500
const SPAWN_INTERVAL_MS = 1000
const RISE_MS = 300
const RETRACT_MS = 300
const POP_MS = 200
const CONFETTI_MS = 500
const MAX_ACTIVE_CAP = 4
const RAMP_EVERY_POPS = 5

const COLORS = [
  '#FF6B6B', // red
  '#4ECDC4', // teal
  '#FFE66D', // yellow
  '#FF9F43', // orange
  '#A55EEA', // purple
  '#54A0FF', // blue
]

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

function playPop(audioCtx: AudioContext) {
  const t = audioCtx.currentTime
  const duration = 0.12

  // Noise burst
  const bufferSize = Math.floor(audioCtx.sampleRate * duration)
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
  }

  const noise = audioCtx.createBufferSource()
  noise.buffer = buffer

  const noiseGain = audioCtx.createGain()
  noiseGain.gain.setValueAtTime(0.8, t)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + duration)

  noise.connect(noiseGain)
  noiseGain.connect(audioCtx.destination)
  noise.start(t)
  noise.stop(t + duration)

  // Short body tone
  const osc = audioCtx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(280, t)
  osc.frequency.exponentialRampToValueAtTime(80, t + duration)

  const oscGain = audioCtx.createGain()
  oscGain.gain.setValueAtTime(0.4, t)
  oscGain.gain.exponentialRampToValueAtTime(0.01, t + duration)

  osc.connect(oscGain)
  oscGain.connect(audioCtx.destination)
  osc.start(t)
  osc.stop(t + duration)
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

export default function App() {
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [maxActive, setMaxActive] = useState(1)
  const [, setPops] = useState(0)
  const [started, setStarted] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const idRef = useRef(0)

  const ensureAudio = useCallback(() => {
    if (!started) setStarted(true)
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext
      audioCtxRef.current = new Ctx()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
  }, [started])

  const popBalloon = useCallback((b: Balloon, clientX: number, clientY: number) => {
    if (b.state === 'popping' || b.state === 'retracting') return

    ensureAudio()

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

    if (audioCtxRef.current) {
      playPop(audioCtxRef.current)
    }

    setPops((prev) => {
      const next = prev + 1
      if (next % RAMP_EVERY_POPS === 0) {
        setMaxActive((m) => Math.min(m + 1, MAX_ACTIVE_CAP))
      }
      return next
    })

    setTimeout(() => {
      setBalloons((prev) => prev.filter((x) => x.id !== b.id))
    }, POP_MS)
  }, [ensureAudio])

  const handleBalloonPointerDown = useCallback(
    (e: React.PointerEvent, b: Balloon) => {
      e.stopPropagation()
      popBalloon(b, e.clientX, e.clientY)
    },
    [popBalloon],
  )

  // First interaction starts the loop and audio context.
  const handleContainerPointerDown = useCallback(() => {
    ensureAudio()
  }, [ensureAudio])

  // Game loop: spawn, auto-retract, cleanup confetti.
  useEffect(() => {
    if (!started) return

    const interval = setInterval(() => {
      const now = Date.now()

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
  }, [started, maxActive])

  // Spawn one balloon immediately when the game starts so the screen isn't empty.
  useEffect(() => {
    if (!started) return
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
  }, [started])

  return (
    <div className="game" onPointerDown={handleContainerPointerDown}>
      <div className="grid">
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
    </div>
  )
}
