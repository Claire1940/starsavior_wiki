# Star Savior 首页重构文档 Part 7

> 游戏主题: Star Savior
> 域名: starsavior.wiki
> 目标页面: `src/app/[locale]/page.tsx`
> 文案来源: `00基础信息.md`、`00首页信息-4.md`

---

## 本次范围

本次继续在现有 Star Savior 首页基础上，完成 `00首页信息-4.md` 的 4 个模块，并将其升级为结构化展示，不影响已上线模块和广告区。

涉及模块:

1. `Star Savior Boss Guide`
2. `Star Savior Hard Mode Guide`
3. `Star Savior PvP Guide`
4. `Star Savior Resource Management`

---

## 目标

1. 保持现有首页视觉语言一致，沿用主题色变量与统一卡片系统。
2. 只在现有 `page.tsx` 上增量扩展，不新建页面文件。
3. 模块标题维持 `Star Savior + xxx` 的 SEO 形式。
4. 仅更新英文翻译数据和首页组件，不改其它语言文件。
5. 卡片图标统一使用 `lucide-react`，同一模块的卡片图标不重复。

---

## 结构化设计方案

### 1. Star Savior Boss Guide

- 展示形式: `bossCardsWithMechanicTags`
- 目标: 以“队伍骨架 -> 机制节奏 -> 爆发窗口”输出可执行的 Boss 处理路线。
- 页面结构:
  - 左侧 3 张机制卡（队伍骨架、Break 窗口、常见失误）
  - 右侧 2 个标签区块（推荐早期角色、对策速查）
- 重点信息:
  - 推荐 1 坦克 + 1 治疗/辅助 + 1 群攻 + 1 单体
  - Break 窗口约两回合，爆发技能应在窗口内交付
  - 常见问题来自提前交大招、Nova Burst 时机不准、忽视行动条

### 2. Star Savior Hard Mode Guide

- 展示形式: `checklistWithTeamCards`
- 目标: 用“进场检查 + 阵容模板”减少 Hard 模式的准备失误。
- 页面结构:
  - 顶部准备清单
  - 下方 2 张队伍模板卡（Boss 击杀模板、速度推进模板）
  - 侧栏展示角色专属护符方向
- 重点信息:
  - Resonance Stage 8 为入门线，Stage 9 更稳
  - Mainstream Stage 14 之后优先推进 T2 装备路径
  - DPS 偏向攻击属性护符，坦辅偏向生命属性护符

### 3. Star Savior PvP Guide

- 展示形式: `dualColumnLineups`
- 目标: 把 PvP 进攻与防守路线拆开，直观对比阵容意图和收益节奏。
- 页面结构:
  - 左列 Offense 阵容与执行要点
  - 右列 Defense 阵容与防守逻辑
  - 底部奖励与赛季收益摘要
- 重点信息:
  - PvP 胜负更依赖速度、行动条控制和爆发窗口管理
  - 常用结构是 2 输出 + 1 前排 + 1 辅助/功能位
  - 赛季奖励常见为货币、养成材料、外观道具

### 4. Star Savior Resource Management

- 展示形式: `priorityTableWithDoDontCards`
- 目标: 把日常资源投入顺序做成可直接执行的优先级表和 Do/Don’t 卡。
- 页面结构:
  - 左侧资源优先级表
  - 右侧 Do / Don’t 双卡
  - 底部事件商店购买优先级提示
- 重点信息:
  - 资源先集中主队 4-6 人，减少无效分散
  - 体力优先主线与高价值活动本，再补瓶颈资源本
  - 高价值商店项目优先兑换抽卡券、稀有强化石、高阶装备

---

## 数据结构方案

本次新增并使用以下 `displayType`:

- `bossCardsWithMechanicTags`
- `checklistWithTeamCards`
- `dualColumnLineups`
- `priorityTableWithDoDontCards`

每个模块将提供结构化字段（如 `mechanicCards`、`prepChecklist`、`lineupColumns`、`priorityRows`、`doList`、`dontList`），避免继续堆叠通用 `cards` 造成信息密度不足。

---

## 执行原则

1. 先文档、后代码，按既有工程规范实施。
2. 仅修改 `src/locales/en.json` 与 `src/app/[locale]/page.tsx`，并保留广告组件与现有模块主框架。
3. 使用全局主题变量控制颜色，不写死主题色。
4. 渲染逻辑按 `displayType` 分支扩展，保证旧模块不回归。
5. 完成后执行 dev、curl、typecheck、lint、build、git、gh、redeploy 全链路验证。

---

## 实施结论

本次采用“扩展现有结构化渲染器 + 更新末尾四个模块数据”的方案，能在不破坏已完成首页模块的前提下，把 Part 7 信息完整落地，并保持视觉一致性和后续可扩展性。
