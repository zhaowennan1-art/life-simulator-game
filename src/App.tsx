import { useEffect, useState } from 'react'
import type { GameState, PlayerProfile } from './engine/types'
import { createInitialState } from './engine/game'
import { clearGame, loadGame, saveGame } from './storage/save'
import { HomeScreen } from './ui/HomeScreen'
import { CharacterSetup } from './ui/CharacterSetup'
import { GameScreen } from './ui/GameScreen'

type AppView = 'home' | 'setup' | 'game'

export default function App() {
  const [saved, setSaved] = useState<GameState | null>(() => loadGame())
  const [game, setGame] = useState<GameState | null>(null)
  const [view, setView] = useState<AppView>('home')

  useEffect(() => {
    if (!game) return
    saveGame(game)
    setSaved(game)
  }, [game])

  const startGame = (profile: PlayerProfile) => {
    const next = createInitialState(profile)
    setGame(next)
    setView('game')
  }

  const restart = () => {
    clearGame()
    setSaved(null)
    setGame(null)
    setView('setup')
  }

  if (view === 'setup') return <CharacterSetup onBack={() => setView('home')} onComplete={startGame} />
  if (view === 'game' && game) return <GameScreen state={game} onChange={setGame} onExit={() => setView('home')} onRestart={restart} />

  return (
    <HomeScreen
      hasSave={Boolean(saved)}
      savedQuarter={saved?.quarter}
      onNew={() => setView('setup')}
      onContinue={() => {
        if (!saved) return
        setGame(saved)
        setView('game')
      }}
    />
  )
}
