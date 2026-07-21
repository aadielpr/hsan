import { useNavigate } from '@solidjs/router'

import { games } from '../games/registry'

export default function Lobby() {
  const navigate = useNavigate()

  return (
    <div class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-sky-200 to-cyan-50 p-6">
      <h1 class="mb-8 text-4xl font-extrabold text-slate-700">Play a game</h1>

      <div class="grid w-full max-w-2xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <button
            type="button"
            class="flex aspect-square flex-col items-center justify-center rounded-[32px] bg-white shadow-lg active:scale-95"
            style={{ 'background-color': game.color }}
            onPointerDown={() => navigate(game.route)}
          >
            <span class="text-7xl">{game.emoji}</span>
            <span class="mt-4 text-2xl font-bold text-white">{game.title}</span>
          </button>
        ))}

        <button
          type="button"
          class="flex aspect-square flex-col items-center justify-center rounded-[32px] bg-amber-400 opacity-60 shadow-lg"
        >
          <span class="text-7xl">🐹</span>
          <span class="mt-4 text-2xl font-bold text-white">Moles</span>
        </button>

        <button
          type="button"
          class="flex aspect-square flex-col items-center justify-center rounded-[32px] bg-slate-300 shadow-lg"
        >
          <span class="text-7xl">✨</span>
          <span class="mt-4 text-2xl font-bold text-white">Coming soon</span>
        </button>
      </div>
    </div>
  )
}
