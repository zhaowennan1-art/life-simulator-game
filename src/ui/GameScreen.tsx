import { useMemo, useState, type CSSProperties } from 'react'
import { CharacterArt } from '../components/CharacterArt'
import { StatBar } from '../components/StatBar'
import { actions, getAction } from '../data/actions'
import { getBackground } from '../data/backgrounds'
import { getCharacter } from '../data/characters'
import { getEnding } from '../data/endings'
import { getEvent } from '../data/events'
import { getGoal } from '../data/goals'
import { chooseEvent, continueAfterResult, playAction, summarizeEffects } from '../engine/game'
import type { GameState, NpcId } from '../engine/types'
import { assetUrl, formatCash, quarterLabel } from '../lib'

interface GameScreenProps {
  state: GameState
  onChange: (state: GameState) => void
  onExit: () => void
  onRestart: () => void
}

type Tab = 'life' | 'wealth' | 'relations'

const sceneForState = (state: GameState) => {
  if (state.lastActionId) return getAction(state.lastActionId)?.scene ?? 'city'
  if (state.route === 'startup') return 'startup'
  if (state.route === 'side') return 'cafe'
  return 'city'
}

const routeLabel = { career: '稳定职场', side: '斜杠副业', startup: '自主创业' }
const npcNames: Record<NpcId, { name: string; role: string; color: string }> = {
  zhixia: { name: '林知夏', role: '大学同学', color: '#F28B9B' },
  chenyuan: { name: '陈远', role: '职场前辈', color: '#6C9BCF' },
  zhouyuan: { name: '周予安', role: '创业者', color: '#FF9F6B' },
}

