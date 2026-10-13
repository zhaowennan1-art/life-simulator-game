export type Route = 'career' | 'side' | 'startup'
export type GamePhase = 'action' | 'event' | 'result' | 'ending'
export type GoalId = 'wealth' | 'career' | 'happiness'
export type BackgroundId = 'ordinary' | 'comfortable' | 'debt'
export type CharacterId = 'f01' | 'f02' | 'f03' | 'm01' | 'm02' | 'm03'
export type NpcId = 'zhixia' | 'chenyuan' | 'zhouyuan'

export interface Stats {
  ability: number
  network: number
  energy: number
  stress: number
  happiness: number
}

export interface PlayerProfile {
  nickname: string
  characterId: CharacterId
  backgroundId: BackgroundId
  goalId: GoalId
}

export interface NpcRelationship {
  value: number
  memories: string[]
}

export type Relationships = Record<NpcId, NpcRelationship>

export interface HistoryEntry {
  quarter: number
  actionId?: string
  eventId?: string
  choiceId?: string
  summary: string
}

export interface ScheduledConsequence {
  id: string
  dueQuarter: number
  message: string
  effects: Effects
  memory?: { npcId: NpcId; text: string }
}

export interface ResultSummary {
  title: string
  text: string
  effects: Effects
  consequenceHint?: string
}

export interface GameState {
  version: 1
  phase: GamePhase
  quarter: number
  profile: PlayerProfile
  cash: number
  stats: Stats
  route: Route
  rank: number
  sideProgress: number
  startupProgress: number
  relationships: Relationships
  history: HistoryEntry[]
  seenEvents: string[]
  scheduledConsequences: ScheduledConsequence[]
  currentEventId?: string
  lastActionId?: string
  lastResult?: ResultSummary
  quarterNotice?: string
  endingId?: string
  rngSeed: number
}

export type EffectKey = keyof Stats | 'cash' | 'rank' | 'sideProgress' | 'startupProgress' | NpcId
export type Effects = Partial<Record<EffectKey, number>>

export interface ActionDefinition {
  id: string
  title: string
  eyebrow: string
  description: string
  effects: Effects
  route?: Route
  scene: 'home' | 'office' | 'cafe' | 'startup' | 'city'
}

export interface EventChoice {
  id: string
  label: string
  hint: string
  effects: Effects
  resultText: string
  route?: Route
  schedule?: {
    delay: number
    id: string
    message: string
    effects: Effects
    memory?: { npcId: NpcId; text: string }
  }
  memory?: { npcId: NpcId; text: string }
}

export interface EventDefinition {
  id: string
  title: string
  text: string
  fixedQuarter?: number
  once?: boolean
  weight: number
  choices: EventChoice[]
}

export interface EndingDefinition {
  id: string
  name: string
  kicker: string
  description: string
  accent: string
}
