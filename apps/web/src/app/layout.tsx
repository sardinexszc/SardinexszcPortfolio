import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import "./chatbot.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Ivan Christian Salinas — Full-Stack Software Engineer",
  description:
    "Portfolio of Ivan Christian Salinas, a full-stack software engineer building production systems for research and institutional operations using Next.js, Laravel, APIs, databases, automation, and AI integrations.",
  metadataBase: getSiteUrl(),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Ivan Christian Salinas — Full-Stack Software Engineer",
    description:
      "Production-focused software engineer building web systems, APIs, databases, automation workflows, and AI-enabled applications for real organizations.",
    url: "/",
    siteName: "Sardinexszc Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivan Christian Salinas — Full-Stack Software Engineer",
    description:
      "Portfolio showcasing real-world full-stack engineering work across research systems, web platforms, APIs, databases, and automation.",
  },
  keywords: [
    "Full-Stack Software Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Laravel",
    "PHP",
    "REST API",
    "PostgreSQL",
    "Supabase",
    "ESP32",
    "Arduino",
    "PlatformIO",
    "Sensors",
    "n8n automation",
    "LLM integration",
    "IoT systems",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider>
          {children}
          <div className="theme-floating"><ThemeToggle /></div>
        </ThemeProvider>
      </body>
    </html>
  );
}