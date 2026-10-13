import type { EndingDefinition } from '../engine/types'

export const endings: EndingDefinition[] = [
  { id: 'elite', name: '都市精英', kicker: '你把专业变成了底气', description: '你没有追逐每一次风口，而是把一件事做得越来越好。城市终于有了属于你的位置。', accent: '#6C9BCF' },
  { id: 'founder', name: '创业新贵', kicker: '你把不确定变成了作品', description: '这条路更累，也更像你。你学会了在冒险和责任之间，为自己的选择签名。', accent: '#FF9F6B' },
  { id: 'free', name: '自由人生', kicker: '工作只是生活的一部分', description: '你建立了不止一种收入，也保留了对生活的好奇。自由不是逃离，而是拥有选择。', accent: '#7FCFAF' },
  { id: 'happy', name: '平凡幸福', kicker: '你没有错过真正重要的事', description: '存款不是最多，头衔也不是最高，但你依然喜欢醒来的每一个清晨。', accent: '#F2B86B' },
  { id: 'restart', name: '人生重启', kicker: '暂停不等于失败', description: '三年里你走过弯路，也重新认识了自己。下一次选择，会从这段经历开始。', accent: '#F28B9B' },
]

export const getEnding = (id?: string) => endings.find((ending) => ending.id === id) ?? endings[4]
