export function buildWhatsAppLink(phone: string, message: string): string {
  const formatted = phone.replace(/[^+0-9]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${formatted.startsWith("+") ? formatted.slice(1) : formatted}?text=${encoded}`;
}

export function buildTelegramLink(username: string): string {
  const normalized = username.replace(/^@/, "");
  return `https://t.me/${normalized}`;
}
