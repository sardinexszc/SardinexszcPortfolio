import type { Metadata, Viewport } from "next";
import { DM_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

// Applies the saved or system theme before first paint so dark-mode visitors do not see a light flash.
const themeScript = `try{var t=localStorage.getItem("theme-preference");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

const title = "Ivan Christian Salinas — Full-Stack Developer (Laravel, Next.js, PostgreSQL)";
// Kept under 160 characters so search results show it whole.
const description =
  "Full-stack developer in the Philippines building production web apps with Laravel, Next.js and PostgreSQL. Data engineering, IoT. Open to remote IT roles.";
// Preview deployments share the content but must not compete with the real site in search.
const indexable = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f0f0" },
    { media: "(prefers-color-scheme: dark)", color: "#161615" },
  ],
};

export const metadata: Metadata = {
  title,
  description,
  metadataBase: getSiteUrl(),
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
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
    "Ivan Christian Salinas",
    "Full-Stack Software Engineer",
    "Full-Stack Web Developer",
    "Data Engineering",
    "IoT",
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
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
