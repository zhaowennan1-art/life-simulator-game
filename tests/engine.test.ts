import { applyEffects } from '../src/engine/effects'
import { chooseEvent, continueAfterResult, createInitialState, playAction } from '../src/engine/game'
import type { GameState, PlayerProfile } from '../src/engine/types'

const profile: PlayerProfile = {
  nickname: '测试玩家',
  characterId: 'f01',
  backgroundId: 'ordinary',
  goalId: 'happiness',
}

const finishQuarter = (state: GameState, actionId: string, choiceId: string) => {
  const afterAction = playAction(state, actionId)
  const afterChoice = chooseEvent(afterAction, choiceId)
  return continueAfterResult(afterChoice)
}

describe('game engine', () => {
  it('clamps all visible stats to 0-100 while leaving cash unbounded', () => {
    const state = createInitialState(profile, 42)
    const next = applyEffects(state, { ability: 1000, energy: -1000, cash: -999999 })
    expect(next.stats.ability).toBe(100)
    expect(next.stats.energy).toBe(0)
    expect(next.cash).toBe(state.cash - 999999)
  })

  it('runs a complete action-event-result-quarter flow', () => {
    const state = createInitialState(profile, 42)
    const afterAction = playAction(state, 'work')
    expect(afterAction.phase).toBe('event')
    expect(afterAction.currentEventId).toBe('three-messages')

    const afterChoice = chooseEvent(afterAction, 'take-career')
    expect(afterChoice.phase).toBe('result')
    expect(afterChoice.history.some((item) => item.choiceId === 'take-career')).toBe(true)

    const nextQuarter = continueAfterResult(afterChoice)
    expect(nextQuarter.quarter).toBe(2)
    expect(nextQuarter.phase).toBe('action')
  })

  it('replays the same fixed event for the same starting state', () => {
    const first = playAction(createInitialState(profile, 123), 'learn')
    const second = playAction(createInitialState(profile, 123), 'learn')
    expect(first.currentEventId).toBe(second.currentEventId)
    expect(first.rngSeed).toBe(second.rngSeed)
    expect(first.stats).toEqual(second.stats)
  })

  it('applies a delayed consequence in quarter seven', () => {
    let state = createInitialState(profile, 7)
    state = finishQuarter(state, 'work', 'take-career')
    state = finishQuarter(state, 'rest', 'stay-center')
    state = finishQuarter(state, 'network', 'help-zhixia')
    expect(state.scheduledConsequences[0]?.dueQuarter).toBe(7)
    state = finishQuarter(state, 'rest', 'notice-progress')
    state = finishQuarter(state, 'rest', 'notice-progress')
    state = finishQuarter(state, 'rest', 'notice-progress')
    expect(state.quarter).toBe(7)
    expect(state.quarterNotice).toContain('林知夏兑现了约定')
    expect(state.scheduledConsequences).toHaveLength(0)
  })
})
