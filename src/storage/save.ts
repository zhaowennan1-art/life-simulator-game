import type { GameState } from '../engine/types'

export const SAVE_KEY = 'life-simulator-game.save.v1'

export function saveGame(state: GameState): void {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state))
}

export function loadGame(): GameState | null {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw) as Partial<GameState>
    if (state.version !== 1 || !state.profile || !state.stats || typeof state.quarter !== 'number') return null
    return state as GameState
  } catch {
    return null
  }
}

export function clearGame(): void {
  window.localStorage.removeItem(SAVE_KEY)
}
