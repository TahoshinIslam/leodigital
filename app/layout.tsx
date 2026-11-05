import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Leotech — Marketing that creates market leaders",
    template: "%s | Leotech",
  },
  description:
    "Leotech is the digital marketing partner behind Bangladesh's ambitious brands. SEO, performance media, content, and web experiences — engineered to compound.",
  applicationName: "Leotech",
  openGraph: { type: "website", siteName: "Leotech", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#040a0a",
  colorScheme: "dark light",
};

/** Root layout: document shell only. Fonts and chrome live in the (site) and admin layouts. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
