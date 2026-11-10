import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTENT_TAG } from "@/lib/api";

export type ProductKind = "digital" | "guide" | "service";

// What the storefront may show. file_path never leaves the server.
export type Product = {
  id: number;
  slug: string;
  kind: ProductKind;
  title: string;
  summary: string;
  body: string | null;
  price_php: number;
  cover_image: string | null;
};

export const PUBLIC_PRODUCT_COLUMNS = "id,slug,kind,title,summary,body,price_php,cover_image";

export const KIND_LABEL: Record<ProductKind, string> = { digital: "Code kit", guide: "Guide", service: "Service" };

export const formatPeso = (pesos: number) => `₱${pesos.toLocaleString("en-PH")}`;
export const formatCentavos = (centavos: number) => `₱${(centavos / 100).toLocaleString("en-PH", { minimumFractionDigits: centavos % 100 ? 2 : 0 })}`;

// Download limits for digital products and guides.
export const DOWNLOAD_LIMIT = 5;
export const DOWNLOAD_DAYS = 7;

// CMS saves call updateTag(CONTENT_TAG), so product edits show on the next request.
const loadProducts = unstable_cache(async (): Promise<Product[]> => {
  const { data, error } = await createAdminClient().from("products").select(PUBLIC_PRODUCT_COLUMNS)
    .eq("active", true).order("sort_order").order("id");
  if (error) throw error;
  return (data ?? []) as Product[];
}, ["shop-products"], { tags: [CONTENT_TAG], revalidate: 3600 });

export async function getProducts(): Promise<Product[]> {
  if (!process.env.SUPABASE_SECRET_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    return await loadProducts();
  } catch (error) {
    console.error("Shop products could not be loaded", error);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  return (await getProducts()).find((product) => product.slug === slug) ?? null;
}
