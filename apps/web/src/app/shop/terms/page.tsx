import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/profile";
import { DOWNLOAD_DAYS, DOWNLOAD_LIMIT } from "@/lib/shop";

export const metadata: Metadata = { title: "Terms of sale", alternates: { canonical: "/shop/terms" } };

export default function TermsPage() {
  return (
    <div className="shop-legal">
      <h1>Terms of sale</h1>
      <p className="shop-note">Last updated: November 2026</p>
      <p>These terms apply to purchases from the shop at this website, sold by {profile.name}, {profile.location} (&ldquo;I&rdquo;). By buying, you agree to them.</p>
      <h2>Products</h2>
      <p><strong>Code kits and guides</strong> are digital files delivered by download. <strong>Services</strong> are work I do for you as described on the product page; the scope is confirmed by email before work starts.</p>
      <h2>Prices and payment</h2>
      <p>Prices are in Philippine pesos (PHP) and are shown before you pay. Payment is processed by PayMongo (GCash, Maya or card). I never see or store your card or wallet details. If you pay with a card issued outside the Philippines, your bank converts the amount and may charge a fee.</p>
      <h2>Delivery</h2>
      <p>After payment, digital products can be downloaded from the confirmation page and from the link in your receipt email, up to {DOWNLOAD_LIMIT} times within {DOWNLOAD_DAYS} days. If a link expires, email me with your order number for a new one.</p>
      <h2>License for code kits and guides</h2>
      <p>You may use what you buy in your own personal and commercial projects, including client work. You may not resell, share or publish the files themselves, or offer them as a template or course of your own.</p>
      <h2>Refunds</h2>
      <p>See the <Link href="/shop/refunds">refund policy</Link>.</p>
      <h2>Liability</h2>
      <p>Code kits and guides are provided as is. I take care that they work as described, but I am not liable for indirect losses from their use. Nothing in these terms limits your rights under Philippine consumer law.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
    </div>
  );
}
