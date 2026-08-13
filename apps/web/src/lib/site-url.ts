const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteOrigin(rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL): string | undefined {
  const value = rawSiteUrl?.trim() ?? process.env.VERCEL_URL?.trim();
  if (!value) return process.env.NODE_ENV === "development" ? LOCAL_SITE_URL : undefined;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return process.env.NODE_ENV === "development" ? LOCAL_SITE_URL : undefined;
  }
}

export function getSiteUrl(rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL): URL | undefined {
  const origin = getSiteOrigin(rawSiteUrl);
  return origin ? new URL(origin) : undefined;
}
