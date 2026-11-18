import type { Metadata } from "next";
import { profile } from "@/lib/profile";
import { ShopShell } from "@/components/shop/shop-shell";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <ShopShell>
      <div className="shop-legal">
        <h1>Privacy</h1>
        <p className="shop-note">Last updated: November 2026</p>
        <p>This website is run by {profile.name}, {profile.location}. This page explains what personal data it collects and why, in line with the Philippine Data Privacy Act of 2012.</p>
        <h2>Visiting the site</h2>
        <p>The site counts visits with a first-party cookie and records approximate location (country and city, inferred by the hosting provider), device type and browser, résumé and CV downloads, and clicks on project links. It does not store your IP address or use third-party trackers or advertising cookies.</p>
        <h2>Buying from the shop</h2>
        <p>When you buy, I keep your name, email address, what you bought, the amount and the payment status, to deliver your purchase, send your receipt, handle refunds and meet tax record-keeping duties. Payment details (card or wallet) are handled by PayMongo and never reach this site.</p>
        <h2>Testimonials</h2>
        <p>If you send a testimonial, I keep your name, role, relationship and message, plus your email if you give it (never shown publicly).</p>
        <h2>Who processes the data</h2>
        <p>Vercel (hosting), Supabase (database and file storage), PayMongo (payments) and Resend (receipt emails). Each processes data only to provide its service.</p>
        <h2>How long it is kept</h2>
        <p>Order records are kept for as long as tax rules require. Visit statistics are kept in aggregate. You can ask me to delete anything not required by law.</p>
        <h2>Your rights</h2>
        <p>You can ask to see, correct or delete your personal data, or object to its use, by emailing <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
      </div>
    </ShopShell>
  );
}
