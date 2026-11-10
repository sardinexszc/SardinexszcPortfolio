import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";
import { getProducts } from "@/lib/shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const products = await getProducts();
  return [
    { url: origin, lastModified: new Date() },
    { url: `${origin}/shop`, lastModified: new Date() },
    ...products.map((product) => ({ url: `${origin}/shop/${product.slug}`, lastModified: new Date() })),
  ];
}
