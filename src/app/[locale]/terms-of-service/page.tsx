import type { Metadata } from "next";
import { buildLanguageAlternates } from "@/lib/i18n-utils";
import { type Locale } from "@/i18n/routing";
import {
  CONTACT_EMAILS,
  LAST_UPDATED,
  SITE_BRAND_NAME,
  SITE_DOMAIN,
  SITE_HERO_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "/terms-of-service";
  const title = `Terms of Service - ${SITE_NAME}`;
  const description = `Terms of Service for ${SITE_NAME}, including acceptable use, intellectual property, disclaimers, and contact information for ${SITE_DOMAIN}.`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "terms of service",
      `${SITE_BRAND_NAME} Wiki terms`,
      `${SITE_BRAND_NAME} site terms`,
      "acceptable use policy",
      "website disclaimer",
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

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Terms and conditions for using {SITE_NAME}.
          </p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using {SITE_NAME}, you agree to these Terms of
              Service and our Privacy Policy. If you do not agree, do not use
              the site.
            </p>

            <h2>2. About the Website</h2>
            <p>
              {SITE_NAME} is an unofficial fan-made resource website focused on
              guides, links, and informational content related to{" "}
              {SITE_BRAND_NAME}. We are not the official game operator,
              publisher, or developer.
            </p>

            <h2>3. Acceptable Use</h2>
            <ul>
              <li>Use the site only for lawful purposes.</li>
              <li>
                Do not interfere with the site&apos;s operation, security, or
                availability.
              </li>
              <li>
                Do not attempt to scrape, mirror, or exploit the site in a
                harmful or abusive way.
              </li>
              <li>
                Do not post or transmit unlawful, infringing, abusive, or
                misleading material through the site.
              </li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              Original site content on {SITE_NAME}, including our written
              guides, layout, and branding, is protected by applicable copyright
              and intellectual property laws.
            </p>
            <p>
              {SITE_BRAND_NAME} names, logos, characters, screenshots, and other
              game-related assets belong to their respective owners. They are
              referenced here for commentary, informational, and community
              resource purposes only.
            </p>

            <h2>5. Accuracy and Availability</h2>
            <p>
              We try to keep content accurate and current, but {SITE_NAME} is
              provided on an &quot;as is&quot; and &quot;as available&quot;
              basis. Game updates, regional differences, and third-party
              platform changes can make information outdated or incomplete.
            </p>

            <h2>6. External Services and Links</h2>
            <p>
              The website may link to third-party services such as the official{" "}
              {SITE_BRAND_NAME} website, Google Play, Discord, X, YouTube,
              Reddit, and analytics or advertising providers. We are not
              responsible for the availability, content, or policies of
              third-party services.
            </p>

            <h2>7. No Official Affiliation</h2>
            <p>
              {SITE_NAME} is an independent fan project and is not affiliated
              with, endorsed by, or sponsored by the official publishers or
              developers of {SITE_BRAND_NAME}.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {SITE_NAME} and its
              operators are not liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of, or
              inability to use, the site.
            </p>

            <h2>9. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of the site after changes become effective means you accept
              the revised terms.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms are governed by applicable law without regard to
              conflict of law principles, except where mandatory local consumer
              protections apply.
            </p>

            <h2>11. Contact</h2>
            <p>
              Legal questions about these terms can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAILS.legal}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {CONTACT_EMAILS.legal}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
