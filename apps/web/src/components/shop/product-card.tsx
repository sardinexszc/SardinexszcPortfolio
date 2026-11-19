import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { isAllowedImage } from "@/lib/work-projects";

// The whole card is the affiliate link: there is no product page or checkout on this site.
export function ProductCard({ product }: { product: Product }) {
  return (
    <li className="shop-card">
      <a href={product.affiliate_url} target="_blank" rel="sponsored nofollow noopener noreferrer">
        <div className="shop-card-media">
          {isAllowedImage(product.image_url)
            ? <Image src={product.image_url} alt="" fill quality={90} sizes="(max-width: 800px) 100vw, 33vw" />
            : <div className="pf-tile-card"><span>{product.platform}</span><strong>{product.title}</strong></div>}
        </div>
        <p className="pf-tile-kind">{[product.category, product.price].filter(Boolean).join(" · ") || product.platform}</p>
        <h2>{product.title}</h2>
        {product.note ? <p className="shop-card-summary">{product.note}</p> : null}
        <span className="shop-cta">Buy on {product.platform} <ArrowUpRight size={15} aria-hidden="true" /><span className="visually-hidden"> (opens in a new tab)</span></span>
      </a>
    </li>
  );
}
