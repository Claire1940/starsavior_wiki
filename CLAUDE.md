# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 15 的 Roblox 游戏资源中心网站，为 "Anime Paradox" 游戏提供工具、攻略和社区资源。项目使用 App Router、TypeScript、Tailwind CSS 和 shadcn/ui 组件库。

## 常用命令

### 开发
```bash
bun dev                    # 启动开发服务器 (使用 Turbopack，监听 0.0.0.0)
bun run build              # 构建生产版本
bun start                  # 启动生产服务器
```

### 代码质量
```bash
bun run lint               # 运行 TypeScript 类型检查和 ESLint
bunx tsc --noEmit          # 仅运行 TypeScript 类型检查
bun run format             # 使用 Biome 格式化代码
bunx biome check --write   # 运行 Biome 检查并自动修复
```

### shadcn/ui 组件
```bash
bunx shadcn@latest add <component-name>   # 添加新的 shadcn/ui 组件
```

## 代码架构

### 目录结构

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局 (服务器组件) - 字体加载、元数据、same-runtime 集成
│   ├── page.tsx           # 主页面 (客户端组件) - 完整的营销页面
│   ├── ClientBody.tsx     # 客户端包装 - 提供 LanguageProvider
│   └── globals.css        # 全局样式 - Tailwind + CSS 变量 + 自定义动画
├── components/ui/         # shadcn/ui 组件库
├── contexts/              # React Context 状态管理
│   └── LanguageContext.tsx  # 多语言上下文 (en/zh)
├── lib/                   # 工具函数
│   └── utils.ts          # cn() 函数 - 合并 Tailwind 类名
└── locales/              # 国际化翻译文件
    ├── en.json           # 英文翻译
    └── zh.json           # 中文翻译
```

### 关键架构决策

#### 1. 服务器组件 vs 客户端组件
- **layout.tsx**: 服务器组件 - 处理元数据、字体加载、静态配置
- **page.tsx**: 客户端组件 (`'use client'`) - 需要交互、状态管理和浏览器 API
- **ClientBody.tsx**: 客户端包装 - 解决水合问题，提供 Context

#### 2. 状态管理
使用 React Context API 进行轻量级状态管理：
- **LanguageContext**: 管理语言切换 (en/zh)
- 使用 localStorage 持久化语言选择
- 自动检测浏览器语言 (navigator.language)

使用方式：
```typescript
const { language, setLanguage, t } = useLanguage();
```

#### 3. 国际化 (i18n)
- 翻译文件位于 `src/locales/`
- 通过 LanguageContext 提供翻译对象 `t`
- 所有文本内容都应通过 `t.section.key` 访问
- 添加新文本时需同时更新 `en.json` 和 `zh.json`

#### 4. 样式系统
- **Tailwind CSS**: 主要样式框架
- **CSS 变量**: 使用 HSL 格式定义颜色系统 (在 globals.css 中)
- **深色模式**: 基于 class 的切换 (`.dark` 类)
- **shadcn/ui**: 使用 "new-york" 风格，基础颜色为 zinc
- **动画**: 使用 tailwindcss-animate 插件和自定义 scroll-reveal 动画

#### 5. 图片处理
- Next.js 图片优化已禁用 (`unoptimized: true`)
- 允许的外部图片域名：
  - source.unsplash.com
  - images.unsplash.com
  - ext.same-assets.com
  - ugc.same-assets.com

#### 6. same-runtime 集成
- 自定义 JSX 运行时，在 tsconfig.json 中配置
- 全局脚本在 layout.tsx 中加载
- 不要修改 `jsxImportSource` 配置

### 路径别名

在 TypeScript 中使用以下别名：
```typescript
@/components  → src/components
@/lib         → src/lib
@/ui          → src/components/ui
@/hooks       → src/hooks
```

### 添加新的 shadcn/ui 组件

1. 运行 `bunx shadcn@latest add <component-name>`
2. 组件会自动添加到 `src/components/ui/`
3. 组件使用 CVA (class-variance-authority) 管理样式变体
4. 所有组件都集成了 Tailwind CSS 和 CSS 变量系统

### 页面结构 (page.tsx)

主页面包含以下部分（按顺序）：
1. **导航栏**: 固定顶部，包含语言切换按钮
2. **Hero 部分**: 标题、描述、CTA 按钮、统计数据
3. **游戏特性**: 图片 + 描述展示
4. **工具与资源**: 8 个工具卡片网格
5. **"什么是 Anime Paradox"**: 3 个特性卡片
6. **顶级单位**: 4 个单位卡片
7. **稀有度系统**: 6 个等级展示
8. **FAQ**: 可展开的问题列表
9. **CTA 部分**: 行动号召
10. **页脚**: 4 列导航 + 版权信息

所有部分都使用 Intersection Observer 实现滚动揭示动画。

### 代码风格

- 使用 Biome 进行代码格式化
- ESLint 配置禁用了部分规则：
  - `@typescript-eslint/no-unused-vars`
  - `react/no-unescaped-entities`
  - `@next/next/no-img-element`
  - `jsx-a11y/alt-text`
- TypeScript 严格模式已启用
- 使用 Bun 作为包管理器和运行时

### 部署

- 部署平台: Netlify
- 构建命令: `bun run build`
- 发布目录: `.next`
- 配置文件: `netlify.toml`
- 跳过 Netlify Next.js 插件，使用 `@netlify/plugin-nextjs`

## 开发注意事项

1. **添加新文本内容**: 必须同时更新 `src/locales/en.json` 和 `src/locales/zh.json`
2. **添加新页面**: 在 `src/app/` 下创建新目录和 `page.tsx`
3. **修改样式主题**: 编辑 `src/app/globals.css` 中的 CSS 变量
4. **添加新图片域名**: 更新 `next.config.js` 中的 `domains` 和 `remotePatterns`
5. **客户端交互**: 需要使用 `'use client'` 指令的场景：
   - 使用 React Hooks (useState, useEffect 等)
   - 访问浏览器 API (localStorage, navigator 等)
   - 事件处理器 (onClick, onChange 等)
   - 使用 Context (useContext, useLanguage 等)
