"use client";

import { MouseEvent, useEffect, useState } from "react";
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  CalendarDays,
  Check,
  Coins,
  Copy,
  Crown,
  Crosshair,
  Gem,
  Gift,
  Globe,
  MessageCircle,
  MessagesSquare,
  Newspaper,
  Orbit,
  RotateCcw,
  ScrollText,
  Shield,
  Skull,
  Smartphone,
  Sparkles,
  Sword,
  Target,
  Trophy,
  Users,
  Youtube,
} from "lucide-react";
import { useMessages } from "next-intl";
import HeroStats from "@/components/home/HeroStats";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import { VideoFeature } from "@/components/home/VideoFeature";
import { AdBanner, NativeBannerAd } from "@/components/ads";
import fallbackMessages from "@/locales/en.json";
import {
  OFFICIAL_LINKS,
  ORGANIZATION_SAME_AS,
  SITE_HERO_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const moduleIcons = [
  Gift,
  Trophy,
  BookOpen,
  RotateCcw,
  Gem,
  Users,
  Sword,
  Shield,
  CalendarDays,
  Coins,
  ScrollText,
  Orbit,
  Skull,
  Crown,
  Target,
  Archive,
] as const;

const officialIcons = [
  Globe,
  Newspaper,
  Smartphone,
  MessagesSquare,
  Youtube,
  MessageCircle,
] as const;

type AnyRecord = Record<string, any>;

function resolveHomepageMessages(messages: AnyRecord) {
  if (Array.isArray(messages?.homepage?.modules)) {
    return messages;
  }

  return fallbackMessages as AnyRecord;
}

function SectionShell({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      className={`px-4 py-16 md:py-20 ${muted ? "bg-white/[0.02]" : ""}`}
    >
      <div className="container mx-auto">{children}</div>
    </section>
  );
}

export default function HomePage() {
  const localeMessages = useMessages() as AnyRecord;
  const t = resolveHomepageMessages(localeMessages);
  const modules = t.homepage.modules as AnyRecord[];
  const officialItems = t.homepage.officialLinks.items as AnyRecord[];
  const codeRows = t.homepage.codesTable.items as AnyRecord[];
  const siteUrl = SITE_URL;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const targets = document.querySelectorAll(".scroll-reveal");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 1800);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();

    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: t.seo.home.description,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        description: t.seo.home.description,
        logo: {
          "@type": "ImageObject",
          url: SITE_HERO_IMAGE,
          width: 768,
          height: 432,
        },
        image: {
          "@type": "ImageObject",
          url: SITE_HERO_IMAGE,
          width: 768,
          height: 432,
          caption: `${SITE_NAME} hero artwork`,
        },
        sameAs: ORGANIZATION_SAME_AS,
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative isolate overflow-hidden px-4 pb-20 pt-12 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--nav-theme-light)/0.2),transparent_38%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]" />
        <div className="absolute left-[-8rem] top-8 h-56 w-56 rounded-full bg-[hsl(var(--nav-theme)/0.18)] blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-64 w-64 rounded-full bg-[hsl(var(--nav-theme-light)/0.16)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[hsl(var(--nav-theme)/0.12)] blur-3xl" />

        <div className="container relative z-10 mx-auto">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[hsl(var(--nav-theme)/0.18)] bg-white/[0.03] px-6 py-10 shadow-[0_0_0_1px_hsl(var(--nav-theme)/0.05),0_30px_120px_hsl(var(--nav-theme)/0.12)] backdrop-blur md:px-10 md:py-14">
            <div className="mx-auto max-w-4xl text-center">
              <div className="scroll-reveal inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.28)] bg-[hsl(var(--nav-theme)/0.12)] px-4 py-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="scroll-reveal mt-8 text-5xl font-bold tracking-tight md:text-7xl">
                {t.hero.title}
              </h1>

              <p className="scroll-reveal mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                {t.hero.description}
              </p>

              <div className="scroll-reveal mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={OFFICIAL_LINKS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--nav-theme))] px-7 py-4 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <Globe className="h-5 w-5" />
                  {t.hero.getFreeCodesCTA}
                </a>
                <a
                  href={OFFICIAL_LINKS.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.22)] bg-white/[0.04] px-7 py-4 text-base font-semibold transition-colors hover:bg-white/[0.08]"
                >
                  <ArrowUpRight className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  {t.hero.playOnRobloxCTA}
                </a>
              </div>
            </div>

            <div className="mt-12">
              <HeroStats
                stats={[
                  {
                    value: t.hero.stats.stat1.value,
                    label: t.hero.stats.stat1.label,
                  },
                  {
                    value: t.hero.stats.stat2.value,
                    label: t.hero.stats.stat2.label,
                  },
                  {
                    value: t.hero.stats.stat3.value,
                    label: t.hero.stats.stat3.label,
                  },
                  {
                    value: t.hero.stats.stat4.value,
                    label: t.hero.stats.stat4.label,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      <SectionShell>
        <div className="scroll-reveal">
          <div className="relative overflow-hidden rounded-[2rem] border border-[hsl(var(--nav-theme)/0.18)] bg-white/[0.03] p-3 shadow-[0_24px_80px_hsl(var(--nav-theme)/0.12)] backdrop-blur">
            <VideoFeature
              videoId="iSAUnYJX3-Q"
              title="[StarSavior] Official Animation PV"
              posterImage="/images/hero.webp"
            />
            <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-b-[1.55rem] bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 pb-8 pt-24 md:px-10">
              <p className="text-sm uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                Official PV
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                {t.gameFeature.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base text-white/70 md:text-lg">
                {t.gameFeature.description}
              </p>
            </div>
          </div>
        </div>
      </SectionShell>

      <div className="py-6">
        <AdBanner
          type="banner-320x50"
          adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50}
        />
      </div>

      <SectionShell muted>
        <div className="mb-10 text-center">
          <h2 className="scroll-reveal text-4xl font-bold md:text-5xl">
            {t.homepage.navigation.title}{" "}
            <span className="text-[hsl(var(--nav-theme-light))]">
              {t.homepage.navigation.titleHighlight}
            </span>
          </h2>
          <p className="scroll-reveal mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            {t.homepage.navigation.description}
          </p>
        </div>

        <div className="scroll-reveal mb-8 flex gap-3 overflow-x-auto pb-2">
          {modules.map((module, index) => (
            <a
              key={`${module.id}-pill`}
              href={`#${module.id}`}
              onClick={(event) => scrollToSection(event, module.id)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-white/[0.04] px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-[hsl(var(--nav-theme)/0.4)] hover:text-foreground"
            >
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.homepage.labels.pillPrefix}
              </span>
              <span>{modules[index].titleHighlight}</span>
            </a>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((module, index) => {
            const Icon = moduleIcons[index];

            return (
              <a
                key={module.id}
                href={`#${module.id}`}
                onClick={(event) => scrollToSection(event, module.id)}
                className="scroll-reveal group rounded-[1.75rem] border border-[hsl(var(--nav-theme)/0.16)] bg-white/[0.04] p-6 transition-all hover:-translate-y-1 hover:border-[hsl(var(--nav-theme)/0.42)] hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.2)] bg-[hsl(var(--nav-theme)/0.12)]">
                    <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[hsl(var(--nav-theme-light))]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">
                  {module.title} {module.titleHighlight}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {module.summary}
                </p>
              </a>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="mb-10 text-center">
          <h2 className="scroll-reveal text-4xl font-bold md:text-5xl">
            {t.homepage.officialLinks.title}{" "}
            <span className="text-[hsl(var(--nav-theme-light))]">
              {t.homepage.officialLinks.titleHighlight}
            </span>
          </h2>
          <p className="scroll-reveal mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            {t.homepage.officialLinks.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {officialItems.map((item, index) => {
            const Icon = officialIcons[index];

            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="scroll-reveal group rounded-[1.75rem] border border-[hsl(var(--nav-theme)/0.16)] bg-white/[0.04] p-6 transition-all hover:-translate-y-1 hover:border-[hsl(var(--nav-theme)/0.42)] hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.2)] bg-[hsl(var(--nav-theme)/0.12)]">
                    <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[hsl(var(--nav-theme-light))]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </a>
            );
          })}
        </div>
      </SectionShell>

      <div className="py-6">
        <AdBanner
          type="banner-468x60"
          adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        />
      </div>

      {modules.map((module, index) => {
        const Icon = moduleIcons[index];
        const isCodesModule = module.id === "star-savior-codes";

        return (
          <SectionShell key={module.id} muted={index % 2 === 1}>
            <div
              id={module.id}
              className="scroll-mt-24 rounded-[2rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.03] p-6 shadow-[0_20px_80px_hsl(var(--nav-theme)/0.08)] backdrop-blur md:p-8"
            >
              <div className="scroll-reveal flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.22)] bg-[hsl(var(--nav-theme)/0.12)] px-4 py-2 text-sm font-medium text-muted-foreground">
                      <Icon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                      {module.badge}
                    </span>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground">
                      {t.homepage.labels.lastChecked}: {module.lastChecked}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold md:text-5xl">
                    {module.title}{" "}
                    <span className="text-[hsl(var(--nav-theme-light))]">
                      {module.titleHighlight}
                    </span>
                  </h2>

                  <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    {module.summary}
                  </p>
                </div>

                <a
                  href={module.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.22)] bg-[hsl(var(--nav-theme)/0.12)] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[hsl(var(--nav-theme)/0.2)]"
                >
                  {module.ctaLabel}
                  <ArrowUpRight className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                </a>
              </div>

              {isCodesModule ? (
                <div className="scroll-reveal mt-8 overflow-hidden rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <thead>
                        <tr className="border-b border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)]">
                          <th className="px-5 py-4 text-left text-sm font-semibold">
                            {t.homepage.codesTable.headers.code}
                          </th>
                          <th className="px-5 py-4 text-left text-sm font-semibold">
                            {t.homepage.codesTable.headers.reward}
                          </th>
                          <th className="px-5 py-4 text-left text-sm font-semibold">
                            {t.homepage.codesTable.headers.status}
                          </th>
                          <th className="px-5 py-4 text-left text-sm font-semibold">
                            {t.homepage.codesTable.headers.action}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {codeRows.map((row) => (
                          <tr
                            key={row.code}
                            className="border-b border-[hsl(var(--nav-theme)/0.08)] last:border-b-0"
                          >
                            <td className="px-5 py-4 font-mono text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
                              {row.code}
                            </td>
                            <td className="px-5 py-4 text-sm text-muted-foreground">
                              {row.reward}
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-full border border-[hsl(var(--nav-theme)/0.2)] bg-[hsl(var(--nav-theme)/0.12)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                                {row.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                type="button"
                                onClick={() => copyCode(row.code)}
                                className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.2)] bg-white/[0.05] px-4 py-2 text-sm font-medium transition-colors hover:bg-white/[0.09]"
                              >
                                {copiedCode === row.code ? (
                                  <>
                                    <Check className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                                    {t.homepage.labels.copied}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                                    {t.homepage.labels.copy}
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
              ) : null}

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {module.cards.map((card: AnyRecord, cardIndex: number) => (
                  <div
                    key={`${module.id}-${card.title}`}
                    className={`scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6 ${
                      cardIndex === 1 ? "lg:-translate-y-2" : ""
                    }`}
                  >
                    <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--nav-theme-light))]">
                      {card.title}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {card.items.map((item: string) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--nav-theme-light))]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="scroll-reveal mt-8 flex flex-wrap gap-3">
                {module.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[hsl(var(--nav-theme)/0.16)] bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </SectionShell>
        );
      })}

      <div className="py-6">
        <AdBanner
          type="banner-300x250"
          adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        />
      </div>

      <FAQSection
        title={t.faq.title}
        titleHighlight={t.faq.titleHighlight}
        subtitle={t.faq.subtitle}
        questions={t.faq.questions}
      />

      <CTASection
        title={t.cta.title}
        description={t.cta.description}
        joinCommunity={t.cta.joinCommunity}
        joinGame={t.cta.joinGame}
      />

      <footer className="border-t border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.02] px-4 py-14">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">{t.footer.title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--nav-theme-light))]">
              {t.footer.officialLinksTitle}
            </h3>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <a
                href={OFFICIAL_LINKS.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-foreground"
              >
                {t.footer.website}
              </a>
              <a
                href={OFFICIAL_LINKS.news}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-foreground"
              >
                {t.footer.news}
              </a>
              <a
                href={OFFICIAL_LINKS.googlePlay}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-foreground"
              >
                {t.footer.googlePlay}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--nav-theme-light))]">
              {t.footer.communityLinksTitle}
            </h3>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <a
                href={OFFICIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-foreground"
              >
                {t.footer.discord}
              </a>
              <a
                href={OFFICIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-foreground"
              >
                {t.footer.youtube}
              </a>
              <a
                href={OFFICIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-foreground"
              >
                {t.footer.x}
              </a>
              <a
                href={OFFICIAL_LINKS.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-foreground"
              >
                {t.footer.reddit}
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-10 border-t border-[hsl(var(--nav-theme)/0.14)] pt-6 text-sm text-muted-foreground">
          {t.footer.copyright}
        </div>
      </footer>
    </div>
  );
}
