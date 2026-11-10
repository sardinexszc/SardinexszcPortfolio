import type { Metadata } from "next";
import { profile } from "@/lib/profile";

export const metadata: Metadata = { title: "Refund policy", alternates: { canonical: "/shop/refunds" } };

export default function RefundsPage() {
  return (
    <div className="shop-legal">
      <h1>Refund policy</h1>
      <p className="shop-note">Last updated: November 2026</p>
      <h2>Code kits and guides</h2>
      <p>Because digital files cannot be returned, sales are final once downloaded, except when the file is broken, incomplete or clearly not as described. In that case, email me within 7 days of purchase: I will fix it or give you a full refund.</p>
      <h2>Services</h2>
      <p>You can cancel for a full refund before work starts. After work starts, I refund the part not yet delivered. Consultations can be rescheduled once, free, with at least 24 hours&apos; notice.</p>
      <h2>How refunds are paid</h2>
      <p>Refunds go back to the original payment method through PayMongo. They usually arrive within 5 to 10 business days, depending on your bank or wallet.</p>
      <h2>Ask for a refund</h2>
      <p>Email <a href={`mailto:${profile.email}`}>{profile.email}</a> with your order number and the reason.</p>
    </div>
  );
}
