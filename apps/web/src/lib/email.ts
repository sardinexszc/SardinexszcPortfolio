import "server-only";

// Transactional email through Resend's REST API (https://resend.com/docs/api-reference/emails/send-email).
// Without RESEND_API_KEY the email is skipped: the thank-you page still shows the buyer everything.
export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.SHOP_FROM_EMAIL);
}

export async function sendEmail(input: { to: string; subject: string; html: string; text: string; replyTo?: string }): Promise<boolean> {
  if (!emailConfigured()) {
    console.warn("Email skipped: RESEND_API_KEY or SHOP_FROM_EMAIL is not set");
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.SHOP_FROM_EMAIL, to: [input.to], subject: input.subject, html: input.html, text: input.text, reply_to: input.replyTo }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Resend failed (${response.status}): ${await response.text().catch(() => "")}`);
  return true;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
