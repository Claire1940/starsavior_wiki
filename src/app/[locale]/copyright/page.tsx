import type { Metadata } from "next";
import { buildLanguageAlternates } from "@/lib/i18n-utils";
import { type Locale } from "@/i18n/routing";
import {
  CONTACT_EMAILS,
  LAST_UPDATED,
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
  const path = "/copyright";
  const title = `Copyright Notice - ${SITE_NAME}`;
  const description = `Copyright, attribution, and DMCA policy for ${SITE_NAME}, including how to report infringement involving ${SITE_BRAND_NAME} fan-site content.`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "copyright notice",
      `${SITE_BRAND_NAME} Wiki copyright`,
      "DMCA policy",
      "fair use notice",
      "content attribution",
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

export default function Copyright() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Copyright Notice
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Ownership, attribution, and takedown procedures for {SITE_NAME}.
          </p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Site Content</h2>
            <p>
              © 2026 {SITE_NAME}. Unless otherwise stated, original text,
              layout, article organization, and other original site materials
              are owned by {SITE_NAME} and protected by applicable copyright
              law.
            </p>

            <h2>2. Game Assets and Trademarks</h2>
            <p>
              {SITE_NAME} is an unofficial fan-made website. {SITE_BRAND_NAME}{" "}
              names, logos, characters, screenshots, promotional artwork, and
              other related assets are the property of their respective owners.
            </p>
            <p>
              References to game assets are used for commentary, identification,
              educational explanation, and fan-site resource purposes only.
            </p>

            <h2>3. Attribution and Limited Reuse</h2>
            <p>
              You may quote brief portions of our original editorial content
              with clear attribution to {SITE_NAME} and a working link to{" "}
              {SITE_URL}. Republishing full articles, copying page layouts at
              scale, or repackaging site content without permission is
              prohibited.
            </p>

            <h2>4. Fair Use Position</h2>
            <p>
              We believe our use of game-related references and imagery
              qualifies as limited fair use or analogous nominative use for
              informational and commentary purposes. If you believe any material
              should be removed or credited differently, contact us and we will
              review it promptly.
            </p>

            <h2>5. DMCA / Infringement Claims</h2>
            <p>
              If you believe copyrighted material on {SITE_NAME} infringes your
              rights, send a notice including:
            </p>
            <ul>
              <li>Your name and contact information.</li>
              <li>A description of the copyrighted work.</li>
              <li>The exact URL or material you believe is infringing.</li>
              <li>
                A statement of good-faith belief that the use is unauthorized.
              </li>
              <li>
                A statement that the notice is accurate and that you are
                authorized to act.
              </li>
            </ul>

            <h2>6. Counter-Notice</h2>
            <p>
              If material you submitted was removed and you believe that removal
              was in error, you may send a counter-notice with the relevant
              details and supporting statement of good-faith belief.
            </p>

            <h2>7. Contact</h2>
            <p>
              Copyright and DMCA requests can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAILS.dmca}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {CONTACT_EMAILS.dmca}
              </a>
              . General copyright questions can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAILS.copyright}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {CONTACT_EMAILS.copyright}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
