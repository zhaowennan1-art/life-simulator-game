import type { ActionDefinition } from '../engine/types'

export const actions: ActionDefinition[] = [
  { id: 'work', title: '努力工作', eyebrow: '稳定现金流', description: '专注完成重点任务，争取升职机会。', effects: { ability: 4, network: 1, energy: -14, stress: 8, happiness: -2 }, route: 'career', scene: 'office' },
  { id: 'learn', title: '学习进修', eyebrow: '投资未来', description: '花时间补上能力短板，为转型积蓄筹码。', effects: { cash: -3000, ability: 8, energy: -9, stress: 2, happiness: 3 }, scene: 'home' },
  { id: 'side', title: '经营副业', eyebrow: '打开第二曲线', description: '用下班时间验证一门小生意。', effects: { ability: 2, network: 3, energy: -18, stress: 9, happiness: 1, sideProgress: 16 }, route: 'side', scene: 'cafe' },
  { id: 'network', title: '拓展人脉', eyebrow: '与人产生连接', description: '赴约、请教，也为未来留下新的可能。', effects: { cash: -1200, network: 10, energy: -8, stress: -3, happiness: 5 }, scene: 'cafe' },
  { id: 'rest', title: '休息恢复', eyebrow: '把自己放回首位', description: '关掉提醒，好好睡一觉，找回生活感。', effects: { energy: 26, stress: -17, happiness: 9, network: -1 }, scene: 'home' },
  { id: 'startup', title: '创业投入', eyebrow: '承担风险', description: '投入现金和精力，把想法推向市场。', effects: { cash: -12000, ability: 3, network: 4, energy: -22, stress: 14, happiness: -2, startupProgress: 20 }, route: 'startup', scene: 'startup' },
]

export const getAction = (id: string) => actions.find((action) => action.id === id)
