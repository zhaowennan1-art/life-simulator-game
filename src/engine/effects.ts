import type { Effects, GameState, NpcId, Stats } from './types'

const statKeys: (keyof Stats)[] = ['ability', 'network', 'energy', 'stress', 'happiness']
const npcKeys: NpcId[] = ['zhixia', 'chenyuan', 'zhouyuan']

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

export function applyEffects(state: GameState, effects: Effects): GameState {
  const stats = { ...state.stats }
  statKeys.forEach((key) => {
    if (effects[key] !== undefined) stats[key] = clamp(stats[key] + effects[key]!)
  })

  const relationships = { ...state.relationships }
  npcKeys.forEach((key) => {
    if (effects[key] !== undefined) {
      relationships[key] = {
        ...relationships[key],
        value: clamp(relationships[key].value + effects[key]!),
      }
    }
  })

  return {
    ...state,
    stats,
    relationships,
    cash: state.cash + (effects.cash ?? 0),
    rank: clamp(state.rank + (effects.rank ?? 0), 0, 3),
    sideProgress: clamp(state.sideProgress + (effects.sideProgress ?? 0)),
    startupProgress: clamp(state.startupProgress + (effects.startupProgress ?? 0)),
  }
}
