import { actions, getAction } from '../data/actions'
import { getBackground } from '../data/backgrounds'
import { events, getEvent, quietQuarterEvent } from '../data/events'
import { applyEffects } from './effects'
import { nextRandom } from './rng'
import type { Effects, EventDefinition, GameState, PlayerProfile } from './types'

export const SAVE_VERSION = 1 as const

const initialRelationships = {
  zhixia: { value: 35, memories: ['大学毕业后仍保持联系。'] },
  chenyuan: { value: 20, memories: ['在一次行业分享会上认识。'] },
  zhouyuan: { value: 20, memories: ['朋友介绍的年轻创业者。'] },
}

export function createInitialState(profile: PlayerProfile, seed = Date.now() >>> 0): GameState {
  const background = getBackground(profile.backgroundId)
  const backgroundStats = profile.backgroundId === 'debt'
    ? { ability: 46, network: 25, energy: 78, stress: 42, happiness: 55 }
    : profile.backgroundId === 'comfortable'
      ? { ability: 42, network: 35, energy: 80, stress: 34, happiness: 60 }
      : { ability: 42, network: 28, energy: 82, stress: 28, happiness: 64 }

  return {
    version: SAVE_VERSION,
    phase: 'action',
    quarter: 1,
    profile,
    cash: background.initialCash,
    stats: backgroundStats,
    route: 'career',
    rank: 0,
    sideProgress: 0,
    startupProgress: 0,
    relationships: initialRelationships,
    history: [],
    seenEvents: [],
    scheduledConsequences: [],
    rngSeed: seed,
  }
}

function actionIncome(state: GameState, actionId: string): number {
  if (actionId === 'work') return 25000 + state.rank * 5500
  if (actionId === 'side') return state.sideProgress >= 40 ? 13000 + state.sideProgress * 90 : 2500
  if (actionId === 'startup' && state.startupProgress >= 60) return 20000 + state.startupProgress * 180
  return 0
}

function livingCost(state: GameState): number {
  const base = getBackground(state.profile.backgroundId).quarterlyCost
  const movedToSuburb = state.history.some((item) => item.choiceId === 'move-suburb')
  return Math.max(8000, base - (movedToSuburb ? 2500 : 0))
}

function settleBody(state: GameState): GameState {
  let next = state
  if (next.stats.stress > 80) next = applyEffects(next, { energy: -10, happiness: -5 })
  if (next.stats.energy < 25) next = applyEffects(next, { stress: 8, happiness: -3 })
  next = applyEffects(next, { stress: -3 })
  return next
}

function pickEvent(state: GameState): [EventDefinition, number] {
  const fixed = events.find((event) => event.fixedQuarter === state.quarter && !state.seenEvents.includes(event.id))
  if (fixed) return [fixed, state.rngSeed]
  const eligible = events.filter((event) => !event.once || !state.seenEvents.includes(event.id))
  if (eligible.length === 0) return [quietQuarterEvent, state.rngSeed]
  const [value, nextSeed] = nextRandom(state.rngSeed)
  return [eligible[Math.floor(value * eligible.length)] ?? quietQuarterEvent, nextSeed]
}

export function playAction(state: GameState, actionId: string): GameState {
  if (state.phase !== 'action') return state
  const action = getAction(actionId)
  if (!action) throw new Error(`Unknown action: ${actionId}`)

  const income = actionIncome(state, actionId)
  let next = applyEffects(state, { ...action.effects, cash: (action.effects.cash ?? 0) + income - livingCost(state) })
  next = settleBody(next)

  if (action.route) next = { ...next, route: action.route }
  if (actionId === 'work' && next.stats.ability >= 58 && next.rank < 3) {
    const [roll, seed] = nextRandom(next.rngSeed)
    next = { ...next, rngSeed: seed }
    if (roll < 0.38) next = applyEffects(next, { rank: 1, cash: 3500 })
  }

  const [event, seed] = pickEvent(next)
  return {
    ...next,
    phase: 'event',
    lastActionId: actionId,
    currentEventId: event.id,
    rngSeed: seed,
    quarterNotice: undefined,
    history: [...next.history, { quarter: next.quarter, actionId, summary: `选择了${action.title}` }],
  }
}

