"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientAddress, consumeRateLimit } from "@/lib/tracking-limit";
import { RELATIONSHIPS } from "@/lib/types";

// On an error the typed values come back too: React resets a form after its action runs, and the form
// uses these as defaults so the visitor does not lose what they wrote.
export type SubmitState = { ok?: boolean; error?: string; values?: Record<string, string>; attempt?: number };

const field = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
};

// Public form: anyone can call this. Every row lands as 'pending' and stays off the site until the
// admin approves it on /analytics/testimonials.
export async function submitTestimonial(_previous: SubmitState, form: FormData): Promise<SubmitState> {
  // Honeypot: people never see this field. Pretend success so bots learn nothing.
  if (field(form, "website")) return { ok: true };

  const name = field(form, "name"), role = field(form, "role"), relationship = field(form, "relationship");
  const quote = field(form, "quote"), email = field(form, "email");
  const fail = (error: string): SubmitState => ({
    error, attempt: Date.now(), values: { name, role, relationship, quote, email, consent: form.get("consent") === "on" ? "on" : "" },
  });
  // Count code points like Postgres char_length, so an emoji can't pass here and fail the DB check.
  const chars = (value: string) => [...value].length;
  if (chars(name) < 2 || chars(name) > 80) return fail("Enter your name (2–80 characters).");
  if (chars(role) > 120) return fail("Keep your role and company under 120 characters.");
  if (!(RELATIONSHIPS as readonly string[]).includes(relationship)) return fail("Choose how we worked together.");
  if (chars(quote) < 20 || chars(quote) > 800) return fail("Write a message between 20 and 800 characters.");
  if (/https?:\/\/|www\./i.test(quote)) return fail("Please leave links out of the message.");
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return fail("Check your email address, or leave it empty.");
  if (form.get("consent") !== "on") return fail("Tick the box to agree to your words being shown.");

  try {
    const requestHeaders = await headers();
    const host = (requestHeaders.get("host") ?? "unknown").toLowerCase();
    if (!await consumeRateLimit(host, clientAddress(requestHeaders), "testimonial", 3, 3600)) {
      return fail("You've sent a few already. Please try again in an hour.");
    }
    const { error } = await createAdminClient().from("testimonials").insert({
      name, role: role || null, relationship, quote, email: email || null, status: "pending", source: "form",
    });
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Testimonial submission failed", error);
    return fail("It couldn't be sent right now. Please try again later.");
  }
}
