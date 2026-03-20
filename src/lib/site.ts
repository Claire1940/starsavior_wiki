export const SITE_BRAND_NAME = "Star Savior";
export const SITE_NAME = "Star Savior Wiki";
export const SITE_DOMAIN = "starsavior.wiki";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE_DOMAIN}`;
export const SITE_HERO_IMAGE = `${SITE_URL}/images/hero.webp`;
export const LAST_UPDATED = "March 20, 2026";

export const OFFICIAL_LINKS = {
  website: "https://www.starsavior.com/",
  news: "https://www.starsavior.com/en/news",
  x: "https://x.com/StarSavior_EN",
  youtube: "https://www.youtube.com/@StarSavior_EN",
  discord: "https://discord.com/invite/UHNYfe9C77",
  reddit: "https://www.reddit.com/r/StarSavior/",
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.studiobside.starMain",
} as const;

export const ORGANIZATION_SAME_AS = [
  OFFICIAL_LINKS.website,
  OFFICIAL_LINKS.news,
  OFFICIAL_LINKS.x,
  OFFICIAL_LINKS.youtube,
  OFFICIAL_LINKS.discord,
  OFFICIAL_LINKS.reddit,
  OFFICIAL_LINKS.googlePlay,
];

export const CONTACT_EMAILS = {
  contact: `contact@${SITE_DOMAIN}`,
  support: `support@${SITE_DOMAIN}`,
  contribute: `contribute@${SITE_DOMAIN}`,
  partnerships: `partnerships@${SITE_DOMAIN}`,
  privacy: `privacy@${SITE_DOMAIN}`,
  legal: `legal@${SITE_DOMAIN}`,
  copyright: `copyright@${SITE_DOMAIN}`,
  dmca: `dmca@${SITE_DOMAIN}`,
} as const;
