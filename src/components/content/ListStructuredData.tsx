import type { ContentFrontmatter, ContentType } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface ListStructuredDataProps {
  contentType: ContentType;
  locale: string;
  items: Array<{ slug: string; frontmatter: ContentFrontmatter }>;
}

export function ListStructuredData({
  contentType,
  locale,
  items,
}: ListStructuredDataProps) {
  const listUrl =
    locale === "en"
      ? `${SITE_URL}/${contentType}`
      : `${SITE_URL}/${locale}/${contentType}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} ${contentType}`,
    url: listUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url:
        locale === "en"
          ? `${SITE_URL}/${contentType}/${item.slug}`
          : `${SITE_URL}/${locale}/${contentType}/${item.slug}`,
      name: item.frontmatter.title,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
