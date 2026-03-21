'use client'

import { useEffect, useRef } from 'react'

interface SocialBarAdProps {
  adKey: string
}

/**
 * 社交栏广告组件
 * 浮动式社交分享栏
 * 路径拼接方式：固定域名 + 动态 adKey
 */
export function SocialBarAd({ adKey }: SocialBarAdProps) {
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!adKey || adKey === '0' || scriptLoadedRef.current) return

    const scriptPath = adKey.trim()

    const script = document.createElement('script')
    script.setAttribute('data-cfasync', 'false')
    script.src = `https://pl28666057.effectivegatecpm.com/${scriptPath}.js`
    script.async = true

    script.onload = () => {
      console.log('[SocialBarAd] Script loaded:', script.src)
    }

    script.onerror = (error) => {
      console.error('[SocialBarAd] Script failed to load:', error)
    }

    document.body.appendChild(script)
    scriptLoadedRef.current = true

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      scriptLoadedRef.current = false
    }
  }, [adKey])

  return null
}
