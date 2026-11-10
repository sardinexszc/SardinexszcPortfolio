import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DOWNLOAD_DAYS, DOWNLOAD_LIMIT, formatPeso, getProduct, KIND_LABEL } from "@/lib/shop";
import { paymongoConfigured } from "@/lib/payments/paymongo";
import { isAllowedImage } from "@/lib/work-projects";
import { BuyForm } from "@/components/shop/buy-form";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ cancelled?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.summary, alternates: { canonical: `/shop/${product.slug}` } };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const [{ slug }, { cancelled }] = await Promise.all([params, searchParams]);
  const product = await getProduct(slug);
  if (!product) notFound();
  const delivery = product.kind === "service"
    ? "After payment you get an email with the next steps, and I contact you within 1 business day."
    : `After payment you get a download link by email and on the confirmation page. It works ${DOWNLOAD_LIMIT} times within ${DOWNLOAD_DAYS} days.`;

  return (
    <article className="shop-product">
      <Link className="shop-back" href="/shop"><ArrowLeft size={15} aria-hidden="true" /> All products</Link>
      <div className="shop-product-grid">
        <div>
          <p className="pf-tile-kind">{KIND_LABEL[product.kind]}</p>
          <h1>{product.title}</h1>
          <p className="shop-lede">{product.summary}</p>
          {isAllowedImage(product.cover_image) ? (
            <div className="shop-product-media"><Image src={product.cover_image} alt="" fill quality={90} sizes="(max-width: 800px) 100vw, 60vw" /></div>
          ) : null}
          {product.body ? <div className="shop-body">{product.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div> : null}
        </div>
        <aside className="shop-aside" aria-label="Buy">
          <p className="shop-price shop-price-big">{formatPeso(product.price_php)}</p>
          <p className="shop-note">{delivery}</p>
          {cancelled ? <p role="status" className="shop-note shop-cancelled">Checkout was cancelled. You were not charged.</p> : null}
          <BuyForm slug={product.slug} price={formatPeso(product.price_php)} open={paymongoConfigured()} />
        </aside>
      </div>
    </article>
  );
}
