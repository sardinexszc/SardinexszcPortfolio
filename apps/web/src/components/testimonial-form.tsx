"use client";

import { useActionState, useState } from "react";
import { submitTestimonial, type SubmitState } from "@/app/testimonial-actions";
import { RELATIONSHIPS } from "@/lib/types";

function MessageField({ initial }: { initial: string }) {
  const [length, setLength] = useState(initial.length);
  return (
    <label className="pf-tform-wide">Message
      <textarea name="quote" required minLength={20} maxLength={800} rows={5} defaultValue={initial} aria-describedby="tform-count" onChange={(event) => setLength(event.target.value.length)} />
      <span id="tform-count" className="pf-tform-hint">{length}/800 · no links</span>
    </label>
  );
}

// Visitor testimonial form. Submissions wait for review, so the thank-you says so.
export function TestimonialForm() {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitTestimonial, {});
  if (state.ok) return <p role="status" className="pf-tform-done">Thank you. Your testimonial will appear once it has been reviewed.</p>;
  const values = state.values ?? {};
  // A new key after each failed attempt remounts the fields with what the visitor typed (React clears
  // a form after its action runs).
  return (
    <form key={state.attempt ?? 0} action={action} className="pf-tform">
      <label>Name<input name="name" required minLength={2} maxLength={80} autoComplete="name" defaultValue={values.name} /></label>
      <label>Role and company <span>(optional)</span><input name="role" maxLength={120} autoComplete="organization-title" placeholder="e.g. Project lead, CLSU" defaultValue={values.role} /></label>
      <label>How we worked together
        <select name="relationship" required defaultValue={values.relationship ?? ""}>
          <option value="" disabled>Choose one</option>
          {RELATIONSHIPS.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <MessageField initial={values.quote ?? ""} />
      <label className="pf-tform-wide">Email <span>(optional, private: only used to verify you, never shown)</span><input name="email" type="email" maxLength={254} autoComplete="email" defaultValue={values.email} /></label>
      {/* Honeypot: hidden from people and screen readers; bots tend to fill every field. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="pf-tform-trap" />
      <label className="pf-tform-wide pf-tform-check"><input type="checkbox" name="consent" required defaultChecked={values.consent === "on"} /> I agree to this being shown on the site with my name and role.</label>
      {state.error && <p role="alert" className="pf-tform-error">{state.error}</p>}
      <button type="submit" className="pf-pill" disabled={pending}>{pending ? "Sending…" : "Send testimonial"}</button>
    </form>
  );
}
