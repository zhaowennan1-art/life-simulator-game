import type { BackgroundId } from '../engine/types'

export interface BackgroundDefinition {
  id: BackgroundId
  title: string
  subtitle: string
  description: string
  initialCash: number
  quarterlyCost: number
  tag: string
}

export const backgrounds: BackgroundDefinition[] = [
  { id: 'ordinary', title: '普通家庭', subtitle: '稳稳起步', description: '没有额外托举，也没有沉重负担。每一步都由你自己决定。', initialCash: 20000, quarterlyCost: 12000, tag: '均衡' },
  { id: 'comfortable', title: '经济宽裕', subtitle: '资源与期待', description: '起点更从容，但家人会在关键节点提出自己的期待。', initialCash: 80000, quarterlyCost: 18000, tag: '高起点 · 高期待' },
  { id: 'debt', title: '负债家庭', subtitle: '逆风前行', description: '现金不多，每季还有债务支出，但你更懂得抓住机会。', initialCash: 5000, quarterlyCost: 16000, tag: '高压力 · 高韧性' },
]

export const getBackground = (id: BackgroundId) => backgrounds.find((item) => item.id === id) ?? backgrounds[0]