export function GameScreen({ state, onChange, onExit, onRestart }: GameScreenProps) {
  const [tab, setTab] = useState<Tab>('life')
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  const character = getCharacter(state.profile.characterId)
  const event = state.currentEventId ? getEvent(state.currentEventId) : undefined
  const scene = sceneForState(state)
  const ending = getEnding(state.endingId)
  const keyTimeline = useMemo(() => state.history.filter((item) => item.choiceId || (!item.eventId && !item.actionId)).slice(-4), [state.history])

  if (state.phase === 'ending') {
    return (
      <main className="ending-screen min-h-dvh" style={{ '--ending-accent': ending.accent } as CSSProperties}>
        <img className="ending-bg" src={assetUrl('assets/scenes/city.jpg')} alt="都市人生终章背景" />
        <div className="ending-wash" />
        <section className="ending-card">
          <div className="ending-copy">
            <span className="ending-overline">你的人生结局 · {state.profile.nickname}</span>
            <h1>{ending.name}</h1>
            <h2>{ending.kicker}</h2>
            <p>{ending.description}</p>
            <div className="ending-stats">
              <div><span>最终现金</span><b>{formatCash(state.cash)}</b></div>
              <div><span>人生路线</span><b>{routeLabel[state.route]}</b></div>
              <div><span>幸福感</span><b>{state.stats.happiness}</b></div>
            </div>
            <div className="timeline-card"><span>关键选择回放</span>{keyTimeline.length ? keyTimeline.map((item, index) => <p key={`${item.quarter}-${index}`}><b>Q{item.quarter}</b>{item.summary}</p>) : <p>这段人生没有留下关键记录。</p>}</div>
            <div className="ending-actions"><button className="primary-button" onClick={onRestart}><span>再来一次</span><b>↻</b></button><button className="secondary-button" onClick={onExit}>回到首页</button></div>
          </div>
          <div className="ending-art"><div className="ending-halo" /><CharacterArt image={character.image} name={character.name} eager /></div>
        </section>
      </main>
    )
  }

  return (
    <main className="game-screen min-h-dvh">
      <header className="game-header">
        <button className="game-brand" onClick={onExit}><i /> <span>人生无限可能<small>Life Simulator</small></span></button>
        <div className="quarter-progress"><div><span>{quarterLabel(state.quarter)}</span><small>第 {state.quarter} / 12 季度</small></div><div className="quarter-track"><span style={{ width: `${(state.quarter / 12) * 100}%` }} /></div></div>
        <div className="header-cash"><span>可用现金</span><strong className={state.cash < 0 ? 'negative' : ''}>{formatCash(state.cash)}</strong></div>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="游戏菜单">•••</button>
        {menuOpen && <div className="game-menu"><button onClick={onExit}>保存并回到首页</button><button onClick={onRestart}>重新开始人生</button></div>}
      </header>

      <section className="game-layout">
        <aside className="scene-panel">
          <img className="scene-image" src={assetUrl(`assets/scenes/${scene}.jpg`)} alt="当前人生场景" />
          <div className="scene-overlay" />
          <CharacterArt image={character.image} name={character.name} className="scene-character" eager />
          <div className="scene-caption"><span>{routeLabel[state.route]}</span><p>{state.quarterNotice ?? `${state.profile.nickname}站在这座城市里，下一步仍由你决定。`}</p></div>
        </aside>

        <section className="play-panel">
          <nav className="mobile-tabs" aria-label="游戏功能">
            <button className={tab === 'life' ? 'active' : ''} onClick={() => setTab('life')}>人生</button>
            <button className={tab === 'wealth' ? 'active' : ''} onClick={() => setTab('wealth')}>财富</button>
            <button className={tab === 'relations' ? 'active' : ''} onClick={() => setTab('relations')}>关系</button>
          </nav>

          {tab === 'life' && (
            <div className="action-view">
              <div className="play-heading"><div><span>QUARTER {String(state.quarter).padStart(2, '0')}</span><h1>这一季，你想把时间花在哪里？</h1><p>主要行动会消耗一个季度，并改变后续可能出现的事件。</p></div><div className="route-badge">当前路线<b>{routeLabel[state.route]}</b></div></div>
              <div className="action-grid">
                {actions.map((action, index) => (
                  <button key={action.id} className={`action-card ${selectedAction === action.id ? 'selected' : ''}`} onClick={() => setSelectedAction(action.id)}>
                    <span className="action-index">0{index + 1}</span><div><small>{action.eyebrow}</small><h3>{action.title}</h3><p>{action.description}</p></div><i>{selectedAction === action.id ? '✓' : '→'}</i>
                  </button>
                ))}
              </div>
              <button className="quarter-button" disabled={!selectedAction} onClick={() => { onChange(playAction(state, selectedAction)); setSelectedAction('') }}><span>{selectedAction ? `选择「${getAction(selectedAction)?.title}」` : '先选择一个行动'}</span><b>度过这个季度 →</b></button>
            </div>
          )}

          {tab === 'wealth' && <WealthView state={state} />}
          {tab === 'relations' && <RelationsView state={state} />}
        </section>

        <aside className="status-panel">
          <div className="profile-mini"><div className="mini-art"><CharacterArt image={character.image} name={character.name} /></div><div><small>正在生活</small><h2>{state.profile.nickname}</h2><p>{getBackground(state.profile.backgroundId).title} · {getGoal(state.profile.goalId).title}</p></div></div>
          <div className="status-heading"><span>人生状态</span><small>0–100</small></div>
          <div className="stats-list">
            <StatBar label="能力" value={state.stats.ability} color="#6C9BCF" />
            <StatBar label="人脉" value={state.stats.network} color="#FF9F6B" />
            <StatBar label="精力" value={state.stats.energy} color="#7FCFAF" />
            <StatBar label="压力" value={state.stats.stress} color="#F28B9B" />
            <StatBar label="幸福" value={state.stats.happiness} color="#F0BE5A" />
          </div>
          <div className="progress-cards"><div><span>副业进度</span><b>{state.sideProgress}%</b></div><div><span>创业进度</span><b>{state.startupProgress}%</b></div><div><span>当前职级</span><b>Lv.{state.rank}</b></div></div>
          <p className="save-note"><i>✓</i> 本季度进度会自动保存在浏览器</p>
        </aside>
      </section>

      {state.phase === 'event' && event && (
        <div className="event-layer" role="dialog" aria-modal="true" aria-label="人生事件">
          <div className="event-card">
            <div className="event-visual"><img src={assetUrl(`assets/scenes/${scene === 'office' ? 'office' : scene === 'startup' ? 'startup' : 'cafe'}.jpg`)} alt="事件场景" /><span>人生事件 · Q{state.quarter}</span></div>
            <div className="event-body"><span className="event-kicker">选择会留下痕迹</span><h2>{event.title}</h2><p>{event.text}</p><div className="event-choices">{event.choices.map((choice) => <button key={choice.id} onClick={() => onChange(chooseEvent(state, choice.id))}><div><span>{choice.label}</span><small>{choice.hint}</small></div><b>→</b></button>)}</div></div>
          </div>
        </div>
      )}

      {state.phase === 'result' && state.lastResult && (
        <div className="event-layer" role="dialog" aria-modal="true" aria-label="选择结果">
          <div className="result-card">
            <div className="result-mark">✓</div><span>选择已经发生</span><h2>{state.lastResult.title}</h2><p>{state.lastResult.text}</p>
            <div className="effect-list">{summarizeEffects(state.lastResult.effects).map((effect) => <i key={effect}>{effect}</i>)}</div>
            {state.lastResult.consequenceHint && <div className="future-hint"><b>⟲</b>{state.lastResult.consequenceHint}</div>}
            <button className="primary-button" onClick={() => onChange(continueAfterResult(state))}><span>{state.quarter >= 12 ? '查看人生结局' : '进入下一季度'}</span><b>→</b></button>
          </div>
        </div>
      )}
    </main>
  )
}

