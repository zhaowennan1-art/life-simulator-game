import { createInitialState } from '../src/engine/game'
import { clearGame, loadGame, SAVE_KEY, saveGame } from '../src/storage/save'

describe('local save', () => {
  beforeEach(() => window.localStorage.clear())

  it('saves and restores the current game', () => {
    const state = createInitialState({ nickname: '小夏', characterId: 'f03', backgroundId: 'debt', goalId: 'career' }, 99)
    saveGame(state)
    expect(loadGame()).toEqual(state)
  })

  it('returns null for broken or incompatible data', () => {
    window.localStorage.setItem(SAVE_KEY, '{broken')
    expect(loadGame()).toBeNull()
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 999 }))
    expect(loadGame()).toBeNull()
  })

  it('clears the save without affecting other local data', () => {
    window.localStorage.setItem('unrelated', 'keep')
    saveGame(createInitialState({ nickname: '小夏', characterId: 'f03', backgroundId: 'ordinary', goalId: 'wealth' }))
    clearGame()
    expect(loadGame()).toBeNull()
    expect(window.localStorage.getItem('unrelated')).toBe('keep')
  })
})
