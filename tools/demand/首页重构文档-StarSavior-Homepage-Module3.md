# Star Savior 首页重构文档 Part 6

> 游戏主题: Star Savior
> 域名: starsavior.wiki
> 目标页面: `src/app/[locale]/page.tsx`
> 文案来源: `00基础信息.md`、`00首页信息-3.md`

---

## 本次范围

本次继续在现有 Star Savior 首页基础上，完成 `00首页信息-3.md` 的 5 个模块，并把它们从普通信息卡升级为更清晰的结构化展示。

涉及模块:

1. `Star Savior 7-Day Progression`
2. `Star Savior Gacha Guide`
3. `Star Savior Character List`
4. `Star Savior Journey Training Guide`
5. `Star Savior Boss Guide`

---

## 目标

1. 保持现有首页视觉语言不变，继续沿用主题色变量、玻璃卡片和深色氛围。
2. 不改动 Hero、PV、广告、FAQ、CTA、Footer 和既有模块顺序。
3. 只在现有 `page.tsx` 上增量扩展，不新建简化版页面。
4. 模块标题继续采用 `Star Savior + xxx` 的 SEO 形式。
5. 所有新增英文文案都写入 `src/locales/en.json`，不改其他语言文件。

---

## 结构化设计方案

### 1. Star Savior 7-Day Progression

- 展示形式: `timeline_cards`
- 目标: 把“第一周路线”做成连续的时间线，而不是分散的提示卡。
- 页面结构:
  - 左侧 4 段时间线卡片，覆盖 Day 1、Day 2-3、Day 4-5、Day 6-7
  - 右侧展示核心队伍规则和资源纪律
- 重点信息:
  - 先推主线和解锁系统
  - 建 4-5 人核心阵容
  - 中期开始整理装备和关键技能
  - 后半周交替 farming 与推关，并规划抽卡货币

### 2. Star Savior Gacha Guide

- 展示形式: `accordion_compare_table`
- 目标: 把角色池与 Arcana 池的差异、基础概率、mileage 规则放到统一对比视图里。
- 页面结构:
  - 上方 2 张对比卡，分别讲 Character Banner / Arcana Banner
  - 下方 1 个规则表，集中说明 SSR rate、featured rate、Light/Dark、mileage、exchange
  - 侧边补充新手抽卡纪律
- 重点信息:
  - SSR 基础概率都是 4%
  - featured 为 2%，Light / Dark featured 为 1%
  - 没有 50/50，也没有 rate-up pity 直接保底 featured
  - 每抽给 1 mileage，200 mileage 可兑换 featured
  - mileage 不过期，可长期存

### 3. Star Savior Character List

- 展示形式: `database_grid_filters`
- 目标: 强化“数据库入口”感，而不是只列几个筛选词。
- 页面结构:
  - 上方 3 组筛选卡: rarity / role / element
  - 下方样例角色网格，展示名字、定位与检索价值
  - 旁边补充数据库用途说明
- 重点信息:
  - rarity: SR / SSR
  - role: Defender / Striker / Ranger / Caster / Supporter / Assassin
  - element: Sun / Moon / Star / Order / Chaos
  - 数据库围绕 KR / JP 当前角色池
  - 样例角色包含 Annah、Asherah、Bell Rhys、Elisa、Frey、Lacy、Luna、Muriel、Serpang、Tanya、Trish

### 4. Star Savior Journey Training Guide

- 展示形式: `step_diagram_checklist`
- 目标: 让 Journey 的“回合流程 + 长线收益”一眼能读懂。
- 页面结构:
  - 左侧 4 步流程卡，串起 training、requests、rest、archive
  - 右侧 2 张辅助卡，分别讲 Hard 入口和训练检查清单
- 重点信息:
  - Journey 由 training / requests / rest 组成
  - 每轮产出 Stella Archive，作为角色长期成长记录
  - Hard 建议至少 Resonance 8，较稳是 Resonance 9
  - 同属性 Arcana 堆叠可冲 STR 1250 或 HP 1250
  - Hard 重点看 STR / HP / Endurance，并尽量保持 BEST condition

### 5. Star Savior Boss Guide

- 展示形式: `boss_mechanics_cards`
- 目标: 把 Boss 战思路做成“队伍骨架 -> 行动顺序 -> 爆发窗口”的简洁机制板。
- 页面结构:
  - 左侧 3 张机制卡，讲标准队伍、出手顺序、Break 窗口
  - 右侧 2 张辅助卡，讲元素克制循环与爆发时机
- 重点信息:
  - 标准配置是 tank + healer/support + AoE DPS + single-target DPS
  - 速度与出手顺序很关键，护盾和 debuff 要先落地
  - Boss 有 break gauge，进入 Break 后约有两回合输出窗口
  - Ult 与 Nova Burst 应该留到 Break 窗口
  - 元素克制为 Sun > Moon > Star > Sun，另有 Order / Chaos 对位

---

## 数据结构方案

在不影响前面模块的前提下，本次为 5 个模块新增以下结构:

- `timeline`
- `sidePanels`
- `compareCards`
- `factRows`
- `filterGroups`
- `sampleRoster`
- `steps`
- `mechanics`

保留原有 `cards + tags + cta` 兼容逻辑，避免影响其他模块。

---

## 执行原则

1. 先写文档，再更新 `en.json` 数据。
2. 再扩展 `page.tsx` 的 `renderModuleContent`，按 `displayType` 分发渲染。
3. 所有颜色继续走全局 CSS 变量，不在组件里写死颜色值。
4. 图标继续使用 `lucide-react`，且同一模块内的卡片图标不重复。
5. 完成后执行本地运行、路由检查、类型检查、lint、build、git 提交推送、Actions 检查和重部署。

---

## 实施结论

本次采用“继续扩充已有首页结构化模块能力”的方案最稳:

- 不破坏前 16 个模块和广告位布局
- 能把 Part 6 的信息密度明显拉开
- 后续如果还有新的首页模块，也可以继续沿用 `displayType + data` 的方式增量扩展
