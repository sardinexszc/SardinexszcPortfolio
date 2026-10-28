import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are closed to crawlers; only production is indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/analytics", "/loginauthentication", "/auth/", "/api/"] },
    sitemap: `${getSiteOrigin()}/sitemap.xml`,
  };
}
