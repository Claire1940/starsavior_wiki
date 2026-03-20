import { getRequestConfig } from 'next-intl/server'
import { routing, type Locale } from './routing'
import deepMerge from 'deepmerge'

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale

	// 使用 routing.locales 动态验证（无需硬编码类型）
	if (!locale || !routing.locales.includes(locale as Locale)) {
		locale = routing.defaultLocale
	}

	// 始终加载英文作为基准
	const baseMessages = (await import(`../locales/en.json`)).default

	if (locale === 'en') {
		return { locale, messages: baseMessages }
	}

	// 其他语言：深度合并，缺失的 key 自动 fallback 到英文
	try {
		const localeMessages = (await import(`../locales/${locale}.json`)).default
		return {
			locale,
			messages: deepMerge(baseMessages, localeMessages, {
				arrayMerge: (destinationArray, sourceArray) => sourceArray,
			}),
		}
	} catch {
		// 翻译文件不存在时完全 fallback 到英文
		return { locale, messages: baseMessages }
	}
})
