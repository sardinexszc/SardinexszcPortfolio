import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

// Applies the saved or system theme before first paint so dark-mode visitors do not see a light flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

const title = "Ivan Christian Salinas — Full-Stack Software Engineer";
const description =
  "Full-stack web developer in the Philippines building database-backed web applications with Laravel, PHP, Next.js, React, TypeScript, MySQL, and PostgreSQL. Open to full-time, contract, and remote roles.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#171716" },
  ],
};

export const metadata: Metadata = {
  title,
  description,
  metadataBase: getSiteUrl(),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Ivan Christian L. Salinas" }],
  creator: "Ivan Christian L. Salinas",
  openGraph: {
    type: "profile",
    title,
    description,
    url: "/",
    siteName: "Ivan Christian L. Salinas Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  keywords: [
    "Full-Stack Software Engineer",
    "Full-Stack Web Developer",
    "Laravel Developer",
    "PHP",
    "Next.js",
    "React",
    "TypeScript",
    "MySQL",
    "PostgreSQL",
    "REST API",
    "Philippines",
    "Remote",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