function WealthView({ state }: { state: GameState }) {
  const background = getBackground(state.profile.backgroundId)
  return <div className="detail-view"><div className="play-heading"><div><span>WEALTH</span><h1>你的财富，不只是一个数字</h1><p>首版只管理现金流，不加入股票、买房或复杂投资。</p></div></div><div className="cash-hero"><span>当前可用现金</span><strong>{formatCash(state.cash)}</strong><p>每季度基础生活成本约 {formatCash(background.quarterlyCost)}</p></div><div className="detail-grid"><div><span>稳定性</span><b>{state.cash >= background.quarterlyCost * 2 ? '有缓冲' : '需留意'}</b><p>现金可覆盖约 {Math.max(0, Math.floor(state.cash / background.quarterlyCost))} 个季度基础开支。</p></div><div><span>成长资产</span><b>{state.stats.ability + state.stats.network}</b><p>能力与人脉会共同影响机会质量。</p></div><div><span>副业价值</span><b>{state.sideProgress}%</b><p>达到 40% 后，副业现金流会明显提高。</p></div><div><span>创业价值</span><b>{state.startupProgress}%</b><p>高进度仍需要现金和精力共同支撑。</p></div></div></div>
}

function RelationsView({ state }: { state: GameState }) {
  return <div className="detail-view"><div className="play-heading"><div><span>RELATIONSHIPS</span><h1>你不是独自生活在这座城市</h1><p>关键互动会被记住，并在未来的季度产生回响。</p></div></div><div className="relations-list">{(Object.keys(npcNames) as NpcId[]).map((id) => { const npc = npcNames[id]; const relationship = state.relationships[id]; return <article key={id} className="npc-card"><div className="npc-avatar" style={{ background: `${npc.color}22`, color: npc.color }}>{npc.name.slice(0, 1)}</div><div><span>{npc.role}</span><h3>{npc.name}</h3><div className="relation-track"><i style={{ width: `${relationship.value}%`, background: npc.color }} /></div><small>关系值 {relationship.value}</small><p>{relationship.memories.at(-1)}</p></div></article> })}</div><p className="placeholder-note">NPC 独立立绘与可执行互动将在第二阶段完善；当前版本已保存关系值和三条关键记忆。</p></div>
}
