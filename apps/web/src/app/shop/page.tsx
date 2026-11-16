import type { Metadata } from "next";
import { getProducts } from "@/lib/shop";
import { profile } from "@/lib/profile";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = {
  title: "Shop",
  description: "Code kits, guides and fixed-price services by Ivan Christian Salinas, full-stack developer.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <div className="shop-intro">
        <p className="pf-tile-kind">Shop</p>
        <h1>Code kits, guides and services</h1>
        <p>Built from the same work as my portfolio. Pay with GCash, Maya or card.</p>
      </div>
      {products.length ? (
        <ul className="shop-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</ul>
      ) : (
        <div className="shop-empty">
          <h2>Coming soon</h2>
          <p>The first products are being prepared. To ask about a project or a service now, email <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
        </div>
      )}
    </>
  );
}
