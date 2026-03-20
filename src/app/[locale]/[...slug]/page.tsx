import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getAllContentPaths,
  getAllContent,
  getContentDetail,
  isValidContentType,
  CONTENT_TYPES,
  type ContentType,
  type Language,
  type ContentFrontmatter,
} from "@/lib/content";
import { NavigationPage } from "@/components/content/NavigationPage";
import { DetailPage } from "@/components/content/DetailPage";
import { ArticleStructuredData } from "@/components/content/ArticleStructuredData";
import { ListStructuredData } from "@/components/content/ListStructuredData";
import { routing, type Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/i18n-utils";
import type { Metadata } from "next";
import {
  SITE_BRAND_NAME,
  SITE_HERO_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

interface PageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

export default async function UnifiedContentPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // 验证内容类型
  const contentType = slug[0];
  if (!isValidContentType(contentType)) {
    notFound();
  }

  const isListPage = slug.length === 1;

  if (isListPage) {
    // 渲染列表页
    return renderListPage(contentType, locale as Language);
  } else {
    // 渲染详情页
    const slugPath = slug.slice(1);
    return renderDetailPage(contentType, slugPath, locale as Language);
  }
}

/**
 * 渲染列表页
 */
async function renderListPage(contentType: ContentType, locale: Language) {
  const items = await getAllContent(contentType, locale);

  // 如果只有一篇文章，直接跳转到详情页
  if (items.length === 1) {
    const singleArticle = items[0];
    const detailPath = `/${contentType}/${singleArticle.slug}`;
    const fullPath = locale === "en" ? detailPath : `/${locale}${detailPath}`;
    redirect(fullPath);
  }

  const t = await getTranslations(`pages.${contentType}`);

  try {
    return (
      <>
        <ListStructuredData
          contentType={contentType}
          locale={locale}
          items={items}
        />
        <NavigationPage
          title={t("title")}
          description={t("description")}
          items={items}
          contentType={contentType}
          language={locale}
        />
      </>
    );
  } catch (error) {
    // 如果翻译不存在，使用默认值
    const defaultTitle =
      contentType.charAt(0).toUpperCase() + contentType.slice(1);

    return (
      <>
        <ListStructuredData
          contentType={contentType}
          locale={locale}
          items={items}
        />
        <NavigationPage
          title={defaultTitle}
          description={`Browse all ${contentType} content`}
          items={items}
          contentType={contentType}
          language={locale}
        />
      </>
    );
  }
}

/**
 * 渲染详情页
 */
async function renderDetailPage(
  contentType: ContentType,
  slugPath: string[],
  locale: Language,
) {
  const currentSlug = slugPath.join("/");
  const contentDetail = await getContentDetail(contentType, locale, currentSlug);

  if (!contentDetail) {
    notFound();
  }

  // 获取相关文章
  const allContent = await getAllContent(contentType, locale);
  const relatedArticles = allContent
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 3);

  return (
    <>
      <ArticleStructuredData
        frontmatter={contentDetail.frontmatter as ContentFrontmatter}
        contentType={contentType}
        locale={locale}
        slug={currentSlug}
      />
      <DetailPage
        frontmatter={contentDetail.frontmatter as ContentFrontmatter}
        content={contentDetail.content}
        contentType={contentType}
        language={locale}
        currentSlug={currentSlug}
        relatedArticles={relatedArticles}
      />
    </>
  );
}

/**
 * 生成静态参数
 */
export async function generateStaticParams() {
  const allPaths = await getAllContentPaths();
  const params: { locale: string; slug: string[] }[] = [];

  for (const locale of routing.locales) {
    // 添加列表页
    for (const type of CONTENT_TYPES) {
      params.push({ locale, slug: [type] });
    }

    // 添加详情页
    for (const path of allPaths) {
      params.push({ locale, slug: path });
    }
  }

  return params;
}

/**
 * 生成元数据
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const contentType = slug[0];

  if (!isValidContentType(contentType)) {
    return { title: "Not Found" };
  }

  const isListPage = slug.length === 1;

  if (isListPage) {
    // 列表页元数据
    const t = await getTranslations(`pages.${contentType}`);

    try {
      const title = t("metaTitle");
      const description = t("metaDescription");
      const path = `/${contentType}`;

      return {
        title,
        description,
        alternates: buildLanguageAlternates(path, locale as Locale, SITE_URL),
        openGraph: {
          type: "website",
          title,
          description,
          url: `${SITE_URL}${locale === "en" ? path : `/${locale}${path}`}`,
          siteName: SITE_NAME,
          images: [SITE_HERO_IMAGE],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [SITE_HERO_IMAGE],
        },
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
      };
    } catch {
      // 如果翻译不存在，使用默认值
      const defaultTitle = `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} - ${SITE_NAME}`;
      const path = `/${contentType}`;

      return {
        title: defaultTitle,
        description: `Browse all ${contentType} content for ${SITE_NAME}`,
        alternates: buildLanguageAlternates(path, locale as Locale, SITE_URL),
        openGraph: {
          type: "website",
          title: defaultTitle,
          description: `Browse all ${contentType} content for ${SITE_NAME}`,
          url: `${SITE_URL}${locale === "en" ? path : `/${locale}${path}`}`,
          siteName: SITE_NAME,
          images: [SITE_HERO_IMAGE],
        },
        twitter: {
          card: "summary_large_image",
          title: defaultTitle,
          description: `Browse all ${contentType} content for ${SITE_NAME}`,
          images: [SITE_HERO_IMAGE],
        },
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
      };
    }
  } else {
    // 详情页元数据
    const slugPath = slug.slice(1);
    const currentSlug = slugPath.join("/");

    const contentDetail = await getContentDetail(
      contentType,
      locale as Language,
      currentSlug,
    );

    if (!contentDetail) {
      return { title: "Not Found" };
    }

    const { frontmatter } = contentDetail;
    const fullPath = `/${slug.join("/")}`;

    return {
      title: `${frontmatter.title} - ${SITE_NAME}`,
      description: frontmatter.description,
      alternates: buildLanguageAlternates(
        fullPath,
        locale as Locale,
        SITE_URL,
      ),
      openGraph: {
        type: "article",
        title: frontmatter.title,
        description: frontmatter.description,
        images: frontmatter.image ? [frontmatter.image] : [SITE_HERO_IMAGE],
        url: `${SITE_URL}${locale === "en" ? fullPath : `/${locale}${fullPath}`}`,
        siteName: SITE_NAME,
      },
      twitter: {
        card: "summary_large_image",
        title: `${frontmatter.title} - ${SITE_BRAND_NAME}`,
        description: frontmatter.description,
        images: frontmatter.image ? [frontmatter.image] : [SITE_HERO_IMAGE],
      },
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
    };
  }
}
