import type { ContentFrontmatter, ContentType } from "@/lib/content";
import { SITE_HERO_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

interface ArticleStructuredDataProps {
  frontmatter: ContentFrontmatter;
  contentType: ContentType;
  locale: string;
  slug: string;
}

export function ArticleStructuredData({
  frontmatter,
  contentType,
  locale,
  slug,
}: ArticleStructuredDataProps) {
  const articleUrl =
    locale === "en"
      ? `${SITE_URL}/${contentType}/${slug}`
      : `${SITE_URL}/${locale}/${contentType}/${slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image || SITE_HERO_IMAGE,
    datePublished: frontmatter.date,
    dateModified:
      ("lastModified" in frontmatter && frontmatter.lastModified) ||
      frontmatter.date,
    author: {
      "@type": "Organization",
      name: `${SITE_NAME} Team`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_HERO_IMAGE,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
