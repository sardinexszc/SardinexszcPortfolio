import type { Metadata } from "next";
import { getProducts } from "@/lib/api";
import { profile } from "@/lib/profile";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = {
  title: "Shop",
  description: "Products Ivan Christian Salinas uses and recommends, with Shopee and TikTok Shop affiliate links.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <div className="shop-intro">
        <p className="pf-tile-kind">Shop</p>
        <h1>Things I use and recommend</h1>
        {/* Disclosure before any link: these are affiliate links. */}
        <p>These are affiliate links. If you buy through them, I earn a small commission from Shopee or TikTok Shop at no extra cost to you. Orders, payment, delivery and returns are handled by the platform.</p>
      </div>
      {products.length ? (
        <ul className="shop-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</ul>
      ) : (
        <div className="shop-empty">
          <h2>Coming soon</h2>
          <p>The first picks are being added. Questions in the meantime: <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
        </div>
      )}
    </>
  );
}
