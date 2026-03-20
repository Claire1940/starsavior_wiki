'use client'

import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Gift,
	ClipboardCheck,
	Dumbbell,
	Wind,
	Flame,
	Ghost,
	Keyboard,
	MapPin,
	Trophy,
	Coins,
	RotateCcw,
	Calculator,
	Sparkles,
	ChevronDown,
	Zap,
	ArrowRight,
	Copy,
	Check,
	Swords,
	Skull,
	Map,
	Crown,
	AlertTriangle,
	TrendingUp,
	BookOpen,
	MessageCircle,
	Award,
	Users,
	Target,
	Utensils,
	Clock,
	Shield,
} from 'lucide-react'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { NativeBannerAd, AdBanner } from '@/components/ads'

// 懒加载组件
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// 加载占位符组件
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse flex items-center justify-center`}>
    <div className="text-muted-foreground">Loading...</div>
  </div>
)

export default function HomePage() {
	const t = useMessages() as any
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

	// 结构化数据
	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${siteUrl}/#website`,
				url: siteUrl,
				name: t.seo?.home?.title || 'Slayerbound Wiki',
				description: t.seo?.home?.description || 'Complete Slayerbound resource hub with codes, training guides, breathing styles, and demon slayer strategies for the Roblox game.',
				potentialAction: {
					'@type': 'SearchAction',
					target: `${siteUrl}/search?q={search_term_string}`,
					'query-input': 'required name=search_term_string',
				},
			},
			{
				'@type': 'Organization',
				'@id': `${siteUrl}/#organization`,
				name: t.seo?.home?.title || 'Slayerbound Wiki',
				alternateName: 'Slayerbound',
				url: siteUrl,
				description: t.seo?.home?.description || 'Complete Slayerbound Wiki resource hub for codes, tier lists, and guides',
				logo: {
					'@type': 'ImageObject',
					url: `${siteUrl}/images/hero.webp`,
					width: 768,
					height: 432,
				},
				image: {
					'@type': 'ImageObject',
					url: `${siteUrl}/images/hero.webp`,
					width: 768,
					height: 432,
					caption: 'Slayerbound Wiki - Master Demon Slayer Combat',
				},
				sameAs: [
					'https://www.roblox.com/games/113829431520841/Slayerbound',
					'https://discord.com/invite/slayerbound',
					'https://trello.com/b/7IS1N5PR/slayerbound-official-trello',
				],
			},
		],
	}

	// 代码复制状态管理
	const [copiedCode, setCopiedCode] = useState<string | null>(null)

	const copyCode = async (code: string) => {
		try {
			await navigator.clipboard.writeText(code)
			setCopiedCode(code)
			setTimeout(() => setCopiedCode(null), 2000)
		} catch (err) {
			console.error('复制失败:', err)
		}
	}

	// 滚动揭示动画
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('scroll-reveal-visible')
					}
				})
			},
			{ threshold: 0.1 }
		)

		document.querySelectorAll('.scroll-reveal').forEach((el) => {
			observer.observe(el)
		})

		return () => observer.disconnect()
	}, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nav-theme)/0.1)] to-transparent" />

        <div className="container mx-auto text-center relative z-10">
          <div className="scroll-reveal inline-flex items-center space-x-2 px-4 py-2 bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
            <span className="text-sm text-muted-foreground">{t.hero.badge}</span>
          </div>

          <h1 className="scroll-reveal text-5xl md:text-7xl font-bold mb-6">
            {t.hero.title}
          </h1>

          <p className="scroll-reveal text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            {t.hero.description}
          </p>

          <div className="scroll-reveal flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#codes"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)] text-white px-8 py-6 text-lg transition-colors"
            >
              <Gift className="w-5 h-5" />
              {t.hero.getFreeCodesCTA}
            </a>
            <a
              href="https://www.roblox.com/games/113829431520841/Slayerbound"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-border hover:bg-white/10 px-8 py-6 text-lg transition-colors"
            >
              {t.hero.playOnRobloxCTA}
            </a>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats
              stats={[
                { value: t.hero.stats.stat1.value, label: t.hero.stats.stat1.label },
                { value: t.hero.stats.stat2.value, label: t.hero.stats.stat2.label },
                { value: t.hero.stats.stat3.value, label: t.hero.stats.stat3.label },
                { value: t.hero.stats.stat4.value, label: t.hero.stats.stat4.label }
              ]}
            />
          </Suspense>
        </div>
      </section>

      {/* 广告位 1 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Game Feature Video */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="hKBEMyrze2E"
              title="SLAYERBOUND | RELEASE TRAILER"
              posterImage="/images/hero.webp"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.gameFeature.title}</h2>
              <p className="text-muted-foreground max-w-2xl">
                {t.gameFeature.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 广告位：视频特性之后 */}
      <div className="py-8">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Tools & Resources - 模块导航 */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.tools.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Gift, title: t.tools.codes.title, description: t.tools.codes.description, href: '#codes' },
              { icon: ClipboardCheck, title: t.tools.redeemGuide.title, description: t.tools.redeemGuide.description, href: '#redeem-guide' },
              { icon: Dumbbell, title: t.tools.trainingPaths.title, description: t.tools.trainingPaths.description, href: '#training-paths' },
              { icon: Zap, title: t.tools.thunderBreathing.title, description: t.tools.thunderBreathing.description, href: '#thunder-breathing' },
              { icon: TrendingUp, title: t.tools.fastLeveling.title, description: t.tools.fastLeveling.description, href: '#fast-leveling' },
              { icon: Wind, title: t.tools.breathingTier.title, description: t.tools.breathingTier.description, href: '#breathing-tier' },
              { icon: Flame, title: t.tools.demonArtTier.title, description: t.tools.demonArtTier.description, href: '#demon-art-tier' },
              { icon: Ghost, title: t.tools.oniRoute.title, description: t.tools.oniRoute.description, href: '#oni-route' },
              { icon: Keyboard, title: t.tools.controls.title, description: t.tools.controls.description, href: '#controls' },
              { icon: MapPin, title: t.tools.questMap.title, description: t.tools.questMap.description, href: '#quest-map' },
              { icon: Award, title: t.tools.finalSelection.title, description: t.tools.finalSelection.description, href: '#final-selection' },
              { icon: Trophy, title: t.tools.bossDrops.title, description: t.tools.bossDrops.description, href: '#boss-drops' },
              { icon: Coins, title: t.tools.currencyFarm.title, description: t.tools.currencyFarm.description, href: '#currency-farm' },
              { icon: RotateCcw, title: t.tools.resetPlanner.title, description: t.tools.resetPlanner.description, href: '#reset-planner' },
              { icon: Calculator, title: t.tools.buildPlanner.title, description: t.tools.buildPlanner.description, href: '#build-planner' },
              { icon: Users, title: t.tools.clanSystem.title, description: t.tools.clanSystem.description, href: '#clan-system' },
            ].map((tool, index) => (
              <a
                key={index}
                href={tool.href}
                className="scroll-reveal group p-6 bg-white/5 border border-border rounded-xl hover:bg-white/10 hover:border-[hsl(var(--nav-theme)/0.5)] transition cursor-pointer block"
              >
                <tool.icon className="w-12 h-12 text-[hsl(var(--nav-theme-light))] mb-4" />
                <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位：代码表格之后 */}
      <div className="py-8 space-y-4">
        <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />
      </div>

      {/* Slayerbound Codes */}
      <section id="codes" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.codes.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.codes.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.codes.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto">
            <div className="bg-white/5 border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-white/5">
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.codes.table.headers.code}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.codes.table.headers.reward}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.codes.table.headers.status}</th>
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.homepage.codes.table.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-border hover:bg-white/5 transition">
                        <td className="px-6 py-4 font-mono font-bold text-[hsl(var(--nav-theme-light))]">{item.code}</td>
                        <td className="px-6 py-4">{item.reward}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {item.status === 'active' ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => copyCode(item.code)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--nav-theme)/0.2)] hover:bg-[hsl(var(--nav-theme)/0.3)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg transition text-sm"
                          >
                            {copiedCode === item.code ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 广告位：代码表格之后 */}
      <div className="py-8 space-y-4">
        <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />
      </div>

      {/* Slayerbound Redeem Guide */}
      <section id="redeem-guide" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.redeemGuide.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.redeemGuide.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.redeemGuide.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.homepage.redeemGuide.steps.map((step: any, index: number) => (
              <div key={index} className="relative p-6 bg-white/5 border border-border rounded-xl">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[hsl(var(--nav-theme))] rounded-full flex items-center justify-center font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2 mt-4">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slayerbound Training Paths */}
      <section id="training-paths" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.trainingPaths.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.trainingPaths.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.trainingPaths.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.homepage.trainingPaths.paths.map((path: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[hsl(var(--nav-theme-light))]">{path.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    path.difficulty === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {path.difficulty}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-semibold">{path.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Requirements:</span>
                    <p className="font-semibold">{path.requirements}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost:</span>
                    <p className="font-semibold">{path.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slayerbound Thunder Breathing Guide */}
      <section id="thunder-breathing" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.thunderBreathing.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.thunderBreathing.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.thunderBreathing.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="text-xl font-bold">Location</h3>
                </div>
                <p className="text-muted-foreground">{t.homepage.thunderBreathing.location}</p>
              </div>

              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="text-xl font-bold">Difficulty</h3>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400">
                  {t.homepage.thunderBreathing.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto mb-8">
            <div className="p-6 bg-white/5 border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Check className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="text-xl font-bold">{t.homepage.thunderBreathing.requirements.title}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {t.homepage.thunderBreathing.requirements.items.map((item: string, index: number) => (
                  <span key={index} className="px-4 py-2 bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg text-sm font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.homepage.thunderBreathing.steps.map((step: any, index: number) => (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                      <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{step.step}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Fast Leveling Guide */}
      <section id="fast-leveling" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.fastLeveling.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.fastLeveling.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.fastLeveling.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.homepage.fastLeveling.methods.map((method: any, index: number) => (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    {method.icon === 'map' && <Map className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />}
                    {method.icon === 'utensils' && <Utensils className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />}
                    {method.icon === 'route' && <TrendingUp className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />}
                    <h3 className="text-xl font-bold">{method.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <ul className="space-y-2">
                    {method.tips.map((tip: string, tipIndex: number) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Breathing Tier */}
      <section id="breathing-tier" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.breathingTier.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.breathingTier.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.breathingTier.subtitle}
            </p>
            <div className="scroll-reveal mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg">
              <Swords className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm">{t.homepage.breathingTier.dataNote}</span>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto">
            <div className="bg-white/5 border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-white/5">
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.breathingTier.table.headers.breathing}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.breathingTier.table.headers.pveScore}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.breathingTier.table.headers.pvpScore}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.breathingTier.table.headers.difficulty}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.breathingTier.table.headers.cost}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.homepage.breathingTier.table.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-border hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Swords className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                            <span className="font-bold text-[hsl(var(--nav-theme-light))]">{item.breathing}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{item.pveScore}</td>
                        <td className="px-6 py-4 text-muted-foreground">{item.pvpScore}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                            item.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{item.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Demon Art Tier */}
      <section id="demon-art-tier" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.demonArtTier.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.demonArtTier.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.demonArtTier.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto">
            <div className="p-8 bg-white/5 border border-border rounded-xl text-center">
              <Skull className="w-16 h-16 text-[hsl(var(--nav-theme-light))] mx-auto mb-6" />
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] rounded-full mb-6">
                <span className="text-sm font-semibold">{t.homepage.demonArtTier.statusBadge}</span>
              </div>
              <p className="text-muted-foreground mb-8">{t.homepage.demonArtTier.emptyStateText}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="p-6 bg-white/5 border border-border rounded-xl">
                  <h3 className="text-lg font-bold mb-4 text-[hsl(var(--nav-theme-light))]">What We Know</h3>
                  <ul className="space-y-2">
                    {t.homepage.demonArtTier.knownFacts.map((fact: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-white/5 border border-border rounded-xl">
                  <h3 className="text-lg font-bold mb-4 text-[hsl(var(--nav-theme-light))]">Coming Soon</h3>
                  <ul className="space-y-2">
                    {t.homepage.demonArtTier.dataGaps.map((gap: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://trello.com/b/7IS1N5PR/slayerbound-official-trello"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)] text-white rounded-lg transition"
                >
                  {t.homepage.demonArtTier.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Oni Route */}
      <section id="oni-route" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.oniRoute.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.oniRoute.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.oniRoute.subtitle}
            </p>
            <div className="scroll-reveal mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg">
              <Ghost className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm">{t.homepage.oniRoute.warningText}</span>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {t.homepage.oniRoute.flowNodes.map((node: any, index: number) => (
                <div key={node.id} className="relative">
                  <div className="p-6 bg-white/5 border border-border rounded-xl text-center hover:border-[hsl(var(--nav-theme)/0.5)] transition">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                      <span className="font-bold text-[hsl(var(--nav-theme-light))]">{node.id}</span>
                    </div>
                    <h3 className="font-bold mb-2">{node.title}</h3>
                    <p className="text-xs text-muted-foreground">{node.type}</p>
                  </div>
                  {index < t.homepage.oniRoute.flowNodes.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 bg-white/5 border border-border rounded-xl">
              <h3 className="text-lg font-bold mb-4 text-[hsl(var(--nav-theme-light))]">Additional Information Needed</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {t.homepage.oniRoute.unknowns.map((unknown: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-[hsl(var(--nav-theme-light))]">•</span>
                    <span>{unknown}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Controls */}
      <section id="controls" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.controls.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.controls.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.controls.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.homepage.controls.keys.map((control: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl text-center hover:border-[hsl(var(--nav-theme)/0.5)] transition">
                <div className="font-mono font-bold text-2xl text-[hsl(var(--nav-theme-light))] mb-2">
                  {control.key}
                </div>
                <div className="text-sm text-muted-foreground">
                  {control.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slayerbound Quest Map */}
      <section id="quest-map" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.questMap.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.questMap.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.questMap.subtitle}
            </p>
            <p className="scroll-reveal text-sm text-[hsl(var(--nav-theme-light))] mt-2">
              {t.homepage.questMap.recommendedSequence}
            </p>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.homepage.questMap.pins.map((pin: any) => (
              <div key={pin.id} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                    <Map className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="text-lg font-bold">{pin.name}</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Region:</span>
                    <p className="font-semibold">{pin.region}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Objective:</span>
                    <p className="font-semibold">{pin.objective}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Requirements:</span>
                    <ul className="mt-1 space-y-1">
                      {pin.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[hsl(var(--nav-theme-light))]">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rewards:</span>
                    <ul className="mt-1 space-y-1">
                      {pin.rewards.map((reward: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{reward}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slayerbound Final Selection */}
      <section id="final-selection" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.finalSelection.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.finalSelection.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.finalSelection.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto mb-8">
            <div className="p-6 bg-white/5 border border-border rounded-xl">
              <p className="text-muted-foreground">{t.homepage.finalSelection.overview}</p>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">Location</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.homepage.finalSelection.details.location}</p>
              </div>

              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">Timing</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.homepage.finalSelection.details.timing}</p>
              </div>

              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">Max Players</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.homepage.finalSelection.details.maxPlayers}</p>
              </div>

              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">Difficulty</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.homepage.finalSelection.details.difficulty}</p>
              </div>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="text-xl font-bold">{t.homepage.finalSelection.rewards.title}</h3>
                </div>
                <ul className="space-y-2">
                  {t.homepage.finalSelection.rewards.items.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="text-xl font-bold">{t.homepage.finalSelection.tips.title}</h3>
                </div>
                <ul className="space-y-2">
                  {t.homepage.finalSelection.tips.items.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Boss Drops */}
      <section id="boss-drops" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.bossDrops.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.bossDrops.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.bossDrops.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto mb-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-400">{t.homepage.bossDrops.riskNotice}</p>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto">
            <div className="bg-white/5 border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-white/5">
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.bossDrops.table.headers.drop}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.bossDrops.table.headers.source}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.bossDrops.table.headers.howToObtain}</th>
                      <th className="px-6 py-4 text-left font-semibold">{t.homepage.bossDrops.table.headers.primaryUse}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.homepage.bossDrops.table.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-border hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                            <span className="font-bold">{item.drop}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{item.source}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{item.howToObtain}</td>
                        <td className="px-6 py-4 text-sm">{item.primaryUse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Currency Farm */}
      <section id="currency-farm" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.currencyFarm.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.currencyFarm.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.currencyFarm.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto mb-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
              <p className="text-sm text-yellow-400">{t.homepage.currencyFarm.disclaimer}</p>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.homepage.currencyFarm.methods.map((method: any) => (
              <div key={method.rank} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                    <span className="font-bold text-[hsl(var(--nav-theme-light))]">#{method.rank}</span>
                  </div>
                  <Coins className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                </div>

                <h3 className="text-lg font-bold mb-3">{method.method}</h3>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Return:</span>
                    <span className="font-semibold">{method.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{method.timeToValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk:</span>
                    <span className={`font-semibold ${
                      method.riskLevel === 'Low' ? 'text-green-400' :
                      method.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {method.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">How to:</p>
                  <ul className="space-y-1">
                    {method.howTo.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <span className="text-[hsl(var(--nav-theme-light))]">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slayerbound Reset Planner */}
      <section id="reset-planner" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.resetPlanner.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.resetPlanner.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.resetPlanner.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto">
            <div className="p-8 bg-white/5 border border-border rounded-xl">
              <div className="text-center mb-8">
                <RotateCcw className="w-12 h-12 text-[hsl(var(--nav-theme-light))] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{t.homepage.resetPlanner.startQuestion}</h3>
              </div>

              <div className="space-y-6">
                {t.homepage.resetPlanner.decisions.map((decision: any, index: number) => (
                  <div key={index} className="p-6 bg-white/5 border border-border rounded-xl">
                    <h4 className="font-bold mb-4 text-[hsl(var(--nav-theme-light))]">{decision.question}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="font-semibold text-green-400">Yes</span>
                        </div>
                        <p className="text-sm">{decision.yesAction}</p>
                      </div>
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="font-semibold text-red-400">No</span>
                        </div>
                        <p className="text-sm">{decision.noAction}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Build Planner */}
      <section id="build-planner" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.buildPlanner.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.buildPlanner.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.buildPlanner.subtitle}
            </p>
            <div className="scroll-reveal mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg">
              <Calculator className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm">{t.homepage.buildPlanner.dataNote}</span>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto">
            <div className="p-8 bg-white/5 border border-border rounded-xl mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="text-xl font-bold">Build Calculator Inputs</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.homepage.buildPlanner.inputFields.map((field: any, index: number) => (
                  <div key={index} className="p-4 bg-white/5 border border-border rounded-lg">
                    <label className="block text-sm font-semibold mb-2 text-[hsl(var(--nav-theme-light))]">
                      {field.label}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      Type: {field.type}
                      {field.options && ` (${field.options.join(', ')})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.homepage.buildPlanner.presetExamples.map((example: any, index: number) => (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl">
                  <h3 className="text-lg font-bold mb-4 text-[hsl(var(--nav-theme-light))]">{example.name}</h3>

                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Goal:</span>
                      <span className="font-semibold">{example.goalMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-semibold">{example.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Yen:</span>
                      <span className="font-semibold">{example.yenBudget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spins:</span>
                      <span className="font-semibold">{example.spinsAvailable}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Now:</span>
                      <p className="text-sm mt-1">{example.output.now}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Next:</span>
                      <p className="text-sm mt-1">{example.output.next}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">After:</span>
                      <p className="text-sm mt-1">{example.output.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slayerbound Clan System */}
      <section id="clan-system" className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.homepage.clanSystem.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.homepage.clanSystem.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg">
              {t.homepage.clanSystem.subtitle}
            </p>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto mb-8">
            <div className="p-6 bg-white/5 border border-border rounded-xl">
              <p className="text-muted-foreground">{t.homepage.clanSystem.overview}</p>
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Clan Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.homepage.clanSystem.tiers.map((tier: any, index: number) => (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className={`w-6 h-6 ${
                      tier.color === 'gold' ? 'text-yellow-400' :
                      tier.color === 'purple' ? 'text-purple-400' :
                      tier.color === 'blue' ? 'text-blue-400' :
                      'text-gray-400'
                    }`} />
                    <h3 className="text-lg font-bold">{tier.tier}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Drop Rate:</span>
                      <p className="font-semibold">{tier.dropRate}</p>
                    </div>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-reveal max-w-5xl mx-auto mb-8">
            <div className="p-6 bg-white/5 border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="text-2xl font-bold">{t.homepage.clanSystem.notableClans.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {t.homepage.clanSystem.notableClans.clans.map((clan: any, index: number) => (
                  <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                    <h4 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">{clan.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tier:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                          clan.tier === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                          clan.tier === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {clan.tier}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{clan.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-reveal max-w-4xl mx-auto">
            <div className="p-6 bg-white/5 border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="text-xl font-bold">{t.homepage.clanSystem.howToSpin.title}</h3>
              </div>
              <ol className="space-y-2">
                {t.homepage.clanSystem.howToSpin.steps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* What is Slayerbound */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="scroll-reveal text-4xl md:text-5xl font-bold mb-4">
              {t.whatIs.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.whatIs.titleHighlight}</span>
            </h2>
            <p className="scroll-reveal text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.whatIs.description}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {t.whatIs.features.map((feature: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition">
                <Zap className="w-12 h-12 text-[hsl(var(--nav-theme-light))] mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">{t.footer.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.footer.description}</p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.resources}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#codes" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.activeCodes}
                  </a>
                </li>
                <li>
                  <a href="#training-paths" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.trainingGuides}
                  </a>
                </li>
                <li>
                  <a href="#breathing-tier" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.breathingStyles}
                  </a>
                </li>
                <li>
                  <a href="#oni-route" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.clanGuides}
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.moreTools}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://discord.com/invite/slayerbound" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a href="https://trello.com/b/7IS1N5PR/slayerbound-official-trello" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.trello}
                  </a>
                </li>
                <li>
                  <a href="https://www.roblox.com/games/113829431520841/Slayerbound" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.playNow}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/en/about" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/en/privacy-policy" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.privacyPolicy}
                  </Link>
                </li>
                <li>
                  <Link href="/en/terms-of-service" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.termsOfService}
                  </Link>
                </li>
                <li>
                  <Link href="/en/copyright" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    Copyright
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
