import { CharacterArt } from '../components/CharacterArt'
import { getCharacter } from '../data/characters'
import { assetUrl } from '../lib'

interface HomeScreenProps {
  hasSave: boolean
  savedQuarter?: number
  onNew: () => void
  onContinue: () => void
}

export function HomeScreen({ hasSave, savedQuarter, onNew, onContinue }: HomeScreenProps) {
  const hero = getCharacter('f02')

  return (
    <main className="home-screen min-h-dvh">
      <img className="home-bg" src={assetUrl('assets/scenes/city.jpg')} alt="阳光下的现代都市河岸" />
      <div className="home-wash" />
      <div className="home-grain" />

      <section className="home-content">
        <div className="brand-pill"><span /> LIFE SIMULATOR · 现代都市人生模拟</div>
        <div className="home-copy">
          <p className="home-kicker">十二个季度，一次属于你的选择实验</p>
          <h1>人生<br /><em>无限可能</em></h1>
          <p className="home-subtitle">如果人生可以重来，<br className="sm:hidden" />你会怎么选？</p>
          <p className="home-description">在职业、创业、财富和关系之间做出选择。没有唯一的成功，也没有毫无意义的弯路。</p>
        </div>

        <div className="home-actions">
          <button className="primary-button" onClick={onNew}><span>开启新人生</span><b>→</b></button>
          {hasSave && (
            <button className="secondary-button" onClick={onContinue}>
              <span>继续上次人生</span><small>第 {savedQuarter} / 12 季度</small>
            </button>
          )}
        </div>

        <div className="home-meta">
          <span>无需注册</span><i /> <span>自动存档</span><i /> <span>10–20 分钟</span>
        </div>
      </section>

      <div className="home-character" aria-hidden="true">
        <div className="character-glow" />
        <CharacterArt image={hero.image} name={hero.name} className="home-character-img" eager />
        <div className="floating-note note-one"><span>03</span><p>你会选择<br /><b>稳定还是冒险？</b></p></div>
        <div className="floating-note note-two"><span>12</span><p>个季度<br /><b>改变一条人生轨迹</b></p></div>
      </div>
    </main>
  )
}
