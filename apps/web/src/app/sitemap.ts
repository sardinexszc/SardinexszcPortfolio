import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap { return [{ url: getSiteOrigin(), lastModified: new Date() }]; }