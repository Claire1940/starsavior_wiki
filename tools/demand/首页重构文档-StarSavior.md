# Star Savior 首页重构文档

> 游戏主题: Star Savior
> 域名: starsavior.wiki
> 目标页面: `src/app/[locale]/page.tsx`
> 文案来源: `00基础信息.md`、`00首页信息.md`、`00首页信息-1.md`

---

## 重构目标

1. 把首页从旧模板残留内容切回 `Star Savior` 主题。
2. 首屏之后保留“视频 + 模块导航”的浏览顺序，支持锚点平滑跳转到下方十几个模块。
3. 首页不再出现站内内容页 URL，首页可点击链接仅保留：
   - 首页锚点导航
   - 官方站点 / 官方社媒 / 商店 / 外部参考资料
4. 保留现有广告组件和广告位能力，不能把广告代码删掉。
5. 统一视觉语言，所有强调色、图标色、重点文字色全部复用全局主题变量：
   - `hsl(var(--nav-theme))`
   - `hsl(var(--nav-theme-light))`
6. 只改英文文案和现有首页组件，不扩散到其他语言文件。

---

## 视觉方向

### 主题气质

- 基调: 星海、宇宙、二次元、发光卡面
- 背景: 深色为主，使用带星云感的渐变和柔光块，不走扁平纯色
- 强调: 紫蓝辉光 + 金色点缀的“稀有度感”
- 布局: 大块信息卡 + 数据条 + 目录胶囊导航

### 组件规则

- 首页模块标题统一采用 `Star Savior + 模块名`
- 使用 `lucide-react`
- 同一组卡片内图标不重复
- 图标和强调文字不写死颜色，统一走主题变量
- CTA 只指向外部官方链接或外部参考链接
- 不使用 emoji

---

## 页面结构

### 1. Hero

- Badge: 突出 “Anime Training Turn-Based RPG”
- H1: `Star Savior Wiki`
- 描述: 强调 Journey、turn-based battles、team building、gear、reroll、launch tracking
- CTA:
  - 主按钮: Official Website
  - 次按钮: Play on Google Play
- 数据卡:
  - 100K+ Downloads
  - 3.9 Rating
  - 5.89K Reviews
  - Mar 19 Global Launch

### 2. 官方 PV 区

- 使用已有 `VideoFeature`
- 文案强调 world, cast, launch atmosphere
- 视频下方紧接目录导航

### 3. 首页模块导航

- 采用横向胶囊导航 + 卡片网格混合形式
- 支持跳转到下方 16 个模块锚点
- 导航标题统一为 `Star Savior + xxx`
- 导航按优先级排序

### 4. 16 个首页模块

#### 第一层: 首页前半屏高转化模块

1. `Star Savior Codes`
2. `Star Savior Tier List`
3. `Star Savior Beginner Guide`
4. `Star Savior Reroll Guide`
5. `Star Savior Arcana Tier List`
6. `Star Savior Best Teams`

#### 第二层: 中部深度浏览模块

7. `Star Savior Character Builds`
8. `Star Savior Gear Guide`
9. `Star Savior 7-Day Progression`
10. `Star Savior Gacha Guide`
11. `Star Savior Character List`
12. `Star Savior Journey Training Guide`

#### 第三层: 中后期用户模块

13. `Star Savior Boss Guide`
14. `Star Savior Hard Mode Guide`
15. `Star Savior PvP Guide`
16. `Star Savior Resource Management`

### 5. FAQ

- FAQ 必须高频出现 `Star Savior`
- 问答内容围绕下载、兑换码、Journey、reroll、team building、官方渠道

### 6. 结尾 CTA

- 只保留官方外链：
  - Discord
  - Google Play

---

## 模块表现形式

为了避免页面像“16 个一模一样的 SEO 盒子”，模块采用三种视觉节奏交替：

### A. 数据驱动模块

适用于:
- Codes
- Tier List
- Arcana Tier List
- Character List

表现:
- 数据卡 / 标签 / 对比行
- 带 `Last checked`
- 带外部参考按钮

### B. 流程驱动模块

适用于:
- Beginner Guide
- Reroll Guide
- 7-Day Progression
- Journey Training Guide
- Resource Management

表现:
- 时间线 / 步骤卡 / Do-First vs Save-For-Later

### C. 策略驱动模块

适用于:
- Best Teams
- Character Builds
- Gear Guide
- Gacha Guide
- Boss Guide
- Hard Mode Guide
- PvP Guide

表现:
- 重点卡片 + 场景标签 + 推荐方向

---

## 外链策略

### Hero / Footer / CTA 官方链接

- Official Website: `https://www.starsavior.com/`
- News: `https://www.starsavior.com/en/news`
- X: `https://x.com/StarSavior_EN`
- YouTube: `https://www.youtube.com/@StarSavior_EN`
- Discord: `https://discord.com/invite/UHNYfe9C77`
- Google Play: `https://play.google.com/store/apps/details?id=com.studiobside.starMain`
- Reddit: `https://www.reddit.com/r/StarSavior/`

### 模块参考链接

- 优先使用需求文档里已经列出的外部资料
- 每个模块保留 1 个主外链按钮，避免首页变成链接农场
- 不在首页放站内文章跳转 URL

---

## 广告保留策略

保留以下广告组件能力，不删除相关代码：

- `NativeBannerAd`
- `AdBanner`

建议保留位置：

1. Hero 之后
2. 视频之后
3. 前 6 个核心模块之后
4. FAQ 或 CTA 之前

---

## 文案执行原则

- 默认所有需求文档里的事实均作为可靠信息使用
- 不写“可能”“大概”“据说”“不一定准确”
- 不出现 APK、fake generator、expired codes、纯百科介绍等低价值入口
- 每个模块标题都带 `Star Savior`
- FAQ 问题和答案里必须直接出现 `Star Savior`

---

## 技术执行原则

1. 只修改现有 `src/app/[locale]/page.tsx`
2. 只更新 `src/locales/en.json`
3. 可以重组 `page.tsx` 内部结构，但不能新建替代版首页文件
4. 不删除首页广告相关组件和代码
5. 不用 Python 脚本批量重构
6. 修改完成后执行：
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`

---

## 实施结论

本次首页会采用“Hero + PV + 锚点导航 + 16 模块 + FAQ + CTA”的完整信息架构，统一成星空发光卡片风格；首页不再保留站内内容 URL，只保留锚点跳转与外部官方 / 参考链接，同时继续保留现有广告组件与广告位。
