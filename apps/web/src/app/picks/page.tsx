import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import { isAllowedImage } from "@/lib/work-projects";
import "@/components/portfolio-page.css";

export const metadata: Metadata = {
  title: "Picks",
  description: "Products I use and recommend, with Shopee and TikTok Shop affiliate links.",
};

export default async function PicksPage() {
  const products = await getProducts();
  return (
    <div className="pf">
      <header className="pf-bar">
        <Link className="pf-brand" href="/" aria-label="Ivan Salinas, back to the portfolio"><span className="pf-mark" aria-hidden="true">I<span>S</span></span>Ivan Salinas</Link>
      </header>
      <main id="main-content" className="pf-picks">
        <section className="pf-section" aria-labelledby="picks-title">
          <div className="pf-label-row"><h1 id="picks-title">Picks</h1><span>({products.length})</span></div>
          {/* Disclosure first, before any link: these are affiliate links. */}
          <p className="pf-picks-disclosure">Things I use and recommend. These are affiliate links: if you buy through them, I earn a small commission from Shopee or TikTok Shop at no extra cost to you.</p>
          {products.length ? (
            <ul className="pf-picks-grid">
              {products.map((product) => (
                <li key={product.id}>
                  <a href={product.affiliate_url} target="_blank" rel="sponsored nofollow noopener noreferrer">
                    <div className="pf-picks-media">
                      {isAllowedImage(product.image_url)
                        ? <Image src={product.image_url} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" />
                        : <span>{product.category || product.platform}</span>}
                    </div>
                    <p className="pf-picks-meta">{[product.category, product.price].filter(Boolean).join(" · ")}</p>
                    <h2>{product.title}</h2>
                    {product.note ? <p className="pf-picks-note">{product.note}</p> : null}
                    <span className="pf-picks-cta">Buy on {product.platform} <ArrowUpRight size={15} aria-hidden="true" /><span className="visually-hidden"> (opens in a new tab)</span></span>
                  </a>
                </li>
              ))}
            </ul>
          ) : <p className="pf-picks-note">No picks yet. Check back soon.</p>}
        </section>
      </main>
    </div>
  );
}
