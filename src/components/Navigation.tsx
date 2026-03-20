'use client'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'
import { Globe, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { routing, type Locale } from '@/i18n/routing'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NAVIGATION_CONFIG } from '@/config/navigation'
import { getLanguageDisplayNames } from '@/lib/i18n-utils'

export default function Navigation() {
	const t = useTranslations()
	const locale = useLocale() as Locale
	const router = useRouter()
	const pathname = usePathname()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [langMenuOpen, setLangMenuOpen] = useState(false)
	const langDropdownRef = useRef<HTMLDivElement>(null)

	// 动态获取语言显示名称
	const languageNames = getLanguageDisplayNames()

	// 点击外部关闭下拉菜单
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
				setLangMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// 语言切换函数
	const switchLanguage = (newLocale: Locale) => {
		if (newLocale === locale) {
			setLangMenuOpen(false)
			return
		}
		router.replace(pathname, { locale: newLocale })
		setLangMenuOpen(false)
	}

	// 从配置生成导航链接
	const navLinks = NAVIGATION_CONFIG.map(item => ({
		href: item.path,
		label: t(`nav.${item.key}`),
		icon: item.icon
	}))

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center space-x-2 hover:opacity-80 transition"
					>
						<div className="w-10 h-10 bg-[hsl(var(--nav-theme))] rounded-lg flex items-center justify-center font-bold text-xl">
							S
						</div>
						<span className="font-bold text-lg hidden sm:inline">Slayerbound</span>
						<span className="font-bold text-lg sm:hidden">SB</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-6 text-sm">
						{navLinks.map((link) => {
							const Icon = link.icon
							return (
								<Link
									key={link.href}
									href={link.href}
									className="flex items-center gap-2 hover:text-[hsl(var(--nav-theme-light))] transition"
								>
									<Icon className="w-4 h-4" />
									{link.label}
								</Link>
							)
						})}
					</div>

					{/* Actions */}
					<div className="flex items-center gap-3">
						{/* Theme Toggle */}
						<ThemeToggle />

						{/* Language Switcher Dropdown */}
						<div className="relative" ref={langDropdownRef}>
							<button
								onClick={() => setLangMenuOpen(!langMenuOpen)}
								className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition border border-border"
								title={t('common.switchLanguage')}
								aria-expanded={langMenuOpen}
								aria-haspopup="listbox"
							>
								<Globe className="w-4 h-4" />
								<span className="text-sm font-medium hidden sm:inline">
									{languageNames[locale]}
								</span>
								<ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
							</button>

							{langMenuOpen && (
								<div
									className="absolute right-0 mt-2 py-1 w-32 bg-card rounded-lg shadow-lg border border-border z-50"
									role="listbox"
									aria-label="Select language"
								>
									{routing.locales.map((loc) => (
										<button
											key={loc}
											onClick={() => switchLanguage(loc)}
											className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
												loc === locale ? 'text-[hsl(var(--nav-theme-light))] font-semibold' : 'text-foreground'
											}`}
											role="option"
											aria-selected={loc === locale}
										>
											{languageNames[loc]}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Play Button */}
						<Button className="bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)] text-white hidden sm:flex">
							{t('common.playNow')}
						</Button>

						{/* Mobile Menu Toggle */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
						>
							{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
						<div className="flex flex-col space-y-3">
							{navLinks.map((link) => {
								const Icon = link.icon
								return (
									<Link
										key={link.href}
										href={link.href}
										className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition"
										onClick={() => setMobileMenuOpen(false)}
									>
										<Icon className="w-5 h-5" />
										{link.label}
									</Link>
								)
							})}
							<div className="flex items-center gap-3 px-4">
								<ThemeToggle />
							</div>
							<Button className="bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)] text-white w-full">
								{t('common.playNow')}
							</Button>
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

