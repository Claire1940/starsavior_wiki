# Star Savior 首页重构文档 Part 5

> 游戏主题: Star Savior
> 域名: starsavior.wiki
> 目标页面: `src/app/[locale]/page.tsx`
> 文案来源: `00基础信息.md`、`00首页信息-2.md`

---

## 本次范围

本次不是重做整个首页，而是在上一步已经完成的 Star Savior 首页基础上，继续把 `00首页信息-2.md` 的 4 个模块做成更明确的“结构化内容块”，并同步更新视频下方导航的浏览价值。

涉及模块:

1. `Star Savior Arcana Tier List`
2. `Star Savior Best Teams`
3. `Star Savior Character Builds`
4. `Star Savior Gear Guide`

---

## 目标

1. 保持现有首页视觉语言不变，继续使用主题色变量和深色星海氛围。
2. 不删除广告组件，不重建简化版首页，所有改动都在现有 `page.tsx` 上完成。
3. 让这 4 个模块不再只是普通三列表，而是各自对应不同信息结构:
   - Arcana: 分层 + 职能切换
   - Teams: 阵容卡片
   - Builds: 角色卡片 + 展开详情
   - Gear: 优先级表格 + 标签说明
4. 模块标题继续满足 SEO 形式，统一采用 `Star Savior + xxx`。
5. 所有外链继续只指向外部资料，不恢复任何站内内容页入口。

---

## 视觉与交互策略

### 统一设计语言

- 外层仍然使用现有 section shell、圆角玻璃卡、柔光背景和主题色描边。
- 强调色只允许使用:
  - `hsl(var(--nav-theme))`
  - `hsl(var(--nav-theme-light))`
- 图标继续使用 `lucide-react`，避免 emoji。

### 4 个模块的节奏差异

#### 1. Arcana Tier List

- 在标题区下方增加角色职责切换条:
  - DPS
  - Tank
  - Healer
- 左侧展示共同顶级 Arcana 和次一级 Arcana。
- 右侧展示当前职责的主属性优先级与使用原则。
- 保留模块标签，突出 SSR 长线价值与角色职责差异。

#### 2. Best Teams

- 使用 4 张阵容卡，直接体现 `4-Savior formation`。
- 每张卡按 Front Line / Back Line 拆分，避免纯文本堆砌。
- 每张卡补充适用克制关系与编队说明，方便浏览时快速比较。

#### 3. Character Builds

- 使用 3 张角色构筑卡作为入口:
  - Lacy
  - Bell Rhys
  - Asherah: Waltz of Starlight
- 点击卡片后，在同模块内展开详细构筑面板。
- 展开区展示:
  - 角色定位
  - 早期 / 终盘技能目标
  - 核心装备
  - Arcana 套组
  - 关键副词条

#### 4. Gear Guide

- 主体采用“装备位优先级表”。
- 配合一组 farming order 标签和 early mistakes 标签。
- 额外拆出一张 T1/T2 progression 提示卡，避免信息只停留在表格。

---

## 数据结构方案

为了不影响其他 12 个模块，本次只给这 4 个模块增加结构化字段:

- `displayType`
- `tierGroups`
- `roleTabs`
- `teamCards`
- `buildEntries`
- `priorityRows`
- `farmTags`
- `mistakeTags`
- `spotlight`

其他旧模块仍沿用原有 `cards + tags` 渲染。

---

## 执行原则

1. 先更新英文翻译数据，再改页面渲染逻辑。
2. 页面渲染采用“按模块 `displayType` 分发”的方式，避免写死到单个模块 ID。
3. 保持现有 Hero、PV、导航、FAQ、CTA、Footer、广告位顺序不变。
4. 不使用 Python 脚本做批量重构。
5. 完成后执行本地启动、路由响应检查、类型检查、lint、build、git 提交推送、Actions 检查和重部署脚本。

---

## 实施结论

采用“在现有首页中增量扩展结构化模块”的方案最稳妥:

- 对现有用户可见结构影响最小
- 能保留此前已完成的 16 模块体系
- 同时让模块 5-8 的信息密度和视觉辨识度明显提升
