import { useMemo, useState } from 'react'
import { CharacterArt } from '../components/CharacterArt'
import { backgrounds } from '../data/backgrounds'
import { characters, getCharacter } from '../data/characters'
import { goals } from '../data/goals'
import type { BackgroundId, CharacterId, GoalId, PlayerProfile } from '../engine/types'
import { formatCash } from '../lib'

interface CharacterSetupProps {
  onBack: () => void
  onComplete: (profile: PlayerProfile) => void
}

export function CharacterSetup({ onBack, onComplete }: CharacterSetupProps) {
  const [step, setStep] = useState(1)
  const [nickname, setNickname] = useState('')
  const [characterId, setCharacterId] = useState<CharacterId>('f01')
  const [backgroundId, setBackgroundId] = useState<BackgroundId>('ordinary')
  const [goalId, setGoalId] = useState<GoalId>('happiness')
  const [previewOpen, setPreviewOpen] = useState(false)
  const selectedCharacter = useMemo(() => getCharacter(characterId), [characterId])

  const finish = () => onComplete({
    nickname: nickname.trim() || selectedCharacter.name,
    characterId,
    backgroundId,
    goalId,
  })

  return (
    <main className="setup-screen min-h-dvh">
      <header className="setup-header">
        <button className="icon-button" onClick={step === 1 ? onBack : () => setStep(step - 1)} aria-label="返回">←</button>
        <div className="setup-title"><span>人生无限可能</span><small>创建你的角色</small></div>
        <div className="step-count">0{step}<span>/03</span></div>
      </header>

      <div className="step-progress" aria-label={`第 ${step} 步，共 3 步`}><span style={{ width: `${step * 33.333}%` }} /></div>

      <section className="setup-layout">
        <aside className="setup-preview">
          <div className={`preview-backdrop bg-gradient-to-br ${selectedCharacter.gradient}`} />
          <CharacterArt image={selectedCharacter.image} name={selectedCharacter.name} className="preview-character" eager />
          <div className="preview-caption">
            <span>你的主角</span>
            <h2>{nickname.trim() || selectedCharacter.name}</h2>
            <p>{selectedCharacter.archetype} · {selectedCharacter.tagline}</p>
          </div>
        </aside>

        <div className="setup-panel">
          {step === 1 && (
            <div className="setup-step">
              <div className="section-heading"><span>01</span><div><h1>选择你想成为的样子</h1><p>外观不会影响能力或成功率，只决定这段人生如何被你看见。</p></div></div>
              <label className="nickname-field">怎么称呼你？<input value={nickname} maxLength={10} onChange={(event) => setNickname(event.target.value)} placeholder="输入昵称（可选）" /></label>
              <div className="character-grid">
                {characters.map((character) => (
                  <button key={character.id} className={`character-card ${character.id === characterId ? 'selected' : ''}`} onClick={() => setCharacterId(character.id)}>
                    <div className={`character-thumb bg-gradient-to-br ${character.gradient}`}><CharacterArt image={character.image} name={character.name} /></div>
                    <span>{character.name}</span><small>{character.archetype}</small>
                  </button>
                ))}
              </div>
              <button className="preview-link" onClick={() => setPreviewOpen(true)}>预览人物大图 ↗</button>
            </div>
          )}

          {step === 2 && (
            <div className="setup-step">
              <div className="section-heading"><span>02</span><div><h1>选择你的家庭背景</h1><p>每一种起点都有资源，也有只属于它的限制。</p></div></div>
              <div className="choice-stack">
                {backgrounds.map((background) => (
                  <button key={background.id} className={`wide-choice ${background.id === backgroundId ? 'selected' : ''}`} onClick={() => setBackgroundId(background.id)}>
                    <div className="choice-radio" /><div><span className="choice-tag">{background.tag}</span><h3>{background.title}<small>{background.subtitle}</small></h3><p>{background.description}</p></div><strong>{formatCash(background.initialCash)}<small>初始现金</small></strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="setup-step">
              <div className="section-heading"><span>03</span><div><h1>此刻，你最想要什么？</h1><p>目标不会限制路线，但会影响最后的人生评价。</p></div></div>
              <div className="goal-grid">
                {goals.map((goal) => (
                  <button key={goal.id} className={`goal-card ${goal.id === goalId ? 'selected' : ''}`} onClick={() => setGoalId(goal.id)}>
                    <span className="goal-symbol">{goal.symbol}</span><h3>{goal.title}</h3><p>{goal.description}</p><i>{goal.id === goalId ? '已选择' : '选择目标'}</i>
                  </button>
                ))}
              </div>
              <div className="start-summary"><span>你的开局</span><p><b>{nickname.trim() || selectedCharacter.name}</b> · {backgrounds.find((item) => item.id === backgroundId)?.title} · 想要{goals.find((item) => item.id === goalId)?.title}</p></div>
            </div>
          )}

          <div className="setup-footer">
            <p>{step === 3 ? '准备好了吗？城市正在等你。' : '你的选择稍后仍可以重新开始。'}</p>
            <button className="primary-button" onClick={step === 3 ? finish : () => setStep(step + 1)}><span>{step === 3 ? '走进这座城市' : '继续'}</span><b>→</b></button>
          </div>
        </div>
      </section>

      {previewOpen && (
        <div className="preview-modal" role="dialog" aria-modal="true" aria-label="人物大图预览" onClick={() => setPreviewOpen(false)}>
          <button className="modal-close" aria-label="关闭">×</button>
          <div className={`modal-art bg-gradient-to-br ${selectedCharacter.gradient}`} onClick={(event) => event.stopPropagation()}>
            <CharacterArt image={selectedCharacter.image} name={selectedCharacter.name} />
            <div><span>{selectedCharacter.archetype}</span><h2>{selectedCharacter.name}</h2><p>{selectedCharacter.tagline}</p></div>
          </div>
        </div>
      )}
    </main>
  )
}
