import type { CharacterId } from '../engine/types'

export interface CharacterDefinition {
  id: CharacterId
  name: string
  archetype: string
  tagline: string
  traits: string[]
  image: string
  gradient: string
}

export const characters: CharacterDefinition[] = [
  { id: 'f01', name: '林悦', archetype: '温柔治愈系', tagline: '热爱生活，也懂得为自己留白', traits: ['艺术设计', '自由职业', '慢节奏'], image: 'assets/characters/f01.png', gradient: 'from-[#f9d6c8] to-[#f5f0d8]' },
  { id: 'f02', name: '苏然', archetype: '知性成长系', tagline: '目标清晰，愿意为成长长期投入', traits: ['研究深造', '职场精英', '自我提升'], image: 'assets/characters/f02.png', gradient: 'from-[#cfdcf4] to-[#eee7df]' },
  { id: 'f03', name: '夏宁', archetype: '活泼元气系', tagline: '对世界好奇，也敢于从零开始', traits: ['社交达人', '创意行业', '多元发展'], image: 'assets/characters/f03.png', gradient: 'from-[#f8c9bd] to-[#d8ecf7]' },
  { id: 'm01', name: '陆川', archetype: '阳光清爽系', tagline: '认真对待每一次相遇与选择', traits: ['理工背景', '稳定职场', '兴趣发展'], image: 'assets/characters/m01.png', gradient: 'from-[#cfe4f7] to-[#eef5f2]' },
  { id: 'm02', name: '顾言', archetype: '沉稳理性系', tagline: '把复杂的问题，走成清晰的路', traits: ['研究深造', '职场精英', '长期规划'], image: 'assets/characters/m02.png', gradient: 'from-[#d8d8e7] to-[#e7edf5]' },
  { id: 'm03', name: '程野', archetype: '自由探索系', tagline: '机会不是等来的，是一起创造的', traits: ['创业探索', '数码科技', '勇于挑战'], image: 'assets/characters/m03.png', gradient: 'from-[#dce9d4] to-[#f4e2c5]' },
]

export const getCharacter = (id: CharacterId) => characters.find((character) => character.id === id) ?? characters[0]
