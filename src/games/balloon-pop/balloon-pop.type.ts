export type BalloonGameStatus = 'idle' | 'playing' | 'won' | 'lost'

export type BalloonState = 'rising' | 'idle' | 'popping' | 'retracting'

export interface Balloon {
  id: number
  holeIndex: number
  color: string
  state: BalloonState
  createdAt: number
}

export interface ConfettiPiece {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  color: string
  createdAt: number
}
