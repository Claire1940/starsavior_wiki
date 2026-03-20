'use client'

import { useEffect, useState } from 'react'
import { SocialBarAd } from '@/components/ads/SocialBarAd'
import { NativeBannerAd } from '@/components/ads/NativeBannerAd'
import { AdBanner } from '@/components/ads/AdBanner'
import { IframeBannerAd } from '@/components/ads/IframeBannerAd'

interface ScriptLoadStatus {
  url: string
  status: 'loading' | 'success' | 'error'
  httpStatus?: number
  timestamp: number
}

export default function AdDebugPage() {
  const [mounted, setMounted] = useState(false)
  const [scriptStatuses, setScriptStatuses] = useState<ScriptLoadStatus[]>([])

  // 环境变量列表
  const envVars = {
    'NEXT_PUBLIC_AD_NATIVE_BANNER': process.env.NEXT_PUBLIC_AD_NATIVE_BANNER,
    'NEXT_PUBLIC_AD_BANNER_728X90': process.env.NEXT_PUBLIC_AD_BANNER_728X90,
    'NEXT_PUBLIC_AD_BANNER_300X250': process.env.NEXT_PUBLIC_AD_BANNER_300X250,
    'NEXT_PUBLIC_AD_BANNER_468X60': process.env.NEXT_PUBLIC_AD_BANNER_468X60,
    'NEXT_PUBLIC_AD_MOBILE_320X50': process.env.NEXT_PUBLIC_AD_MOBILE_320X50,
    'NEXT_PUBLIC_AD_SOCIAL_BAR': process.env.NEXT_PUBLIC_AD_SOCIAL_BAR,
    'NEXT_PUBLIC_AD_SIDEBAR_160X600': process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600,
    'NEXT_PUBLIC_AD_SIDEBAR_160X300': process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300,
  }

  useEffect(() => {
    setMounted(true)

    // 监听脚本加载
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' &&
            (entry.name.includes('effectivegatecpm.com') ||
             entry.name.includes('highperformanceformat.com'))) {
          const resource = entry as PerformanceResourceTiming
          setScriptStatuses(prev => [...prev, {
            url: entry.name,
            status: resource.responseStatus === 200 ? 'success' : 'error',
            httpStatus: resource.responseStatus,
            timestamp: Date.now()
          }])
        }
      }
    })

    observer.observe({ entryTypes: ['resource'] })

    // 监听脚本错误
    const handleScriptError = (event: ErrorEvent) => {
      if (event.filename?.includes('effectivegatecpm.com') ||
          event.filename?.includes('highperformanceformat.com')) {
        setScriptStatuses(prev => [...prev, {
          url: event.filename || '',
          status: 'error',
          timestamp: Date.now()
        }])
      }
    }

    window.addEventListener('error', handleScriptError, true)

    return () => {
      observer.disconnect()
      window.removeEventListener('error', handleScriptError, true)
    }
  }, [])

  if (!mounted) {
    return <div className="p-8">Loading...</div>
  }

  // 生成诊断建议
  const getDiagnostics = () => {
    const issues: string[] = []
    const suggestions: string[] = []

    // 检查未定义的环境变量
    const undefinedVars = Object.entries(envVars).filter(([, value]) => !value || value === '0')
    if (undefinedVars.length > 0) {
      issues.push(`${undefinedVars.length} 个环境变量未定义或为 '0'`)
      suggestions.push('检查 .env.local 文件是否存在且格式正确')
      suggestions.push('运行 `bun run build` 重新构建以更新环境变量')
    }

    // 检查脚本加载失败
    const failedScripts = scriptStatuses.filter(s => s.status === 'error')
    if (failedScripts.length > 0) {
      issues.push(`${failedScripts.length} 个广告脚本加载失败`)

      // 检查403错误
      const forbidden = failedScripts.filter(s => s.httpStatus === 403)
      if (forbidden.length > 0) {
        suggestions.push('403错误:广告服务器拒绝访问,可能原因:')
        suggestions.push('  - 域名未在Adsterra后台添加白名单')
        suggestions.push('  - 广告ID格式错误或已过期')
        suggestions.push('  - 地理位置限制(某些地区不提供服务)')
        suggestions.push('  - 广告ID中的斜杠需要URL编码')
      }
    }

    // 检查包含斜杠的广告ID
    const slashIds = Object.entries(envVars).filter(([, value]) => value?.includes('/'))
    if (slashIds.length > 0) {
      issues.push(`${slashIds.length} 个广告ID包含斜杠字符`)
      suggestions.push('包含斜杠的广告ID可能需要特殊处理')
      suggestions.push('检查Adsterra后台提供的正确集成代码')
    }

    return { issues, suggestions }
  }

  const diagnostics = getDiagnostics()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">广告环境变量调试页面</h1>
          <p className="text-muted-foreground">诊断广告配置问题和脚本加载状态</p>
        </div>

        {/* 诊断摘要 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">诊断摘要</h2>

          {diagnostics.issues.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-red-500 mb-2">发现的问题:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {diagnostics.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-yellow-500 mb-2">修复建议:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {diagnostics.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-green-500">✅ 未发现明显问题</p>
          )}
        </div>

        {/* 环境变量验证 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">环境变量状态</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-background rounded border border-border">
                <div>
                  <span className="font-mono text-sm text-foreground">{key}</span>
                  {value?.includes('/') && (
                    <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                      包含斜杠
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {value && value !== '0' ? (
                    <>
                      <span className="font-mono text-xs text-muted-foreground max-w-xs truncate">
                        {value}
                      </span>
                      <span className="text-green-500 text-sm">✓ 已配置</span>
                    </>
                  ) : (
                    <span className="text-red-500 text-sm">✗ 未配置</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 脚本加载监控 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">脚本加载状态</h2>
          {scriptStatuses.length > 0 ? (
            <div className="space-y-2">
              {scriptStatuses.map((script, i) => (
                <div key={i} className="p-3 bg-background rounded border border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-mono text-xs text-muted-foreground break-all">
                        {script.url}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(script.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {script.httpStatus && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          script.httpStatus === 200
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {script.httpStatus}
                        </span>
                      )}
                      <span className={`text-sm ${
                        script.status === 'success' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {script.status === 'success' ? '✓ 成功' : '✗ 失败'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">暂无脚本加载记录(等待广告组件加载...)</p>
          )}
        </div>

        {/* 广告组件测试 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">广告组件测试</h2>
          <p className="text-sm text-muted-foreground mb-4">
            以下区域会尝试加载各个广告组件,检查控制台和上方"脚本加载状态"查看结果
          </p>

          <div className="space-y-6">
            {/* 社交栏广告 */}
            <div className="border-2 border-dashed border-border p-4 rounded">
              <h3 className="font-medium text-foreground mb-2">社交栏广告 (SocialBarAd)</h3>
              <div className="text-xs text-muted-foreground mb-2">
                Key: {process.env.NEXT_PUBLIC_AD_SOCIAL_BAR || 'undefined'}
              </div>
              <SocialBarAd adKey={process.env.NEXT_PUBLIC_AD_SOCIAL_BAR || ''} />
              <div className="text-xs text-muted-foreground mt-2">
                组件返回null,检查是否有脚本加载记录
              </div>
            </div>

            {/* 原生横幅广告 */}
            <div className="border-2 border-dashed border-border p-4 rounded">
              <h3 className="font-medium text-foreground mb-2">原生横幅广告 (NativeBannerAd)</h3>
              <div className="text-xs text-muted-foreground mb-2">
                Key: {process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || 'undefined'}
              </div>
              <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />
            </div>

            {/* 300x250 方形广告 */}
            <div className="border-2 border-dashed border-border p-4 rounded">
              <h3 className="font-medium text-foreground mb-2">300x250 方形广告 (IframeBannerAd)</h3>
              <div className="text-xs text-muted-foreground mb-2">
                Key: {process.env.NEXT_PUBLIC_AD_BANNER_300X250 || 'undefined'}
              </div>
              <IframeBannerAd
                adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250 || ''}
                width={300}
                height={250}
              />
            </div>

            {/* 728x90 横幅广告 */}
            <div className="border-2 border-dashed border-border p-4 rounded">
              <h3 className="font-medium text-foreground mb-2">728x90 横幅广告 (AdBanner)</h3>
              <div className="text-xs text-muted-foreground mb-2">
                Key: {process.env.NEXT_PUBLIC_AD_BANNER_728X90 || 'undefined'}
              </div>
              <AdBanner
                type="banner-728x90"
                adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90 || ''}
              />
            </div>
          </div>
        </div>

        {/* 常见问题排查清单 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">排查清单</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-muted-foreground">
                检查 <code className="bg-background px-1 rounded">.env.local</code> 文件是否存在于项目根目录
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-muted-foreground">
                运行 <code className="bg-background px-1 rounded">rm -rf .next && bun run build</code> 清除缓存并重新构建
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-muted-foreground">
                检查浏览器控制台Network标签,查看广告脚本请求是否发送
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-muted-foreground">
                在Adsterra后台确认当前域名(<code className="bg-background px-1 rounded">{typeof window !== 'undefined' ? window.location.hostname : 'localhost'}</code>)已添加到网站列表
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-muted-foreground">
                检查广告ID是否正确(复制自Adsterra后台)
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-muted-foreground">
                尝试禁用浏览器广告拦截插件(AdBlock、uBlock等)
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-muted-foreground">
                检查是否在不支持的地区(某些国家Adsterra不提供服务)
              </span>
            </label>
          </div>
        </div>

        {/* 环境信息 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">环境信息</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">当前URL:</span>
              <span className="font-mono text-foreground">
                {typeof window !== 'undefined' ? window.location.href : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">域名:</span>
              <span className="font-mono text-foreground">
                {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User Agent:</span>
              <span className="font-mono text-foreground text-xs break-all">
                {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next.js 模式:</span>
              <span className="font-mono text-foreground">
                {process.env.NODE_ENV}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
