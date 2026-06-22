# WWE 2K26 Wiki 广告系统完整实现指南

> 本文档详细记录了 `git@github.com:claire20020128-hash/wwe2k26_wiki.git` 项目中广告系统的每一个实现细节，包括组件源码、页面布局、环境变量注入、脚本加载机制等全部内容。

---

## 目录

1. [系统架构总览](#1-系统架构总览)
2. [广告提供商](#2-广告提供商)
3. [环境变量体系](#3-环境变量体系)
4. [广告组件详解](#4-广告组件详解)
   - 4.1 [AdBanner — 标准横幅广告](#41-adbanner--标准横幅广告)
   - 4.2 [SidebarAd — 侧边栏广告](#42-sideberad--侧边栏广告)
   - 4.3 [NativeBannerAd — 原生横幅广告](#43-nativebannerad--原生横幅广告)
   - 4.4 [SocialBarAd — 社交栏浮动广告](#44-socialberad--社交栏浮动广告)
   - 4.5 [IframeBannerAd — Iframe 横幅广告](#45-iframebannerad--iframe-横幅广告)
   - 4.6 [index.ts — 统一导出](#46-indexts--统一导出)
5. [核心机制：队列化加载系统](#5-核心机制队列化加载系统)
6. [页面广告布局详解](#6-页面广告布局详解)
   - 6.1 [首页 (page.tsx) — 12 个广告位](#61-首页-pagetsx--12-个广告位)
   - 6.2 [全局布局 (layout.tsx) — 1 个广告位](#62-全局布局-layouttsx--1-个广告位)
   - 6.3 [文章详情页 (DetailPage.tsx) — 6 个广告位](#63-文章详情页-detailpagetsx--6-个广告位)
   - 6.4 [导航分类页 (NavigationPage.tsx) — 5 个广告位](#64-导航分类页-navigationpagetsx--5-个广告位)
7. [环境变量注入链路](#7-环境变量注入链路)
8. [广告位分布统计](#8-广告位分布统计)
9. [关键设计决策与注意事项](#9-关键设计决策与注意事项)

---

## 1. 系统架构总览

```
┌──────────────────────────────────────────────────────────────────┐
│                     广告系统架构                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  环境变量层                                                       │
│  ┌─────────────────────────────────────────────────┐             │
│  │ GitHub Secrets → deploy.yml → Dockerfile → ENV  │             │
│  │ 本地开发: .env.local                             │             │
│  └────────────────────┬────────────────────────────┘             │
│                       │                                          │
│                       ▼                                          │
│  组件层 (src/components/ads/)                                     │
│  ┌────────────┬──────────────┬───────────────┐                   │
│  │ AdBanner   │ SidebarAd    │ NativeBanner  │                   │
│  │ (Adsterra) │ (Adsterra)   │ (EffGateCPM)  │                   │
│  ├────────────┼──────────────┼───────────────┤                   │
│  │ IframeBanner│ SocialBarAd │               │                   │
│  │ (Adsterra)  │ (EffGateCPM)│               │                   │
│  └─────┬──────┴──────┬───────┴───────┬───────┘                   │
│        │             │               │                            │
│        ▼             ▼               ▼                            │
│  页面层                                                           │
│  ┌────────────┬──────────────┬───────────────┬──────────────┐    │
│  │ page.tsx   │ layout.tsx   │ DetailPage    │ NavigationPg │    │
│  │ (12 ads)   │ (1 ad)       │ (6 ads)       │ (5 ads)      │    │
│  └────────────┴──────────────┴───────────────┴──────────────┘    │
│                                                                   │
│  总计: 24 个广告位                                                 │
└───────────────────────────────────────────────────────────────────┘
```

**文件结构：**
```
src/components/ads/
├── AdBanner.tsx        # 标准横幅广告（5 种尺寸）
├── SidebarAd.tsx       # 侧边栏广告（2 种尺寸）
├── NativeBannerAd.tsx  # 原生自适应横幅
├── SocialBarAd.tsx     # 全局浮动社交栏
├── IframeBannerAd.tsx  # iframe 嵌入式广告
└── index.ts            # 统一导出
```

---

## 2. 广告提供商

项目使用**两个主要广告提供商**和一个**备用/辅助**：

| 提供商 | 域名 | 用途 | 使用的组件 |
|--------|------|------|-----------|
| **Adsterra** | `www.highperformanceformat.com` | 横幅广告、侧边栏广告、iframe 广告 | AdBanner, SidebarAd, IframeBannerAd |
| **Effective Gate CPM** | `pl28666083.effectivegatecpm.com` | 原生横幅广告 | NativeBannerAd |
| **Effective Gate CPM** | `pl28666057.effectivegatecpm.com` | 社交栏浮动广告 | SocialBarAd |
| **Google AdSense** (辅助) | `pagead2.googlesyndication.com` | 页面级广告（meta 标签 + script） | layout.tsx 中直接引用 |

**Google AdSense 账号 ID**: `ca-pub-7733402184034568`

---

## 3. 环境变量体系

### 3.1 广告相关环境变量

所有广告密钥均使用 `NEXT_PUBLIC_` 前缀，确保在客户端可用（Next.js 的 NEXT_PUBLIC_ 前缀会将变量内联到客户端 bundle 中）：

| 变量名 | 用途 | 广告尺寸 | 使用的组件 |
|--------|------|---------|-----------|
| `NEXT_PUBLIC_AD_BANNER_728X90` | 标准大横幅 | 728 x 90 px | AdBanner |
| `NEXT_PUBLIC_AD_BANNER_300X250` | 方形广告 | 300 x 250 px | AdBanner |
| `NEXT_PUBLIC_AD_BANNER_468X60` | 中型横幅 | 468 x 60 px | AdBanner |
| `NEXT_PUBLIC_AD_MOBILE_320X50` | 移动端横幅 | 320 x 50 px | AdBanner |
| `NEXT_PUBLIC_AD_SIDEBAR_160X600` | 左侧边栏竖幅 | 160 x 600 px | SidebarAd |
| `NEXT_PUBLIC_AD_SIDEBAR_160X300` | 右侧边栏方形 | 160 x 300 px | SidebarAd |
| `NEXT_PUBLIC_AD_NATIVE_BANNER` | 原生自适应横幅 | 自适应 4:1 | NativeBannerAd |
| `NEXT_PUBLIC_AD_SOCIAL_BAR` | 社交栏浮动广告 | 浮动 | SocialBarAd |

### 3.2 其他环境变量

| 变量名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics 追踪 |
| `NEXT_PUBLIC_MICROSOFT_CLARITY_ID` | Microsoft Clarity 热力图 |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | Google AdSense 账号 ID |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL |

### 3.3 adKey 的值格式

- **Adsterra 广告 key**：32 位十六进制字符串，例如 `37fe672426ea5470e5e81f28b884569e`
- **原生广告 key**：同样 32 位十六进制，例如 `4c70bd2895998c353a1fff7ae59782df`
- **社交栏 key**：路径格式，例如 `3a/25/87/3a258706e1ab45370c14952a69d091d4`（注意包含斜杠，拼接后形成 URL 路径）

---

## 4. 广告组件详解

### 4.1 AdBanner — 标准横幅广告

**文件路径**: `src/components/ads/AdBanner.tsx`
**广告提供商**: Adsterra (`www.highperformanceformat.com`)
**渲染模式**: Client Component (`'use client'`)

**支持的 5 种尺寸：**

| type 值 | 宽度 | 高度 | 典型位置 |
|---------|------|------|---------|
| `banner-728x90` | 728px | 90px | 内容区间隔（桌面端标准横幅） |
| `banner-300x250` | 300px | 250px | 内容区间隔（方形广告） |
| `banner-468x60` | 468px | 60px | 内容区间隔（中型横幅） |
| `banner-320x50` | 320px | 50px | 顶部 sticky / 移动端横幅 |
| `banner-160x600` | 160px | 600px | 竖幅（极少使用） |

**Props 接口：**
```typescript
interface AdBannerProps {
  type: 'banner-300x250' | 'banner-468x60' | 'banner-728x90' | 'banner-160x600' | 'banner-320x50'
  className?: string
  adKey?: string  // 为空或 '0' 时不渲染
}
```

**脚本加载流程：**
1. 检查 `adKey` 是否有效（非空、非 `'0'`）
2. 通过 `scriptLoadedRef` 防止重复加载
3. 设置 `window.atOptions` 全局配置对象（key、format、width、height）
4. 创建 `<script>` 标签，src 指向 `https://www.highperformanceformat.com/${adKey}/invoke.js`
5. **通过队列系统 `enqueueHighPerformanceAdLoad()` 串行加载**，防止多个广告同时设置 `window.atOptions` 导致冲突
6. 8 秒超时保护（`AD_LOAD_TIMEOUT_MS = 8000`）
7. 组件卸载时清理所有 `<script>` 标签

**渲染输出：**
```tsx
<div className="flex justify-center {className}">
  <div ref={containerRef}
    style={{
      maxWidth: '{width}px',  // 限制最大宽度
      width: '100%',          // 响应式宽度
      minHeight: '{height}px' // 保证最小高度，防止布局跳动
    }}
  />
</div>
```

**关键细节：**
- `maxWidth` + `width: 100%` 实现了响应式：小屏幕上广告会缩小，大屏幕上不超过预设尺寸
- `minHeight` 防止广告加载前内容区域塌陷
- 外层 `flex justify-center` 保证广告居中

---

### 4.2 SidebarAd — 侧边栏广告

**文件路径**: `src/components/ads/SidebarAd.tsx`
**广告提供商**: Adsterra (`www.highperformanceformat.com`)
**渲染模式**: Client Component (`'use client'`)

**支持的 2 种尺寸：**

| type 值 | 宽度 | 高度 | 位置 |
|---------|------|------|------|
| `sidebar-160x600` | 160px | 600px | 左侧边栏（竖幅摩天大楼广告） |
| `sidebar-160x300` | 160px | 300px | 右侧边栏（半高方形广告） |

**Props 接口：**
```typescript
interface SidebarAdProps {
  type: 'sidebar-160x600' | 'sidebar-160x300'
  className?: string
  adKey?: string
}
```

**与 AdBanner 的区别：**
- 尺寸配置使用固定 `width`（不带 `maxWidth`），因为侧边栏宽度固定
- 其余机制完全相同：队列加载、8 秒超时、`window.atOptions`、脚本清理

**渲染输出：**
```tsx
<div className="flex justify-center {className}">
  <div ref={containerRef}
    style={{
      width: '160px',          // 固定宽度（不是 maxWidth）
      minHeight: '{height}px'
    }}
  />
</div>
```

---

### 4.3 NativeBannerAd — 原生横幅广告

**文件路径**: `src/components/ads/NativeBannerAd.tsx`
**广告提供商**: Effective Gate CPM (`pl28666083.effectivegatecpm.com`)
**渲染模式**: Client Component (`'use client'`)

**Props 接口：**
```typescript
interface NativeBannerAdProps {
  adKey: string   // 必填
  className?: string
}
```

**与 AdBanner 的核心区别：**
1. **不使用队列系统** — 直接加载脚本
2. **不使用 `window.atOptions`** — 无需全局配置
3. **不设超时** — 没有 8 秒限制
4. **不同的广告域名** — `pl28666083.effectivegatecpm.com`
5. **增加 `data-cfasync="false"`** — 告诉 Cloudflare 不要异步优化此脚本
6. **自适应尺寸** — 4:1 宽高比，宽度 100%，高度自动

**脚本加载流程：**
1. 创建 `<script>` 标签
2. 设置 `data-cfasync="false"` 属性
3. src 指向 `https://pl28666083.effectivegatecpm.com/${adKey}/invoke.js`
4. 直接 `appendChild` 到容器（无队列）
5. 卸载时移除脚本

**渲染输出：**
```tsx
<div className="w-full flex justify-center my-8 {className}">
  <div className="w-full max-w-4xl">     {/* 最大宽度 896px */}
    <div ref={containerRef}>
      <div id="container-{adKey}" />       {/* 广告脚本的挂载目标 */}
    </div>
  </div>
</div>
```

**关键细节：**
- `max-w-4xl`（896px）限制了广告最大宽度
- `my-8`（32px）提供上下间距
- 广告脚本会自动找到 `id="container-{adKey}"` 的元素并渲染内容

---

### 4.4 SocialBarAd — 社交栏浮动广告

**文件路径**: `src/components/ads/SocialBarAd.tsx`
**广告提供商**: Effective Gate CPM (`pl28666057.effectivegatecpm.com`)
**渲染模式**: Client Component (`'use client'`)

**Props 接口：**
```typescript
interface SocialBarAdProps {
  adKey: string   // 格式：路径字符串，如 "3a/25/87/3a258706e1ab45370c14952a69d091d4"
}
```

**独特之处：**
1. **组件返回 `null`** — 不渲染任何 DOM 元素
2. **脚本挂载到 `document.body`** — 而不是组件容器
3. **URL 拼接方式不同** — `https://pl28666057.effectivegatecpm.com/${scriptPath}.js`（注意末尾是 `.js`，不是 `/invoke.js`）
4. **adKey 是路径格式** — 包含 `/` 斜杠，如 `3a/25/87/3a258706e1ab45370c14952a69d091d4`

**脚本加载流程：**
1. `adKey.trim()` 去除首尾空白
2. 创建 `<script>` 标签，设置 `data-cfasync="false"`
3. src 指向 `https://pl28666057.effectivegatecpm.com/${scriptPath}.js`
4. `document.body.appendChild(script)` — 直接追加到 body
5. 广告脚本会自动在页面底部/侧边创建浮动元素
6. 卸载时从 body 移除脚本

**注意：** 这是唯一一个在 layout.tsx（全局布局）中使用的广告组件，所有页面都会加载此浮动广告。

---

### 4.5 IframeBannerAd — Iframe 横幅广告

**文件路径**: `src/components/ads/IframeBannerAd.tsx`
**广告提供商**: Adsterra (`www.highperformanceformat.com`)
**渲染模式**: Client Component (`'use client'`)

**Props 接口：**
```typescript
interface IframeBannerAdProps {
  adKey: string     // 必填
  width: number     // 必填，自定义宽度
  height: number    // 必填，自定义高度
  className?: string
}
```

**与 AdBanner 的区别：**
1. **不使用队列系统** — 直接按顺序追加两个 script
2. **自定义尺寸** — 宽高通过 props 传入，不限于预设尺寸
3. **两步脚本加载** — 先创建 `atOptions` 配置脚本（内联 JS），再加载 invoke.js

**脚本加载流程：**
```
步骤 1: 创建内联配置脚本
  <script type="text/javascript">
    atOptions = {
      'key': '{adKey}',
      'format': 'iframe',
      'height': {height},
      'width': {width},
      'params': {}
    };
  </script>

步骤 2: 创建加载脚本
  <script src="https://www.highperformanceformat.com/{adKey}/invoke.js"></script>

两个脚本按顺序 appendChild 到容器
```

**渲染输出：**
```tsx
<div className="w-full flex justify-center {className}">
  <div ref={containerRef}
    style={{
      maxWidth: '100%',
      width: '{width}px',
      height: '{height}px'     // 注意：这里用 height 不是 minHeight
    }}
  />
</div>
```

---

### 4.6 index.ts — 统一导出

**文件路径**: `src/components/ads/index.ts`

```typescript
export { NativeBannerAd } from './NativeBannerAd'
export { IframeBannerAd } from './IframeBannerAd'
export { SocialBarAd } from './SocialBarAd'
export { SidebarAd } from './SidebarAd'
export { AdBanner } from './AdBanner'
```

页面中通过 `import { AdBanner, SidebarAd, NativeBannerAd } from '@/components/ads'` 按需导入。

---

## 5. 核心机制：队列化加载系统

### 5.1 为什么需要队列？

Adsterra 的广告加载脚本依赖全局变量 `window.atOptions`。如果同时加载多个广告：
1. 广告 A 设置 `window.atOptions = { key: 'aaa', width: 728, height: 90 }`
2. 广告 B 立刻覆盖 `window.atOptions = { key: 'bbb', width: 300, height: 250 }`
3. 广告 A 的 invoke.js 实际读到了广告 B 的配置 → **尺寸错乱**

### 5.2 队列实现

```typescript
// 全局队列存储在 window 对象上
interface HighPerformanceWindow extends Window {
  __highPerformanceAdQueue?: Promise<void>   // Promise 链
  atOptions?: { ... }                        // 全局广告配置
}

function enqueueHighPerformanceAdLoad(task: () => Promise<void>) {
  const w = window as HighPerformanceWindow

  // 获取当前队列（如果没有则初始化为已完成的 Promise）
  const queue = w.__highPerformanceAdQueue ?? Promise.resolve()

  // 将新任务串联到队列末尾
  // 注意: .then(task, task) 确保即使前一个任务失败，当前任务仍会执行
  const next = queue.then(task, task)

  // 更新全局队列指针（静默处理错误，防止未捕获的 rejection）
  w.__highPerformanceAdQueue = next.then(
    () => undefined,
    () => undefined,
  )

  return next
}
```

**关键设计：**
- `.then(task, task)` — 无论前一个广告成功还是失败，都继续加载下一个
- 静默错误处理 — 队列指针永远不会卡在 rejected 状态
- **仅 AdBanner 和 SidebarAd 使用此队列**（因为它们共享 `window.atOptions`）
- NativeBannerAd、SocialBarAd、IframeBannerAd **不使用队列**（它们不依赖 `window.atOptions` 或有独立的配置方式）

### 5.3 超时保护

```typescript
const AD_LOAD_TIMEOUT_MS = 8000  // 8 秒

// 在队列任务内部
const timeoutId = setTimeout(() => {
  console.warn(`[AdBanner] Load timeout for ${type}`)
  reject(new Error('Ad load timeout'))
}, AD_LOAD_TIMEOUT_MS)

// 成功时清除超时
invokeScript.onload = () => {
  clearTimeout(timeoutId)
  resolve()
}

// 失败时也清除超时
invokeScript.onerror = (error) => {
  clearTimeout(timeoutId)
  reject(error)
}
```

**作用：** 如果某个广告的 invoke.js 加载超过 8 秒（网络慢或被 AdBlock 拦截），超时 reject 会让队列继续处理下一个广告，避免整个广告系统卡住。

### 5.4 防重复加载

```typescript
const scriptLoadedRef = useRef(false)

useEffect(() => {
  if (scriptLoadedRef.current) return   // 已加载过，跳过

  // ... 加载逻辑

  scriptLoadedRef.current = true        // 标记已加载

  return () => {
    scriptLoadedRef.current = false      // 卸载时重置（支持热更新）
  }
}, [adKey, type])
```

---

## 6. 页面广告布局详解

### 6.1 首页 (page.tsx) — 12 个广告位

**文件**: `src/app/[locale]/page.tsx`
**指令**: `'use client'`（客户端组件）

#### 广告位总览图

```
┌─────────────────────────────────────────────────────────────┐
│ Navigation Bar (固定顶部, z-50)                              │
├─────────────────────────────────────────────────────────────┤
│ [广告位 1] 320×50 Sticky 横幅 (sticky top-20 z-20)          │  ← 全平台显示
├─────┬───────────────────────────────────────────────┬───────┤
│     │                                               │       │
│ [2] │              Hero Section                     │ [3]   │
│ 左  │              (标题、描述、CTA、统计)              │ 右   │
│ 侧  │                                               │ 侧   │
│ 边  ├───────────────────────────────────────────────┤ 边   │
│ 栏  │ [广告位 4] NativeBanner 原生横幅                │ 栏   │
│     ├───────────────────────────────────────────────┤       │
│ 160 │              Video Section                    │ 160  │
│ ×   │              (YouTube 嵌入)                     │ ×    │
│ 600 ├───────────────────────────────────────────────┤ 300  │
│     │ [广告位 5] 728×90 标准横幅                      │       │
│ F   ├───────────────────────────────────────────────┤ F    │
│ I   │              Tools Grid                       │ I    │
│ X   │              (16 个导航卡片)                     │ X    │
│ E   ├───────────────────────────────────────────────┤ E    │
│ D   │ [广告位 6] 300×250 方形广告                     │ D    │
│     ├───────────────────────────────────────────────┤       │
│     │              Module 1: Release & Editions     │       │
│     ├───────────────────────────────────────────────┤       │
│     │ [广告位 7] 468×60 中型横幅                      │       │
│     ├───────────────────────────────────────────────┤       │
│     │              Module 2: Roster                 │       │
│     ├───────────────────────────────────────────────┤       │
│     │ [广告位 8] 320×50 移动端横幅                     │       │
│     ├───────────────────────────────────────────────┤       │
│     │              Module 3: Ratings                │       │
│     │              Module 4: Controls               │       │
│     ├───────────────────────────────────────────────┤       │
│     │ [广告位 9] 300×250 方形广告 (my-8)              │       │
│     ├───────────────────────────────────────────────┤       │
│     │              Module 5: Match Types            │       │
│     │              Module 6: Showcase               │       │
│     │              Module 7: MyGM                   │       │
│     ├───────────────────────────────────────────────┤       │
│     │ [广告位 10] 728×90 标准横幅 (my-8)              │       │
│     ├───────────────────────────────────────────────┤       │
│     │              Module 8: MyRISE                 │       │
│     │              Module 9: Universe Mode          │       │
│     │              Module 10: Community Creations   │       │
│     ├───────────────────────────────────────────────┤       │
│     │ [广告位 11] 468×60 中型横幅 (my-8)              │       │
│     ├───────────────────────────────────────────────┤       │
│     │              Module 11: The Island            │       │
│     │              Module 12: MyFACTION             │       │
│     │              Module 13: Locker Codes          │       │
│     ├───────────────────────────────────────────────┤       │
│     │ [广告位 12] 300×250 方形广告 (my-8)             │       │
│     ├───────────────────────────────────────────────┤       │
│     │              Module 14: PC Requirements       │       │
│     │              FAQ Section                      │       │
│     │              CTA Section                      │       │
│     │              Footer                           │       │
└─────┴───────────────────────────────────────────────┴───────┘
```

#### 每个广告位的详细信息

**广告位 1：顶部 Sticky 横幅（全平台）**
- **行号**: 162-168
- **类型**: `AdBanner` / `banner-320x50`
- **环境变量**: `NEXT_PUBLIC_AD_MOBILE_320X50`
- **包裹 div**:
  ```tsx
  <div className="sticky top-20 z-20 border-b border-border py-2 bg-background/95 backdrop-blur-sm">
  ```
- **定位**: `sticky`，距顶部 `5rem`（80px），在导航栏下方
- **z-index**: `z-20`（高于内容，低于导航栏 z-50）
- **视觉效果**: 半透明背景 + 模糊效果 + 底部边框
- **位置**: Hero Section 上方

**广告位 2：左侧边栏（仅桌面端）**
- **行号**: 170-176
- **类型**: `SidebarAd` / `sidebar-160x600`
- **环境变量**: `NEXT_PUBLIC_AD_SIDEBAR_160X600`
- **包裹 div**:
  ```tsx
  <div className="hidden lg:block fixed left-4 top-24 z-10">
  ```
- **定位**: `fixed`，距左边 `1rem`（16px），距顶部 `6rem`（96px）
- **响应式**: `hidden lg:block` — 仅在 `≥1024px` 宽度时显示
- **z-index**: `z-10`

**广告位 3：右侧边栏（仅桌面端）**
- **行号**: 178-184
- **类型**: `SidebarAd` / `sidebar-160x300`
- **环境变量**: `NEXT_PUBLIC_AD_SIDEBAR_160X300`
- **包裹 div**:
  ```tsx
  <div className="hidden lg:block fixed right-4 top-24 z-10">
  ```
- **定位**: `fixed`，距右边 `1rem`（16px），距顶部 `6rem`（96px）
- **响应式**: 同上，仅桌面端

**广告位 4：原生横幅 — Hero 下方**
- **行号**: 252-253
- **类型**: `NativeBannerAd`
- **环境变量**: `NEXT_PUBLIC_AD_NATIVE_BANNER`
- **代码**:
  ```tsx
  <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />
  ```
- **无额外包裹**（组件自带 `w-full flex justify-center my-8` + `max-w-4xl`）
- **位置**: Hero Section（含统计数据）和 Video Section 之间

**广告位 5：728×90 横幅 — 视频下方**
- **行号**: 268-272
- **类型**: `AdBanner` / `banner-728x90`
- **环境变量**: `NEXT_PUBLIC_AD_BANNER_728X90`
- **代码**:
  ```tsx
  <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />
  ```
- **无额外包裹**（组件自带 `flex justify-center`）
- **位置**: Video Section 和 Tools Grid 之间

**广告位 6：300×250 方形 — 导航卡片下方**
- **行号**: 334-338
- **类型**: `AdBanner` / `banner-300x250`
- **环境变量**: `NEXT_PUBLIC_AD_BANNER_300X250`
- **位置**: Tools Grid（16 个导航卡片）和 Module 1 之间

**广告位 7：468×60 中型横幅 — Module 1 下方**
- **行号**: 378-382
- **类型**: `AdBanner` / `banner-468x60`
- **环境变量**: `NEXT_PUBLIC_AD_BANNER_468X60`
- **位置**: Module 1（Release & Editions）和 Module 2（Roster）之间

**广告位 8：320×50 移动端横幅 — Module 2 下方**
- **行号**: 417-421
- **类型**: `AdBanner` / `banner-320x50`
- **环境变量**: `NEXT_PUBLIC_AD_MOBILE_320X50`
- **位置**: Module 2（Roster）和 Module 3（Ratings）之间

**广告位 9：300×250 方形 — Module 4-5 之间**
- **行号**: 491-496
- **类型**: `AdBanner` / `banner-300x250`
- **环境变量**: `NEXT_PUBLIC_AD_BANNER_300X250`
- **额外样式**: `className="my-8"`（上下 32px 间距）
- **位置**: Module 4（Controls）和 Module 5（Match Types）之间

**广告位 10：728×90 横幅 — Module 7-8 之间**
- **行号**: 552-557
- **类型**: `AdBanner` / `banner-728x90`
- **环境变量**: `NEXT_PUBLIC_AD_BANNER_728X90`
- **额外样式**: `className="my-8"`
- **位置**: Module 7（MyGM）和 Module 8（MyRISE）之间

**广告位 11：468×60 中型横幅 — Module 10-11 之间**
- **行号**: 618-623
- **类型**: `AdBanner` / `banner-468x60`
- **环境变量**: `NEXT_PUBLIC_AD_BANNER_468X60`
- **额外样式**: `className="my-8"`
- **位置**: Module 10（Community Creations）和 Module 11（The Island）之间

**广告位 12：300×250 方形 — Locker Codes 下方**
- **行号**: 719-724
- **类型**: `AdBanner` / `banner-300x250`
- **环境变量**: `NEXT_PUBLIC_AD_BANNER_300X250`
- **额外样式**: `className="my-8"`
- **位置**: Module 13（Locker Codes）和 Module 14（PC Requirements）之间

#### 广告插入的节奏规律

```
Hero → [广告4:NativeBanner] → Video → [广告5:728x90] → Tools Grid → [广告6:300x250]
→ Module 1 → [广告7:468x60] → Module 2 → [广告8:320x50] → Module 3 → Module 4
→ [广告9:300x250] → Module 5 → Module 6 → Module 7 → [广告10:728x90]
→ Module 8 → Module 9 → Module 10 → [广告11:468x60] → Module 11 → Module 12
→ Module 13 → [广告12:300x250] → Module 14 → FAQ → CTA → Footer
```

**规律总结：**
- 前 4 个模块：每 1 个模块后插 1 个广告（密集区，用户刚进入页面）
- 中间：每 2-3 个模块后插 1 个广告
- 广告类型交替使用：300×250 → 468×60 → 320×50 → 300×250 → 728×90 → 468×60 → 300×250
- 避免连续使用相同尺寸

---

### 6.2 全局布局 (layout.tsx) — 1 个广告位

**文件**: `src/app/[locale]/layout.tsx`

```tsx
<body suppressHydrationWarning className="antialiased">
  <Analytics />
  <NextIntlClientProvider messages={messages}>
    <ClientBody>{children}</ClientBody>
  </NextIntlClientProvider>
  {/* 社交栏广告 — 全局浮动，所有页面可见 */}
  <SocialBarAd adKey={process.env.NEXT_PUBLIC_AD_SOCIAL_BAR || ''} />
</body>
```

**另外在 `<head>` 中：**
```tsx
<head>
  <meta name="google-adsense-account" content="ca-pub-7733402184034568" />
  <Script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7733402184034568"
    crossOrigin="anonymous"
    strategy="lazyOnload"
  />
</head>
```

- Google AdSense 的 meta 标签用于验证网站所有权
- `adsbygoogle.js` 使用 `lazyOnload` 策略（页面空闲时加载）
- SocialBarAd 放在 `<body>` 最后，是全局浮动广告

---

### 6.3 文章详情页 (DetailPage.tsx) — 6 个广告位

**文件**: `src/components/content/DetailPage.tsx`

```
┌──────────────────────────────────────────────────────────────────┐
│ Navigation Bar                                                    │
├──────────────────────────────────────────────────────────────────┤
│ Hero Section (标题、描述、面包屑)                                   │
├──────────────────────────────────────────────────────────────────┤
│ [广告位 1] 320×50 Sticky 横幅 (sticky top-20 z-20)               │
├────────┬──────────────────────────────────────────┬──────────────┤
│        │                                          │              │
│ [广告2] │          Article Content                 │  [广告6]     │
│ 左侧栏  │          (MDX 渲染)                      │  右侧栏      │
│ 160×600│                                          │  160×300     │
│        │          Related Articles                 │              │
│ FIXED  │                                          │  FIXED       │
│ xl:only│          Footer Navigation               │  xl:only     │
│        │                                          │              │
│        │     ─── Advertisement ───                 │              │
│        │     [广告3] 728×90                         │              │
│        │     [广告4] 300×250                        │              │
│        │     [广告5] 468×60                         │              │
│        │                                          │              │
└────────┴──────────────────────────────────────────┴──────────────┘
```

**广告位 1：320×50 Sticky（行 105-108）**
```tsx
<div className="sticky top-20 z-20 border-b border-border py-2">
  <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
</div>
```

**广告位 2：左侧栏 160×600 Fixed（行 110-119）**
```tsx
<aside
  className="hidden xl:block fixed top-20 w-40 z-10"
  style={{ left: 'calc((100vw - 1280px) / 2 - 180px)' }}
>
  <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
</aside>
```

**关键：`calc((100vw - 1280px) / 2 - 180px)` 计算原理：**
- `100vw - 1280px` = 视口宽度减去内容区最大宽度（max-w-7xl）
- `/ 2` = 取一半（左侧空白区域宽度）
- `- 180px` = 减去广告宽度 (160px) + 间距 (20px)
- 结果：广告精确定位在内容区左侧的空白区域中
- `hidden xl:block` = 仅在 `≥1280px`（xl 断点）时显示（首页用的是 `lg:block`/`≥1024px`）

**广告位 3-5：底部广告区域（行 142-156）**
```tsx
<div className="border-t border-border pt-12 mt-12 space-y-8">
  <div className="text-center text-sm text-muted-foreground mb-4">
    Advertisement
  </div>
  <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />
  <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />
  <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />
</div>
```

**广告位 6：右侧栏 160×300 Fixed（行 159-168）**
```tsx
<aside
  className="hidden xl:block fixed top-20 w-40 z-10"
  style={{ right: 'calc((100vw - 1280px) / 2 - 180px)' }}
>
  <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
</aside>
```

---

### 6.4 导航分类页 (NavigationPage.tsx) — 5 个广告位

**文件**: `src/components/content/NavigationPage.tsx`

```
┌────────────────────────────────────────────────┐
│ Hero Section (标题、描述)                        │
├────────────────────────────────────────────────┤
│ [广告位 1] 728×90 横幅 (无 adKey!)              │  ⚠️ BUG
├────────────────────────────────────────────────┤
│ What is / Why Section                          │
│ Featured Items                                 │
├────────────────────────────────────────────────┤
│ [广告位 2] NativeBanner 原生横幅                 │
│ [广告位 3] 300×250 方形 (无 adKey!)              │  ⚠️ BUG
├────────────────────────────────────────────────┤
│ All Items Grid                                 │
│ ┌──────┬──────┬──────┐                         │
│ │ 卡1  │ 卡2  │ 卡3  │                         │
│ ├──────┼──────┼──────┤                         │
│ │ 卡4  │ 卡5  │ 卡6  │                         │
│ ├──────┴──────┴──────┤                         │
│ │ [广告位 4] NativeBanner (全宽, col-span-3)    │
│ ├──────┬──────┬──────┤                         │
│ │ 卡7  │ 卡8  │ ...  │                         │
│ └──────┴──────┴──────┘                         │
├────────────────────────────────────────────────┤
│ [广告位 5] 728×90 横幅 (无 adKey!)              │  ⚠️ BUG
└────────────────────────────────────────────────┘
```

**注意：广告位 1、3、5 没有传 `adKey` prop，实际上会因为 `!adKey` 返回 `null`，不会渲染。**

**广告位 4（Grid 中间插入）的实现：**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {allItems.map((item, index) => (
    <Fragment key={item.slug}>
      <Link ...> {/* 卡片内容 */} </Link>
      {/* 在第 6 个卡片之后插入全宽广告 */}
      {index === 5 && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />
        </div>
      )}
    </Fragment>
  ))}
</div>
```

关键点：`col-span-1 sm:col-span-2 lg:col-span-3` 确保广告在不同屏幕宽度下始终占满整行。

---

## 7. 环境变量注入链路

### 7.1 本地开发

创建 `.env.local` 文件（不提交到 Git）：
```bash
# Adsterra 广告密钥
NEXT_PUBLIC_AD_BANNER_728X90=37fe672426ea5470e5e81f28b884569e
NEXT_PUBLIC_AD_BANNER_300X250=f72a36466cca7bb93d96460a1e3cfc2c
NEXT_PUBLIC_AD_BANNER_468X60=a0262600e84abfd18f43df1a56a45a24
NEXT_PUBLIC_AD_MOBILE_320X50=7e18d4dcca9c3a6e0c3ff5e44760f47c
NEXT_PUBLIC_AD_SIDEBAR_160X600=0d1353bf7259df8a702c4687f415b9aa
NEXT_PUBLIC_AD_SIDEBAR_160X300=e1a2aa807165a42dc3e3d0310cfa8b5a
NEXT_PUBLIC_AD_SOCIAL_BAR=3a/25/87/3a258706e1ab45370c14952a69d091d4
NEXT_PUBLIC_AD_NATIVE_BANNER=4c70bd2895998c353a1fff7ae59782df
```

Next.js 自动读取 `.env.local`，`NEXT_PUBLIC_` 前缀的变量会在构建时被内联到客户端 JS bundle 中。

### 7.2 生产部署（Docker + GitHub Actions）

注入链路完整流程：

```
GitHub Repository Secrets
  ↓
.github/workflows/deploy.yml（build-args 传递）
  ↓
Dockerfile 第 1 层（ARG 声明，行 3-14）
  ↓
Dockerfile 第 2 层 builder（ARG 再次声明 + ENV 赋值，行 39-63）
  ↓
npm run build（Next.js 编译时内联 NEXT_PUBLIC_ 变量到 JS bundle）
  ↓
Dockerfile 第 3 层 runner（运行时不再需要 ENV，已编译进 JS）
```

**deploy.yml 关键代码（行 52-64）：**
```yaml
build-args: |
  NEXT_PUBLIC_SITE_URL=${{ secrets.NEXT_PUBLIC_SITE_URL }}
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=${{ secrets.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID }}
  NEXT_PUBLIC_MICROSOFT_CLARITY_ID=${{ secrets.NEXT_PUBLIC_MICROSOFT_CLARITY_ID }}
  NEXT_PUBLIC_GOOGLE_ADSENSE_ID=${{ secrets.NEXT_PUBLIC_GOOGLE_ADSENSE_ID }}
  NEXT_PUBLIC_AD_NATIVE_BANNER=${{ secrets.NEXT_PUBLIC_AD_NATIVE_BANNER }}
  NEXT_PUBLIC_AD_BANNER_728X90=${{ secrets.NEXT_PUBLIC_AD_BANNER_728X90 }}
  NEXT_PUBLIC_AD_BANNER_300X250=${{ secrets.NEXT_PUBLIC_AD_BANNER_300X250 }}
  NEXT_PUBLIC_AD_BANNER_468X60=${{ secrets.NEXT_PUBLIC_AD_BANNER_468X60 }}
  NEXT_PUBLIC_AD_SIDEBAR_160X600=${{ secrets.NEXT_PUBLIC_AD_SIDEBAR_160X600 }}
  NEXT_PUBLIC_AD_SIDEBAR_160X300=${{ secrets.NEXT_PUBLIC_AD_SIDEBAR_160X300 }}
  NEXT_PUBLIC_AD_MOBILE_320X50=${{ secrets.NEXT_PUBLIC_AD_MOBILE_320X50 }}
  NEXT_PUBLIC_AD_SOCIAL_BAR=${{ secrets.NEXT_PUBLIC_AD_SOCIAL_BAR }}
```

**Dockerfile 关键代码：**
```dockerfile
# 第一层：声明 ARG（全局作用域）
ARG NEXT_PUBLIC_AD_BANNER_728X90
# ...

# 第二层 builder：再次声明 ARG + 转为 ENV
ARG NEXT_PUBLIC_AD_BANNER_728X90
ENV NEXT_PUBLIC_AD_BANNER_728X90=${NEXT_PUBLIC_AD_BANNER_728X90}
# ...

# npm run build 时 Next.js 读取 ENV 并内联到 JS
RUN npm run build
```

**为什么需要在 builder 层再次 `ARG`？**
Docker 的 ARG 有层级作用域——第一层声明的 ARG 在 `FROM` 之后失效，必须在新 stage 重新声明。

---

## 8. 广告位分布统计

### 8.1 按页面统计

| 页面 | 广告总数 | AdBanner | SidebarAd | NativeBanner | SocialBar |
|------|---------|----------|-----------|-------------|-----------|
| 首页 | 12 | 8 | 2 | 1 | 0 (layout 提供) |
| 全局布局 | 1 | 0 | 0 | 0 | 1 |
| 文章详情页 | 6 | 4 | 2 | 0 | 0 |
| 导航分类页 | 5 | 3* | 0 | 2 | 0 |
| **总计** | **24** | **15** | **4** | **3** | **1** |

*注: 导航页的 3 个 AdBanner 因缺少 adKey 不会实际渲染

### 8.2 按定位方式统计

| 定位方式 | 数量 | CSS | 说明 |
|---------|------|-----|------|
| Sticky | 2 | `sticky top-20 z-20` | 顶部横幅，随滚动固定 |
| Fixed | 4 | `fixed left/right-4 top-24 z-10` | 左右侧边栏，始终可见 |
| Static（流式） | 17 | `flex justify-center` | 内容间穿插 |
| Floating（浮动） | 1 | 由脚本控制 | SocialBarAd |

### 8.3 按广告尺寸使用频率

| 尺寸 | 使用次数 | 位置 |
|------|---------|------|
| 300×250 | 5 次 | 首页 ×3, 详情页 ×1, 导航页 ×1 |
| 728×90 | 4 次 | 首页 ×2, 详情页 ×1, 导航页 ×1 |
| 468×60 | 3 次 | 首页 ×2, 详情页 ×1 |
| 320×50 | 3 次 | 首页 ×2, 详情页 ×1 |
| 160×600 | 2 次 | 首页 ×1, 详情页 ×1 |
| 160×300 | 2 次 | 首页 ×1, 详情页 ×1 |
| 原生 4:1 | 3 次 | 首页 ×1, 导航页 ×2 |
| 社交栏 | 1 次 | 全局 |

### 8.4 Z-index 层级体系

```
z-50  Navigation Bar（导航栏）
z-20  Sticky 顶部广告横幅
z-10  Fixed 侧边栏广告
z-0   默认内容层（Static 广告与正文同层）
```

---

## 9. 关键设计决策与注意事项

### 9.1 为什么使用动态脚本注入而不是 `<Script>` 组件？

Next.js 的 `<Script>` 组件适合加载固定 URL 的脚本。但 Adsterra 广告需要：
1. 在加载 invoke.js **之前**设置 `window.atOptions`
2. 每个广告的 URL 包含动态 adKey
3. 需要队列化控制加载顺序

因此使用 `document.createElement('script')` + `appendChild` 手动控制。

### 9.2 sidebar 在首页 vs 详情页的定位差异

- **首页**: `left-4` / `right-4`（简单的固定间距，Tailwind 类）
- **详情页**: `calc((100vw - 1280px) / 2 - 180px)`（精确计算，内联 style）

详情页使用 calc 是因为内容区有明确的 `max-w-7xl`（1280px），需要将广告精确放在内容区外侧。首页因为内容区宽度变化较大，使用简单的固定间距。

### 9.3 responsive 断点选择

- 首页侧边栏: `lg:block`（≥1024px 显示）— 因为首页内容区较宽
- 详情页侧边栏: `xl:block`（≥1280px 显示）— 因为详情页需要更多空间给 MDX 内容

### 9.4 adKey 为空时的处理

所有组件统一逻辑：
```typescript
// render 方法中（早期返回）
if (!adKey || adKey === '0') return null

// useEffect 中（跳过加载）
if (!adKey || adKey === '0' || scriptLoadedRef.current || !containerRef.current) return
```

支持两种方式禁用广告：
- 不设置环境变量（`undefined`/`''`）
- 设为 `'0'`

### 9.5 广告密度控制原则

wwe2k26 首页的广告密度遵循以下原则：
1. **首屏必有广告**: sticky 横幅确保用户进入页面就能看到广告
2. **前几个模块插入密集**: 模块 1→广告→模块 2→广告（用户注意力最集中的区域）
3. **后续逐渐稀疏**: 每 2-3 个模块才插入 1 个广告
4. **类型交替**: 避免连续出现相同尺寸的广告，增加视觉多样性
5. **最后一个广告不在页面末尾**: 最后的广告在倒数第二个模块之后，避免与 Footer 太近

### 9.6 NEXT_PUBLIC_ 变量的编译时行为

**极其重要**: `process.env.NEXT_PUBLIC_*` 在 Next.js 中是**编译时替换**，不是运行时读取。

```typescript
// 编译前
adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}

// 编译后（构建时）
adKey="37fe672426ea5470e5e81f28b884569e"
```

这意味着：
- `.env.local` 必须在 `next dev` 或 `next build` 之前就存在
- 修改 `.env.local` 后必须重启 dev server
- Docker 构建时必须通过 ARG/ENV 传入（运行时修改环境变量无效）
