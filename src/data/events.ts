import type { EventDefinition } from '../engine/types'

export const events: EventDefinition[] = [
  {
    id: 'three-messages',
    title: '手机同时亮了三下',
    text: '大厂项目组发来面试邀请，亲戚转来一份稳定岗位信息，大学同学则把你拉进了创业群。城市没有标准答案，但你必须先迈出一步。',
    fixedQuarter: 1,
    once: true,
    weight: 1,
    choices: [
      { id: 'take-career', label: '接下职场面试', hint: '现金与压力上升', effects: { cash: 6000, network: 3, stress: 6 }, route: 'career', resultText: '你换上最合身的衣服，走进写字楼。至少从今天起，你有了一条清晰的路。', memory: { npcId: 'chenyuan', text: '陈远记得你认真准备了第一次面试。' } },
      { id: 'learn-first', label: '先补上能力短板', hint: '能力明显提升', effects: { cash: -2000, ability: 8, happiness: 2 }, resultText: '你没有急着答应任何人。新的课程表贴上墙，焦虑第一次变成了可以完成的任务。' },
      { id: 'join-startup', label: '去创业群看看', hint: '高风险的新可能', effects: { network: 5, startupProgress: 12, stress: 5 }, route: 'startup', resultText: '你推开共享办公室的门。白板上只有潦草的想法，但每个人眼里都有光。', memory: { npcId: 'zhouyuan', text: '周予安记得你最早加入了创业讨论。' } },
    ],
  },
  {
    id: 'rent-rise',
    title: '房东发来一条长消息',
    text: '房租要涨了。窗外晚高峰还在继续，你第一次认真计算：留在市中心的便利，究竟值多少钱？',
    fixedQuarter: 2,
    once: true,
    weight: 1,
    choices: [
      { id: 'stay-center', label: '留下，接受涨租', hint: '现金下降 · 幸福上升', effects: { cash: -3000, happiness: 3 }, resultText: '你决定为熟悉的生活多付一点。清晨买咖啡的店员，终于记住了你的名字。' },
      { id: 'move-suburb', label: '搬去更远的地方', hint: '省钱 · 消耗精力', effects: { cash: 2500, energy: -7, stress: -2 }, resultText: '纸箱堆满新房间。通勤更长了，但阳台上真的能看见晚霞。' },
      { id: 'ask-for-help', label: '找朋友一起合租', hint: '人脉换生活空间', effects: { cash: 1200, network: 5, happiness: 2 }, resultText: '一顿火锅之后，你们把合租规则写了满满一页。生活没有变简单，却多了可以商量的人。', memory: { npcId: 'zhixia', text: '林知夏帮你一起寻找了更合适的住处。' } },
    ],
  },
  {
    id: 'zhixia-invitation',
    title: '林知夏的周末邀约',
    text: '林知夏正在筹备一场年轻创作者市集。她问你愿不愿意来帮忙，也许能认识一些有趣的人。你的待办列表已经很长了。',
    fixedQuarter: 3,
    once: true,
    weight: 1,
    choices: [
      { id: 'help-zhixia', label: '认真帮她完成市集', hint: '消耗精力 · 留下长期回响', effects: { energy: -11, network: 7, zhixia: 15 }, resultText: '收摊时已经很晚。林知夏递给你一杯温水，说以后有合适的机会，一定第一个想到你。', memory: { npcId: 'zhixia', text: '你在最忙的时候陪她办完了创作者市集。' }, schedule: { delay: 4, id: 'zhixia-return', message: '林知夏兑现了约定，为你介绍了一个关键合作机会。', effects: { cash: 12000, network: 8, happiness: 5, zhixia: 5 }, memory: { npcId: 'zhixia', text: '她把一个重要合作机会介绍给了你。' } } },
      { id: 'visit-market', label: '只去逛一小时', hint: '轻松社交 · 保留精力', effects: { cash: -800, energy: -3, network: 4, happiness: 7, zhixia: 7 }, resultText: '你没有承担所有事情，只带着一束花出现。短短一小时，也足够让关系继续生长。', memory: { npcId: 'zhixia', text: '你抽空去支持了她的创作者市集。' } },
      { id: 'decline-invite', label: '婉拒，留时间给自己', hint: '恢复精力 · 关系降温', effects: { energy: 12, stress: -5, zhixia: -7 }, resultText: '你关掉手机，睡了一个没有闹钟的午觉。拒绝别人有点难，但你确实需要喘息。' },
    ],
  },
]

export const quietQuarterEvent: EventDefinition = {
  id: 'quiet-quarter',
  title: '城市普通的一天',
  text: '不是每个季度都有巨大的转折。更多时候，人生在通勤、晚饭和一个个小决定里慢慢改变。',
  weight: 1,
  choices: [
    { id: 'notice-progress', label: '记下今天的进步', hint: '能力与幸福小幅提升', effects: { ability: 2, happiness: 2 }, resultText: '你翻了翻这一季的记录，发现自己已经比出发时走远了很多。' },
    { id: 'call-friend', label: '给朋友打个电话', hint: '关系与心情回暖', effects: { network: 2, happiness: 4, stress: -2 }, resultText: '电话没有解决所有问题，但熟悉的声音让这座城市没那么大了。' },
  ],
}

export const getEvent = (id: string) => [...events, quietQuarterEvent].find((event) => event.id === id)
