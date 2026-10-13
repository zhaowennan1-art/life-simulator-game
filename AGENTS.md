# 项目：人生无限可能（Life Simulator）

## 技术栈

- Vite + React + TypeScript + Tailwind CSS
- Vitest
- 无后端；存档使用 localStorage

## 架构规则

1. `src/engine` 是纯逻辑，不得引用 React 或浏览器 API。
2. 所有数值变化必须通过 `applyEffects()`；除现金外，属性限制在 0-100。
3. 人物、行动、事件和结局使用 `src/data` 中的配置，不在界面里硬编码规则。
4. 随机数必须使用带种子的 PRNG，相同种子产生相同结果。
5. 第一版不调用任何付费 AI API，前端不得出现 API Key。
6. 手机竖屏优先，同时保证平板与电脑功能一致。
7. 不修改仓库外的 VoltCare、LeadPilot、AI Education Agent Hub 等项目。

## 视觉规则

- 明亮、温暖、精致的现代都市风格。
- 禁止恐怖、阴暗、血腥和惊吓元素。
- 主要触控目标不小于 44px；360px 宽度不得横向滚动。

## 工作方式

- 第一阶段完成后暂停，等待试玩反馈。
- 新依赖必须有明确用途。
- 修改规则时同步补充或更新测试。
