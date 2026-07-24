const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteOrigin(rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL): string {
  const value = rawSiteUrl?.trim();
  if (!value) return FALLBACK_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl(rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL): URL {
  return new URL(getSiteOrigin(rawSiteUrl));
}
