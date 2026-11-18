import Image from "next/image";
import Link from "next/link";
import { formatPeso, KIND_LABEL, type Product } from "@/lib/shop";
import { isAllowedImage } from "@/lib/work-projects";

export function ProductCard({ product }: { product: Product }) {
  return (
    <li className="shop-card">
      <Link href={`/shop/${product.slug}`}>
        <div className="shop-card-media">
          {isAllowedImage(product.cover_image)
            ? <Image src={product.cover_image} alt="" fill quality={90} sizes="(max-width: 800px) 100vw, 33vw" />
            : <div className="pf-tile-card"><span>{KIND_LABEL[product.kind]}</span><strong>{product.title}</strong></div>}
        </div>
        <p className="pf-tile-kind">{KIND_LABEL[product.kind]}</p>
        <h2>{product.title}</h2>
        <p className="shop-card-summary">{product.summary}</p>
        <p className="shop-price">{formatPeso(product.price_php)}</p>
      </Link>
    </li>
  );
}
