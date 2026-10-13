import type { GoalId } from '../engine/types'

export const goals: { id: GoalId; title: string; description: string; symbol: string }[] = [
  { id: 'wealth', title: '财富自由', description: '建立更大的选择空间，不再被账单定义人生。', symbol: '¥' },
  { id: 'career', title: '事业成功', description: '持续成长，在擅长的领域留下自己的名字。', symbol: '↗' },
  { id: 'happiness', title: '幸福生活', description: '珍惜关系与健康，也不放弃喜欢的生活。', symbol: '♡' },
]

export const getGoal = (id: GoalId) => goals.find((goal) => goal.id === id) ?? goals[0]
