export interface GameMeta {
  id: string
  title: string
  route: string
  emoji: string
  color: string
}

export const games: GameMeta[] = [
  {
    id: 'balloon-pop',
    title: 'Balloon Pop',
    route: '/balloon-pop',
    emoji: '🎈',
    color: '#4ECDC4',
  },
]
