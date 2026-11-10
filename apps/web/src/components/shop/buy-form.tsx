"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowUpRight } from "lucide-react";
import { startCheckout, type CheckoutState } from "@/app/shop/actions";

export function BuyForm({ slug, price, open }: { slug: string; price: string; open: boolean }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(startCheckout, {});
  return (
    <form action={action} className="shop-buy" noValidate={false}>
      <input type="hidden" name="product" value={slug} />
      <label htmlFor="buy-name">Your name</label>
      <input id="buy-name" name="name" autoComplete="name" required maxLength={120} />
      <label htmlFor="buy-email">Email <small>(receipt and download link)</small></label>
      <input id="buy-email" name="email" type="email" autoComplete="email" required maxLength={254} />
      <label className="shop-agree">
        <input type="checkbox" name="agree" required /> <span>I agree to the <Link href="/shop/terms">terms</Link> and <Link href="/shop/refunds">refund policy</Link>.</span>
      </label>
      {state.error ? <p role="alert" className="shop-error">{state.error}</p> : null}
      <button type="submit" className="pf-pill shop-pay" disabled={pending || !open} aria-disabled={pending || !open}>
        {open ? (pending ? "Opening checkout…" : <>Pay {price} <ArrowUpRight size={15} aria-hidden="true" /></>) : "Checkout opens soon"}
      </button>
      <p className="shop-note">Secure checkout by PayMongo: GCash, Maya or card. Prices are in Philippine pesos; cards from other countries are converted by your bank.</p>
    </form>
  );
}
