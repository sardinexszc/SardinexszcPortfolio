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
  title: "Sardinexszc — Product designer & developer",
  description: "The portfolio of Sardinexszc, a product designer and developer building clear, useful experiences for the web.",
  metadataBase: getSiteUrl(),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${sans.variable} ${mono.variable}`}><ThemeProvider>{children}<div className="theme-floating"><ThemeToggle /></div></ThemeProvider></body></html>;
}