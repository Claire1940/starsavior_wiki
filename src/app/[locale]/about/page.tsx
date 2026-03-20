import type { Metadata } from "next";
import { buildLanguageAlternates } from "@/lib/i18n-utils";
import { type Locale } from "@/i18n/routing";
import {
  CONTACT_EMAILS,
  LAST_UPDATED,
  OFFICIAL_LINKS,
  SITE_BRAND_NAME,
  SITE_HERO_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "/about";
  const title = `About ${SITE_NAME}`;
  const description = `Learn about ${SITE_NAME}, an unofficial fan-made guide hub covering ${SITE_BRAND_NAME} codes, reroll planning, tier lists, beginner tips, and launch updates.`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      `about ${SITE_NAME}`,
      `${SITE_BRAND_NAME} community wiki`,
      `${SITE_BRAND_NAME} guide hub`,
      `${SITE_BRAND_NAME} fan site`,
      `${SITE_BRAND_NAME} resources`,
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale,
      url:
        locale === "en" ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: SITE_HERO_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_HERO_IMAGE],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, SITE_URL),
  };
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About {SITE_NAME}
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            A fan-made resource hub built for players following the global
            launch of {SITE_BRAND_NAME}.
          </p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>What We Cover</h2>
            <p>
              {SITE_NAME} is an unofficial fan-made website focused on practical
              information for {SITE_BRAND_NAME}
              players. The site prioritizes high-intent topics such as codes,
              reroll decisions, tier lists, beginner progression, character
              planning, and official launch updates.
            </p>

            <h2>Why This Site Exists</h2>
            <p>
              {SITE_BRAND_NAME} launched globally on March 19, 2026, and the
              early search demand around reroll, beginner setup, download links,
              and official announcements moved faster than generic community
              resources. This site exists to consolidate those essentials into a
              cleaner, easier-to-browse reference point.
            </p>

            <h2>Editorial Approach</h2>
            <ul>
              <li>We prioritize official links whenever possible.</li>
              <li>
                We separate confirmed information from community inference.
              </li>
              <li>We update summaries when launch-era details change.</li>
              <li>
                We keep navigation focused on search-driven player questions.
              </li>
            </ul>

            <h2>What We Link To</h2>
            <p>
              Where relevant, we direct players to the official{" "}
              {SITE_BRAND_NAME} channels:
            </p>
            <ul>
              <li>
                Official website:{" "}
                <a
                  href={OFFICIAL_LINKS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {OFFICIAL_LINKS.website}
                </a>
              </li>
              <li>
                Official news:{" "}
                <a
                  href={OFFICIAL_LINKS.news}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {OFFICIAL_LINKS.news}
                </a>
              </li>
              <li>
                Official Discord:{" "}
                <a
                  href={OFFICIAL_LINKS.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {OFFICIAL_LINKS.discord}
                </a>
              </li>
              <li>
                Official X:{" "}
                <a
                  href={OFFICIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {OFFICIAL_LINKS.x}
                </a>
              </li>
              <li>
                Official YouTube:{" "}
                <a
                  href={OFFICIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {OFFICIAL_LINKS.youtube}
                </a>
              </li>
            </ul>

            <h2>Unofficial Project Notice</h2>
            <p>
              {SITE_NAME} is not affiliated with, endorsed by, or operated by
              the official publishers or developers of {SITE_BRAND_NAME}. All
              game trademarks, artwork, and other assets remain the property of
              their respective owners.
            </p>

            <h2>Contact</h2>
            <ul>
              <li>
                General inquiries:{" "}
                <a
                  href={`mailto:${CONTACT_EMAILS.contact}`}
                  className="text-[hsl(var(--nav-theme-light))] hover:underline"
                >
                  {CONTACT_EMAILS.contact}
                </a>
              </li>
              <li>
                Support:{" "}
                <a
                  href={`mailto:${CONTACT_EMAILS.support}`}
                  className="text-[hsl(var(--nav-theme-light))] hover:underline"
                >
                  {CONTACT_EMAILS.support}
                </a>
              </li>
              <li>
                Contributions:{" "}
                <a
                  href={`mailto:${CONTACT_EMAILS.contribute}`}
                  className="text-[hsl(var(--nav-theme-light))] hover:underline"
                >
                  {CONTACT_EMAILS.contribute}
                </a>
              </li>
              <li>
                Partnerships:{" "}
                <a
                  href={`mailto:${CONTACT_EMAILS.partnerships}`}
                  className="text-[hsl(var(--nav-theme-light))] hover:underline"
                >
                  {CONTACT_EMAILS.partnerships}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
