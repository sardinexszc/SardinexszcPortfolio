const FALLBACK_SITE_URL = "http://localhost:3000";

// SITE_URL first; on Vercel the production domain is always known, so canonical links never fall back to localhost.
export function getSiteOrigin(rawSiteUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL): string {
  const value = rawSiteUrl?.trim();
  if (!value) return FALLBACK_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl(rawSiteUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL): URL {
  return new URL(getSiteOrigin(rawSiteUrl));
}
