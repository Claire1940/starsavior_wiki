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
  const path = "/privacy-policy";
  const title = `Privacy Policy - ${SITE_NAME}`;
  const description = `${SITE_NAME} privacy policy explaining analytics, cookies, language preferences, and how visitor data is handled on ${SITE_DOMAIN}.`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "privacy policy",
      `${SITE_BRAND_NAME} Wiki privacy`,
      `${SITE_BRAND_NAME} data policy`,
      "cookie policy",
      "analytics disclosure",
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            How {SITE_NAME} collects, uses, and protects visitor information.
          </p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Scope</h2>
            <p>
              {SITE_NAME} is an unofficial fan-made resource for{" "}
              {SITE_BRAND_NAME}. This Privacy Policy explains what information
              we collect when you browse the site, how that information is used,
              and what choices you have.
            </p>

            <h2>2. Information We Collect</h2>
            <ul>
              <li>
                <strong>Usage data:</strong> Pages viewed, browser type, device
                type, approximate location, referrer, and session timing
                collected through analytics tools.
              </li>
              <li>
                <strong>Local preferences:</strong> Language and theme
                preferences stored in your browser so the site can remember your
                settings.
              </li>
              <li>
                <strong>Technical logs:</strong> Standard server and platform
                logs used for security, uptime monitoring, and troubleshooting.
              </li>
            </ul>
            <p>
              We do not require account creation and we do not knowingly collect
              sensitive personal information to use the public portions of{" "}
              {SITE_NAME}.
            </p>

            <h2>3. How We Use Information</h2>
            <ul>
              <li>To operate, maintain, and improve the website.</li>
              <li>To measure traffic, performance, and content usefulness.</li>
              <li>To remember your interface preferences.</li>
              <li>To detect abuse, spam, fraud, or technical issues.</li>
            </ul>

            <h2>4. Cookies and Analytics</h2>
            <p>
              We may use cookies, local storage, and similar technologies for
              functionality, analytics, and ad delivery. These technologies can
              help us understand which pages are useful and whether the site is
              performing correctly.
            </p>
            <p>
              Third-party analytics or advertising providers may collect data
              according to their own privacy policies. You can usually control
              cookies through your browser settings and related opt-out tools.
            </p>

            <h2>5. Third-Party Links</h2>
            <p>
              {SITE_NAME} links to third-party websites such as the official{" "}
              {SITE_BRAND_NAME} website, Google Play, Discord, X, YouTube,
              Reddit, and other external resources. We do not control those
              websites and are not responsible for their privacy practices or
              content.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain analytics and technical data only as long as reasonably
              necessary for reporting, security, troubleshooting, and
              compliance. Retention periods may vary by provider and platform.
            </p>

            <h2>7. Children&apos;s Privacy</h2>
            <p>
              {SITE_NAME} is not directed to children under 13, and we do not
              knowingly collect personal information from children. If you
              believe a child has provided us with personal information, contact
              us so we can investigate and remove it where appropriate.
            </p>

            <h2>8. International Visitors</h2>
            <p>
              If you access the site from outside the country where our hosting
              or analytics providers operate, your information may be
              transferred and processed in other jurisdictions.
            </p>

            <h2>9. Policy Updates</h2>
            <p>
              We may update this Privacy Policy as the site evolves. Material
              changes will be reflected by updating the Last Updated date on
              this page.
            </p>

            <h2>10. Contact</h2>
            <p>
              Questions about this Privacy Policy can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAILS.privacy}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {CONTACT_EMAILS.privacy}
              </a>
              .
            </p>

            <h2>11. Unofficial Site Notice</h2>
            <p>
              {SITE_NAME} is an unofficial fan project. It is not affiliated
              with, endorsed by, or operated by the official publishers or
              developers of {SITE_BRAND_NAME}. All game names, logos,
              characters, and related assets remain the property of their
              respective owners.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
