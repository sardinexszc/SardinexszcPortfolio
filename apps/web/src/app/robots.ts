import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/analytics", "/loginauthentication", "/auth/", "/api/"] },
    sitemap: `${getSiteOrigin()}/sitemap.xml`,
  };
}
