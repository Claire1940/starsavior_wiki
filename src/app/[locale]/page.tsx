"use client";

import { setRequestLocale } from 'next-intl/server'
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
import { AdBanner, NativeBannerAd, SidebarAd } from "@/components/ads";
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

const detailCardIcons = [
  ScrollText,
  Crosshair,
  Shield,
  Sword,
  Gem,
  Trophy,
  Orbit,
  Crown,
  CalendarDays,
  Coins,
  Boxes,
  Archive,
] as const;

const roleTabIcons = [Crosshair, Shield, Sparkles] as const;
const teamCardIcons = [Shield, Target, Sword, Crown] as const;
const buildEntryIcons = [Sword, Crosshair, Sparkles] as const;
const buildDetailIcons = [Target, Boxes, Gem, ScrollText] as const;
const gearPanelIcons = [Boxes, Coins, Archive] as const;
const progressionTimelineIcons = [CalendarDays, Gift, Sword, Archive] as const;
const sidePanelIcons = [Check, Crown, Orbit, Coins] as const;
const gachaCompareIcons = [Coins, Gem] as const;
const databaseFilterIcons = [Crown, Users, Orbit] as const;
const rosterIcons = [
  Shield,
  Sword,
  Crosshair,
  Sparkles,
  Target,
  Gem,
  Trophy,
  ScrollText,
  CalendarDays,
  Coins,
  Boxes,
  Archive,
] as const;
const journeyStepIcons = [Target, ScrollText, RotateCcw, Archive] as const;
const bossMechanicIcons = [Shield, Crosshair, Sword] as const;
const bossTagPanelIcons = [Users, Trophy] as const;
const hardModeTeamIcons = [Sword, Orbit] as const;
const hardModeCharmIcons = [Crosshair, Shield, Sparkles] as const;
const pvpColumnIcons = [Sword, Shield] as const;
const pvpLineupIcons = [Target, Crown, Skull, Gem, Orbit, Crosshair] as const;
const resourceDoDontIcons = [Check, RotateCcw] as const;
const resourceShopIcons = [Gift, Coins, Boxes, Archive] as const;

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
  const [activeRoleTabByModule, setActiveRoleTabByModule] = useState<
    Record<string, string>
  >({});
  const [activeBuildByModule, setActiveBuildByModule] = useState<
    Record<string, string>
  >({});

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

  const renderStandardCards = (module: AnyRecord, moduleIndex: number) => {
    if (!Array.isArray(module.cards)) {
      return null;
    }

    return (
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {module.cards.map((card: AnyRecord, cardIndex: number) => {
          const CardIcon =
            detailCardIcons[
              (moduleIndex * 3 + cardIndex) % detailCardIcons.length
            ];

          return (
            <div
              key={`${module.id}-${card.title}`}
              className={`scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6 ${
                cardIndex === 1 ? "lg:-translate-y-2" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                  <CardIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--nav-theme-light))]">
                  {card.title}
                </p>
              </div>

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
          );
        })}
      </div>
    );
  };

  const renderModuleContent = (module: AnyRecord, moduleIndex: number) => {
    if (module.displayType === "tierRowsWithRoleTabs") {
      const roleTabs = Array.isArray(module.roleTabs) ? module.roleTabs : [];
      const tierGroups = Array.isArray(module.tierGroups) ? module.tierGroups : [];
      const activeRoleId = activeRoleTabByModule[module.id] ?? roleTabs[0]?.id;
      const activeRole =
        roleTabs.find((tab: AnyRecord) => tab.id === activeRoleId) ?? roleTabs[0];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6">
              <div className="flex flex-wrap gap-3">
                {roleTabs.map((tab: AnyRecord, tabIndex: number) => {
                  const Icon = roleTabIcons[tabIndex % roleTabIcons.length];
                  const isActive = activeRole?.id === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveRoleTabByModule((current) => ({
                          ...current,
                          [module.id]: tab.id,
                        }))
                      }
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-[hsl(var(--nav-theme)/0.36)] bg-[hsl(var(--nav-theme)/0.14)] text-foreground"
                          : "border-[hsl(var(--nav-theme)/0.16)] bg-white/[0.03] text-muted-foreground hover:border-[hsl(var(--nav-theme)/0.32)] hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {tierGroups.map((group: AnyRecord, groupIndex: number) => {
                const GroupIcon =
                  buildDetailIcons[groupIndex % buildDetailIcons.length];

                return (
                  <div
                    key={`${module.id}-${group.title}`}
                    className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                        <GroupIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--nav-theme-light))]">
                        {group.title}
                      </p>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {group.items.map((item: string) => (
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
                );
              })}
            </div>
          </div>

          {activeRole ? (
            <div className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--nav-theme-light))]">
                {t.homepage.labels.roleFocus}
              </p>
              <h3 className="mt-4 text-2xl font-semibold">{activeRole.label}</h3>
              <p className="mt-3 text-lg font-medium text-foreground">
                {activeRole.priority}
              </p>

              <ul className="mt-5 space-y-3">
                {activeRole.notes.map((item: string) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--nav-theme-light))]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {module.spotlight ? (
                <div className="mt-6 rounded-[1.25rem] border border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <Boxes className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {module.spotlight.title}
                    </p>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {module.spotlight.items.map((item: string) => (
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
              ) : null}
            </div>
          ) : null}
        </div>
      );
    }

    if (module.displayType === "formationCardsGrid") {
      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {module.teamCards.map((team: AnyRecord, teamIndex: number) => {
            const TeamIcon = teamCardIcons[teamIndex % teamCardIcons.length];

            return (
              <article
                key={`${module.id}-${team.title}`}
                className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <TeamIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{team.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t.homepage.labels.bestAgainst}: {team.bestAgainst}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] p-5">
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {t.homepage.labels.frontLine}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {team.frontLine.map((unit: string) => (
                        <li
                          key={unit}
                          className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--nav-theme-light))]" />
                          <span>{unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.25rem] border border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] p-5">
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {t.homepage.labels.backLine}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {team.backLine.map((unit: string) => (
                        <li
                          key={unit}
                          className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--nav-theme-light))]" />
                          <span>{unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {team.notes.map((item: string) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--nav-theme-light))]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      );
    }

    if (module.displayType === "buildCardsWithDrawer") {
      const buildEntries = Array.isArray(module.buildEntries)
        ? module.buildEntries
        : [];
      const activeBuildId =
        activeBuildByModule[module.id] ?? buildEntries[0]?.id;
      const activeBuild =
        buildEntries.find((entry: AnyRecord) => entry.id === activeBuildId) ??
        buildEntries[0];

      return (
        <>
          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {buildEntries.map((entry: AnyRecord, entryIndex: number) => {
              const EntryIcon = buildEntryIcons[entryIndex % buildEntryIcons.length];
              const isActive = activeBuild?.id === entry.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() =>
                    setActiveBuildByModule((current) => ({
                      ...current,
                      [module.id]: entry.id,
                    }))
                  }
                  className={`scroll-reveal rounded-[1.5rem] border p-6 text-left transition-all ${
                    isActive
                      ? "border-[hsl(var(--nav-theme)/0.36)] bg-[hsl(var(--nav-theme)/0.1)] shadow-[0_24px_80px_hsl(var(--nav-theme)/0.08)]"
                      : "border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] hover:border-[hsl(var(--nav-theme)/0.28)] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <EntryIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                      {entry.identity}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">{entry.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {entry.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {activeBuild ? (
            <div className="scroll-reveal mt-6 rounded-[1.75rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6 shadow-[0_24px_80px_hsl(var(--nav-theme)/0.08)] backdrop-blur md:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--nav-theme-light))]">
                    {t.homepage.labels.activeBuild}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold md:text-4xl">
                    {activeBuild.name}
                  </h3>
                  <p className="mt-3 inline-flex rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)] px-4 py-2 text-sm text-muted-foreground">
                    {activeBuild.identity}
                  </p>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    {activeBuild.summary}
                  </p>
                </div>

                <a
                  href={activeBuild.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.22)] bg-[hsl(var(--nav-theme)/0.12)] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[hsl(var(--nav-theme)/0.2)]"
                >
                  {t.homepage.labels.buildSource}
                  <ArrowUpRight className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                </a>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {activeBuild.detailGroups.map(
                  (group: AnyRecord, groupIndex: number) => {
                    const GroupIcon =
                      buildDetailIcons[groupIndex % buildDetailIcons.length];

                    return (
                      <div
                        key={`${activeBuild.id}-${group.title}`}
                        className="rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] p-5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                            <GroupIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                          </div>
                          <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                            {group.title}
                          </p>
                        </div>

                        <ul className="mt-4 space-y-3">
                          {group.items.map((item: string) => (
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
                    );
                  },
                )}
              </div>
            </div>
          ) : null}
        </>
      );
    }

    if (module.displayType === "priorityTableWithTags") {
      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="scroll-reveal overflow-hidden rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)]">
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Slot
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      {t.homepage.labels.mainStat}
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      {t.homepage.labels.upgradePriority}
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      {t.homepage.labels.whyItMatters}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {module.priorityRows.map((row: AnyRecord) => (
                    <tr
                      key={row.slot}
                      className="border-b border-[hsl(var(--nav-theme)/0.08)] last:border-b-0"
                    >
                      <td className="px-5 py-4 font-semibold">{row.slot}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {row.mainStat}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-[hsl(var(--nav-theme)/0.2)] bg-[hsl(var(--nav-theme)/0.12)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {row.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            {module.spotlight ? (
              <div className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                    <Boxes className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                    {module.spotlight.title}
                  </p>
                </div>

                <ul className="mt-5 space-y-3">
                  {module.spotlight.items.map((item: string) => (
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
            ) : null}

            {[module.farmTags, module.mistakeTags].map(
              (items: string[], panelIndex: number) => {
                const PanelIcon = gearPanelIcons[panelIndex + 1];
                const title =
                  panelIndex === 0
                    ? t.homepage.labels.farmOrder
                    : t.homepage.labels.commonMistakes;

                return (
                  <div
                    key={`${module.id}-${title}`}
                    className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                        <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                        {title}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {items.map((item: string) => (
                        <span
                          key={item}
                          className="rounded-full border border-[hsl(var(--nav-theme)/0.16)] bg-[hsl(var(--nav-theme)/0.08)] px-4 py-2 text-sm text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      );
    }

    if (module.displayType === "timeline_cards") {
      const timeline = Array.isArray(module.timeline) ? module.timeline : [];
      const sidePanels = Array.isArray(module.sidePanels) ? module.sidePanels : [];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            {timeline.map((entry: AnyRecord, entryIndex: number) => {
              const EntryIcon =
                progressionTimelineIcons[
                  entryIndex % progressionTimelineIcons.length
                ];

              return (
                <article
                  key={`${module.id}-${entry.range}`}
                  className="scroll-reveal relative overflow-hidden rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-[hsl(var(--nav-theme-light)/0.65)]" />

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <EntryIcon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                          {entry.range}
                        </span>
                        <p className="text-sm font-medium text-foreground/80">
                          {entry.focus}
                        </p>
                      </div>

                      <ul className="mt-5 space-y-3">
                        {entry.items.map((item: string) => (
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
                  </div>
                </article>
              );
            })}
          </div>

          <div className="space-y-4">
            {sidePanels.map((panel: AnyRecord, panelIndex: number) => {
              const PanelIcon = sidePanelIcons[panelIndex % sidePanelIcons.length];

              return (
                <div
                  key={`${module.id}-${panel.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {panel.title}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {panel.items.map((item: string) => (
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
              );
            })}
          </div>
        </div>
      );
    }

    if (module.displayType === "accordion_compare_table") {
      const compareCards = Array.isArray(module.compareCards)
        ? module.compareCards
        : [];
      const factRows = Array.isArray(module.factRows) ? module.factRows : [];
      const sidePanels = Array.isArray(module.sidePanels) ? module.sidePanels : [];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {compareCards.map((card: AnyRecord, cardIndex: number) => {
                const CardIcon =
                  gachaCompareIcons[cardIndex % gachaCompareIcons.length];

                return (
                  <article
                    key={`${module.id}-${card.title}`}
                    className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                          <CardIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{card.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {card.badge}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-base font-medium text-foreground">
                      {card.headline}
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
                  </article>
                );
              })}
            </div>

            <div className="scroll-reveal overflow-hidden rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04]">
              <div className="border-b border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] px-5 py-4">
                <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                  {module.tableTitle}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[hsl(var(--nav-theme)/0.14)]">
                      {module.tableColumns.map((column: string) => (
                        <th
                          key={column}
                          className="px-5 py-4 text-left text-sm font-semibold"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {factRows.map((row: AnyRecord) => (
                      <tr
                        key={row.label}
                        className="border-b border-[hsl(var(--nav-theme)/0.08)] last:border-b-0"
                      >
                        <td className="px-5 py-4 font-semibold">{row.label}</td>
                        <td className="px-5 py-4 text-sm text-[hsl(var(--nav-theme-light))]">
                          {row.value}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {row.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sidePanels.map((panel: AnyRecord, panelIndex: number) => {
              const PanelIcon = sidePanelIcons[(panelIndex + 1) % sidePanelIcons.length];

              return (
                <div
                  key={`${module.id}-${panel.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {panel.title}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {panel.items.map((item: string) => (
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
              );
            })}
          </div>
        </div>
      );
    }

    if (module.displayType === "database_grid_filters") {
      const filterGroups = Array.isArray(module.filterGroups)
        ? module.filterGroups
        : [];
      const sampleRoster = Array.isArray(module.sampleRoster)
        ? module.sampleRoster
        : [];
      const sidePanels = Array.isArray(module.sidePanels) ? module.sidePanels : [];

      return (
        <div className="mt-8 space-y-4">
          <div className="grid gap-4 xl:grid-cols-3">
            {filterGroups.map((group: AnyRecord, groupIndex: number) => {
              const GroupIcon =
                databaseFilterIcons[groupIndex % databaseFilterIcons.length];

              return (
                <div
                  key={`${module.id}-${group.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <GroupIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {group.title}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {group.items.map((item: string) => (
                      <span
                        key={item}
                        className="rounded-full border border-[hsl(var(--nav-theme)/0.16)] bg-[hsl(var(--nav-theme)/0.08)] px-4 py-2 text-sm text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                    {module.rosterTitle}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {module.rosterDescription}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sampleRoster.map((entry: AnyRecord, entryIndex: number) => {
                  const EntryIcon = rosterIcons[entryIndex % rosterIcons.length];

                  return (
                    <div
                      key={`${module.id}-${entry.name}`}
                      className="rounded-[1.25rem] border border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                          <EntryIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                        </div>
                        <span className="rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                          {entry.identity}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold">{entry.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {entry.focus}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {sidePanels.map((panel: AnyRecord, panelIndex: number) => {
                const PanelIcon = sidePanelIcons[panelIndex % sidePanelIcons.length];

                return (
                  <div
                    key={`${module.id}-${panel.title}`}
                    className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                        <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                        {panel.title}
                      </p>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {panel.items.map((item: string) => (
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
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (module.displayType === "step_diagram_checklist") {
      const steps = Array.isArray(module.steps) ? module.steps : [];
      const sidePanels = Array.isArray(module.sidePanels) ? module.sidePanels : [];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            {steps.map((step: AnyRecord, stepIndex: number) => {
              const StepIcon = journeyStepIcons[stepIndex % journeyStepIcons.length];

              return (
                <article
                  key={`${module.id}-${step.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    <div className="flex items-center gap-4 lg:min-w-56">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                        <StepIcon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--nav-theme-light))]">
                          Step {stepIndex + 1}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm leading-6 text-muted-foreground">
                        {step.description}
                      </p>

                      <ul className="mt-4 space-y-3">
                        {step.items.map((item: string) => (
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
                  </div>
                </article>
              );
            })}
          </div>

          <div className="space-y-4">
            {sidePanels.map((panel: AnyRecord, panelIndex: number) => {
              const PanelIcon = sidePanelIcons[(panelIndex + 2) % sidePanelIcons.length];

              return (
                <div
                  key={`${module.id}-${panel.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {panel.title}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {panel.items.map((item: string) => (
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
              );
            })}
          </div>
        </div>
      );
    }

    if (module.displayType === "boss_mechanics_cards") {
      const mechanics = Array.isArray(module.mechanics) ? module.mechanics : [];
      const sidePanels = Array.isArray(module.sidePanels) ? module.sidePanels : [];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-4">
            {mechanics.map((card: AnyRecord, cardIndex: number) => {
              const CardIcon =
                bossMechanicIcons[cardIndex % bossMechanicIcons.length];

              return (
                <article
                  key={`${module.id}-${card.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <CardIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold">{card.title}</h3>
                        <span className="rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                          {card.cue}
                        </span>
                      </div>

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
                  </div>
                </article>
              );
            })}
          </div>

          <div className="space-y-4">
            {sidePanels.map((panel: AnyRecord, panelIndex: number) => {
              const PanelIcon = sidePanelIcons[(panelIndex + 1) % sidePanelIcons.length];

              return (
                <div
                  key={`${module.id}-${panel.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {panel.title}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {panel.items.map((item: string) => (
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
              );
            })}
          </div>
        </div>
      );
    }

    if (module.displayType === "bossCardsWithMechanicTags") {
      const mechanicCards = Array.isArray(module.mechanicCards)
        ? module.mechanicCards
        : [];
      const tagPanels = Array.isArray(module.tagPanels) ? module.tagPanels : [];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-4">
            {mechanicCards.map((card: AnyRecord, cardIndex: number) => {
              const CardIcon =
                bossMechanicIcons[cardIndex % bossMechanicIcons.length];

              return (
                <article
                  key={`${module.id}-${card.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <CardIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold">{card.title}</h3>
                        <span className="rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                          {card.cue}
                        </span>
                      </div>

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
                  </div>
                </article>
              );
            })}
          </div>

          <div className="space-y-4">
            {tagPanels.map((panel: AnyRecord, panelIndex: number) => {
              const PanelIcon =
                bossTagPanelIcons[panelIndex % bossTagPanelIcons.length];

              return (
                <div
                  key={`${module.id}-${panel.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {panel.title}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {panel.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[hsl(var(--nav-theme)/0.16)] bg-[hsl(var(--nav-theme)/0.08)] px-4 py-2 text-sm text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (module.displayType === "checklistWithTeamCards") {
      const prepChecklist = Array.isArray(module.prepChecklist)
        ? module.prepChecklist
        : [];
      const teamCards = Array.isArray(module.teamCards) ? module.teamCards : [];
      const charmCards = Array.isArray(module.charmCards) ? module.charmCards : [];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <article className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                  <Check className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                  {module.checklistTitle}
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                {prepChecklist.map((item: string) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--nav-theme-light))]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <div className="grid gap-4 lg:grid-cols-2">
              {teamCards.map((team: AnyRecord, teamIndex: number) => {
                const TeamIcon =
                  hardModeTeamIcons[teamIndex % hardModeTeamIcons.length];

                return (
                  <article
                    key={`${module.id}-${team.title}`}
                    className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                        <TeamIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-semibold">{team.title}</h3>
                        <p className="mt-2 rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.08)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                          {team.composition}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {team.items.map((item: string) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--nav-theme-light))]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {charmCards.map((card: AnyRecord, cardIndex: number) => {
              const CardIcon =
                hardModeCharmIcons[cardIndex % hardModeCharmIcons.length];

              return (
                <article
                  key={`${module.id}-${card.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <CardIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold">{card.title}</h3>
                      <p className="mt-2 text-sm font-medium text-foreground/80">
                        {card.role}
                      </p>
                    </div>
                  </div>

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
                </article>
              );
            })}
          </div>
        </div>
      );
    }

    if (module.displayType === "dualColumnLineups") {
      const lineupColumns = Array.isArray(module.lineupColumns)
        ? module.lineupColumns
        : [];
      const sidePanels = Array.isArray(module.sidePanels) ? module.sidePanels : [];

      return (
        <div className="mt-8 space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            {lineupColumns.map((column: AnyRecord, columnIndex: number) => {
              const ColumnIcon =
                pvpColumnIcons[columnIndex % pvpColumnIcons.length];

              return (
                <article
                  key={`${module.id}-${column.id ?? column.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <ColumnIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{column.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {column.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {column.entries.map((entry: AnyRecord, entryIndex: number) => {
                      const EntryIcon =
                        pvpLineupIcons[
                          (columnIndex * 3 + entryIndex) % pvpLineupIcons.length
                        ];

                      return (
                        <div
                          key={`${module.id}-${entry.name}`}
                          className="rounded-[1.25rem] border border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] p-5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                              <EntryIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-lg font-semibold">{entry.name}</h4>
                              <p className="mt-2 rounded-full border border-[hsl(var(--nav-theme)/0.18)] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                                {entry.core}
                              </p>
                            </div>
                          </div>

                          <ul className="mt-4 space-y-3">
                            {entry.notes.map((item: string) => (
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
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          {sidePanels.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {sidePanels.map((panel: AnyRecord, panelIndex: number) => {
                const PanelIcon =
                  sidePanelIcons[(panelIndex + 1) % sidePanelIcons.length];

                return (
                  <div
                    key={`${module.id}-${panel.title}`}
                    className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                        <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                        {panel.title}
                      </p>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {panel.items.map((item: string) => (
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
                );
              })}
            </div>
          ) : null}
        </div>
      );
    }

    if (module.displayType === "priorityTableWithDoDontCards") {
      const tableColumns = Array.isArray(module.tableColumns)
        ? module.tableColumns
        : [];
      const priorityRows = Array.isArray(module.priorityRows)
        ? module.priorityRows
        : [];
      const doList = Array.isArray(module.doList) ? module.doList : [];
      const dontList = Array.isArray(module.dontList) ? module.dontList : [];
      const shopPriorities = Array.isArray(module.shopPriorities)
        ? module.shopPriorities
        : [];

      const actionPanels = [
        {
          title: module.doTitle ?? "Do First",
          items: doList,
        },
        {
          title: module.dontTitle ?? "Avoid First",
          items: dontList,
        },
      ];

      return (
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="scroll-reveal overflow-hidden rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04]">
            <div className="border-b border-[hsl(var(--nav-theme)/0.14)] bg-[hsl(var(--nav-theme)/0.08)] px-5 py-4">
              <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                {module.tableTitle}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[hsl(var(--nav-theme)/0.14)]">
                    {tableColumns.map((column: string) => (
                      <th
                        key={column}
                        className="px-5 py-4 text-left text-sm font-semibold"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {priorityRows.map((row: AnyRecord) => (
                    <tr
                      key={row.lane}
                      className="border-b border-[hsl(var(--nav-theme)/0.08)] last:border-b-0"
                    >
                      <td className="px-5 py-4 font-semibold">{row.lane}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-[hsl(var(--nav-theme)/0.2)] bg-[hsl(var(--nav-theme)/0.12)] px-3 py-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {row.rule}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            {actionPanels.map((panel, panelIndex) => {
              const PanelIcon =
                resourceDoDontIcons[panelIndex % resourceDoDontIcons.length];

              return (
                <div
                  key={`${module.id}-${panel.title}`}
                  className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                      <PanelIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                      {panel.title}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {panel.items.map((item: string) => (
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
              );
            })}

            {shopPriorities.length > 0 ? (
              <div className="scroll-reveal rounded-[1.5rem] border border-[hsl(var(--nav-theme)/0.14)] bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.12)]">
                    <Gift className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[hsl(var(--nav-theme-light))]">
                    {module.shopTitle}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {shopPriorities.map((item: string, itemIndex: number) => {
                    const ChipIcon =
                      resourceShopIcons[itemIndex % resourceShopIcons.length];

                    return (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.16)] bg-[hsl(var(--nav-theme)/0.08)] px-4 py-2 text-sm text-muted-foreground"
                      >
                        <ChipIcon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return renderStandardCards(module, moduleIndex);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部横幅（Sticky）- 全平台显示 */}
      <div className="sticky top-20 z-20 border-b border-border py-2 bg-background/95 backdrop-blur-sm">
        <AdBanner
          type="banner-320x50"
          adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50}
        />
      </div>

      {/* 左侧边栏 Sticky 广告 - 桌面端 */}
      <div className="hidden lg:block fixed left-4 top-24 z-10">
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </div>

      {/* 右侧边栏 Sticky 广告 - 桌面端 */}
      <div className="hidden lg:block fixed right-4 top-24 z-10">
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </div>

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
                  {t.hero.playOnGooglePlayCTA}
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

      {/* 广告位 5: 视频区域下方 728×90 横幅 */}
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
      />

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

      {/* 广告位 6: 导航卡片下方 300×250 方形广告 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
      />

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

      {modules.flatMap((module, index) => {
        const Icon = moduleIcons[index];
        const isCodesModule = module.id === "star-savior-codes";

        const elements = [
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

              {renderModuleContent(module, index)}

              {Array.isArray(module.tags) ? (
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
              ) : null}
            </div>
          </SectionShell>,
        ];

        // 在模块之间插入广告，匹配 wwe2k26 的广告密度（每 1-2 个模块后插入）
        if (index === 0) {
          elements.push(
            <AdBanner key="mid-ad-468x60" type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} className="my-8" />
          );
        }
        if (index === 1) {
          elements.push(
            <AdBanner key="mid-ad-320x50" type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} className="my-8" />
          );
        }
        if (index === 3) {
          elements.push(
            <AdBanner key="mid-ad-300x250" type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} className="my-8" />
          );
        }
        if (index === 5) {
          elements.push(
            <AdBanner key="mid-ad-728x90" type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} className="my-8" />
          );
        }
        if (index === 7) {
          elements.push(
            <AdBanner key="mid-ad-468x60-2" type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} className="my-8" />
          );
        }

        return elements;
      })}

      {/* 广告位 12: 所有模块后 300×250 方形广告 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="my-8"
      />

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