export function chooseEvent(state: GameState, choiceId: string): GameState {
  if (state.phase !== 'event' || !state.currentEventId) return state
  const event = getEvent(state.currentEventId)
  const choice = event?.choices.find((item) => item.id === choiceId)
  if (!event || !choice) throw new Error(`Unknown event choice: ${choiceId}`)

  let next = applyEffects(state, choice.effects)
  if (choice.route) next = { ...next, route: choice.route }
  if (choice.memory) {
    const relationship = next.relationships[choice.memory.npcId]
    next = {
      ...next,
      relationships: {
        ...next.relationships,
        [choice.memory.npcId]: { ...relationship, memories: [...relationship.memories, choice.memory.text].slice(-3) },
      },
    }
  }
  if (choice.schedule) {
    next = {
      ...next,
      scheduledConsequences: [
        ...next.scheduledConsequences,
        {
          id: choice.schedule.id,
          dueQuarter: next.quarter + choice.schedule.delay,
          message: choice.schedule.message,
          effects: choice.schedule.effects,
          memory: choice.schedule.memory,
        },
      ],
    }
  }

  const alreadySeen = next.seenEvents.includes(event.id)
  return {
    ...next,
    phase: 'result',
    seenEvents: event.id === quietQuarterEvent.id || alreadySeen ? next.seenEvents : [...next.seenEvents, event.id],
    history: [...next.history, { quarter: next.quarter, eventId: event.id, choiceId, summary: `${event.title}：${choice.label}` }],
    lastResult: {
      title: choice.label,
      text: choice.resultText,
      effects: choice.effects,
      consequenceHint: choice.schedule ? '这个选择会在未来产生新的影响。' : undefined,
    },
  }
}

function endingFor(state: GameState): string {
  if (state.startupProgress >= 75 && state.cash >= 65000 && state.stats.stress < 90) return 'founder'
  if (state.rank >= 2 && state.stats.ability >= 70 && state.cash >= 60000) return 'elite'
  if (state.sideProgress >= 65 && state.stats.stress < 78) return 'free'
  if (state.stats.happiness >= 68 && state.stats.stress < 70) return 'happy'
  return 'restart'
}

function applyConsequences(state: GameState, quarter: number): GameState {
  const due = state.scheduledConsequences.filter((item) => item.dueQuarter === quarter)
  if (due.length === 0) return state
  let next = state
  due.forEach((item) => {
    next = applyEffects(next, item.effects)
    if (item.memory) {
      const relationship = next.relationships[item.memory.npcId]
      next = {
        ...next,
        relationships: {
          ...next.relationships,
          [item.memory.npcId]: { ...relationship, memories: [...relationship.memories, item.memory.text].slice(-3) },
        },
      }
    }
  })
  return {
    ...next,
    scheduledConsequences: next.scheduledConsequences.filter((item) => item.dueQuarter !== quarter),
    quarterNotice: due.map((item) => item.message).join(' '),
    history: [...next.history, ...due.map((item) => ({ quarter, summary: item.message }))],
  }
}

export function continueAfterResult(state: GameState): GameState {
  if (state.phase !== 'result') return state
  if (state.quarter >= 12) {
    return { ...state, phase: 'ending', endingId: endingFor(state), currentEventId: undefined, lastResult: undefined }
  }
  let next: GameState = {
    ...state,
    phase: 'action',
    quarter: state.quarter + 1,
    currentEventId: undefined,
    lastResult: undefined,
  }
  next = applyConsequences(next, next.quarter)
  return next
}

export const listActions = () => actions

export function summarizeEffects(effects: Effects): string[] {
  const labels: Record<string, string> = { cash: '现金', ability: '能力', network: '人脉', energy: '精力', stress: '压力', happiness: '幸福', rank: '职级', sideProgress: '副业', startupProgress: '创业', zhixia: '知夏关系', chenyuan: '陈远关系', zhouyuan: '予安关系' }
  return Object.entries(effects).filter(([, value]) => value !== 0).map(([key, value]) => `${labels[key] ?? key} ${value! > 0 ? '+' : ''}${value}`)
}
