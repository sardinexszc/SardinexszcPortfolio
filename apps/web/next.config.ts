import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

// Everything the browser loads is same-origin: next/font self-hosts fonts, next/image serves local files,
// tracking calls same-origin /api routes, and Google sign-in is a full-page redirect (not a fetch).
// 'unsafe-inline' scripts remain because Next's inline bootstrap needs either it or per-request nonces,
// and nonces would make the static homepage render on every request.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/track-download': ['./assets/resume/2026_ICLSalinas_Resume.pdf'],
  },
  allowedDevOrigins: ["192.168.100.188", "192.168.100.190", "localhost"],
  // Local images plus the CMS bucket only. The optimizer serves both from this origin, so CSP img-src stays 'self'.
  // The pattern is limited to the one public bucket, so the optimizer cannot proxy anything else on that host.
  images: {
    // 90 for the photos and screenshots: 75 softens text in the project screenshots.
    qualities: [75, 90],
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-media/**`)]
      : [],
  },
  // CMS image uploads go through Server Actions; the bucket itself caps files at 4 MB.
  // inlineCss: the home page CSS is ~11 KB compressed, so shipping it inside the HTML saves the
  // render-blocking stylesheet round trip for first-time visitors (most visitors to a portfolio).
  experimental: { serverActions: { bodySizeLimit: "5mb" }, inlineCss: true },
  async headers() {
    if (isDevelopment) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
          // Isolates the window from cross-origin openers. Google sign-in is a full-page redirect, so this is safe.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
